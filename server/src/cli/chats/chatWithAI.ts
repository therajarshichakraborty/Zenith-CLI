import chalk from "chalk";
import { text, isCancel } from "@clack/prompts";
import yoctoSpinner from "yocto-spinner";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import { GoogleAiService } from "../ai/google.service";
import { ChatService } from "../../service/char.service";
import { getStoredToken } from "../commands/auth/login";
import prisma from "../../lib/db";

const W       = Math.min(process.stdout.columns || 80, 96);
const PAD     = "  ";
const hr      = (ch = "─") => chalk.dim(ch.repeat(W));
const hrBold  = ()          => chalk.hex("#3F3F46")("─".repeat(W));

const C = {
  purple:    chalk.hex("#A78BFA"),   // primary brand
  violet:    chalk.hex("#7C3AED"),
  green:     chalk.hex("#34D399"),   // AI response / success
  blue:      chalk.hex("#60A5FA"),   // user / info
  amber:     chalk.hex("#FCD34D"),   // warn / highlight
  sky:       chalk.hex("#7DD3FC"),   // code
  dim:       chalk.dim,
  white:     chalk.white,
  muted:     chalk.hex("#71717A"),   // zinc-500
  error:     chalk.hex("#F87171"),   // red-400
};

marked.use(
  markedTerminal({
    code:         C.sky,
    blockquote:   C.muted.italic,
    heading:      C.purple.bold,
    firstHeading: C.purple.bold,
    hr:           C.muted,
    listitem:     C.white,
    list:         C.white,
    paragraph:    C.white,
    strong:       chalk.bold.white,
    em:           chalk.italic,
    codespan:     C.amber.bgHex("#1C1917"),
    del:          C.muted.strikethrough,
    link:         C.sky.underline,
    href:         C.sky.underline,
  }) as any
);

const aiService   = new GoogleAiService();
const chatService = new ChatService();

function print(s = "")  { console.log(s); }
function gap()          { print(); }
function rule()         { print(hr()); }
function boldRule()     { print(hrBold()); }
function label(icon: string, color: typeof C.purple, text: string) {
  return `${PAD}${color.bold(icon)}  ${C.muted(text)}`;
}

// Indent every line of a multi-line string
function indent(s: string, pad = PAD) {
  return s.split("\n").map((l) => pad + l).join("\n");
}

async function getUserFromToken() {
  const token = await getStoredToken();
  if (!token?.access_token) {
    throw new Error("Not authenticated. Please run 'zenith login' first.");
  }

  const spinner = yoctoSpinner({ text: C.muted("Authenticating…") }).start();

  const user = await prisma.user.findFirst({
    where: { sessions: { some: { token: token.access_token } } },
  });

  if (!user) {
    spinner.error("Authentication failed");
    throw new Error("User not found. Please login again.");
  }

  spinner.success(
    C.green("✓") + "  " + C.white.bold(user.name || "User") + C.muted("  authenticated")
  );
  return user;
}

async function initConvo(userId: string, conversationId: string | null = null, mode: string = "chat") {
  const spinner = yoctoSpinner({ text: C.muted("Loading conversation…") }).start();
  const conversation = await chatService.getOrCreateConversation(userId, conversationId, mode);
  spinner.stop();

  gap();
  boldRule();
  gap();
  print(`${PAD}${C.purple.bold("◆ " + conversation.title)}`);
  print(`${PAD}${C.muted(conversation.id + "  ·  mode: " + conversation.mode)}`);
  gap();
  boldRule();

  if (conversation.messages?.length > 0) {
    gap();
    print(`${PAD}${C.muted.italic("↑  " + conversation.messages.length + " message(s) from previous session")}`);
    gap();
    displayMessages(conversation.messages);
  }

  return conversation;
}

async function saveMessage(conversationId: string, role: string, content: string) {
  return await chatService.addMessage(conversationId, role, content);
}

async function getAIResponse(conversationId: string) {
  const spinner = yoctoSpinner({
    text: C.muted("Generating response…"),
    color: "cyan",
  }).start();

  const dbMessages = await chatService.getMessages(conversationId);
  const aiMessages  = chatService.formatMessagesForAI(dbMessages);

  let fullResponse = "";

  try {
    await aiService.sendMessage(aiMessages, (chunk) => {
      fullResponse += chunk;
    });

    spinner.stop();

    gap();
    print(
      `${PAD}${C.green.bold("◆ Zenith")}` +
      `  ${C.muted("─".repeat(W - 12))}`
    );
    gap();

    const rendered = marked.parse(fullResponse) as string;
    const trimmed  = rendered.trimEnd();

    print(indent(trimmed, PAD));

    gap();
    rule();
    gap();

    return fullResponse;
  } catch (error) {
    spinner.error(C.error("Failed to get AI response"));
    throw error;
  }
}

export async function startChat(mode: string = "chat", conversationId: string | null = null) {
  try {
    console.clear();

    gap();
    print(
      `${PAD}${C.purple.bold("◆  Z E N I T H")}` +
      `  ${C.muted("·")}  ${C.muted("AI Chat")}` +
      `  ${C.muted("·")}  ${C.muted("v0.1.0")}`
    );
    gap();
    print(hr("═"));
    gap();

    const user         = await getUserFromToken();
    const conversation = await initConvo(user.id, conversationId, mode);
    await chatLoop(conversation);

    gap();
    print(hr("═"));
    print(`${PAD}${C.muted("Session ended.")}  ${C.green("✓")}`);
    gap();
  } catch (error: any) {
    gap();
    print(`${PAD}${C.error("✖")}  ${C.error.bold("Error:")}  ${C.white(error.message)}`);
    gap();
    process.exit(1);
  }
}

function displayMessages(messages: { role: string; content: string }[]) {
  messages.forEach((msg, i) => {
    if (msg.role === "user") {
      print(
        `${PAD}${C.blue.bold("you")}` +
        `  ${C.muted("─".repeat(W - 7))}`
      );
      gap();
      print(indent(C.white(msg.content)));
      gap();
    } else {
      print(
        `${PAD}${C.green.bold("◆ Zenith")}` +
        `  ${C.muted("─".repeat(W - 12))}`
      );
      gap();
      const rendered = marked.parse(msg.content) as string;
      print(indent(rendered.trimEnd()));
      gap();
    }

    if (i < messages.length - 1) rule();
  });

  boldRule();
  gap();
}

async function updateConversationTitle(conversationId: string, userInput: string, messageCount: number) {
  if (messageCount === 1) {
    const title = userInput.slice(0, 50) + (userInput.length > 50 ? "…" : "");
    await chatService.updateTitle(conversationId, title);
  }
}

async function chatLoop(conversation: Awaited<ReturnType<typeof chatService.getOrCreateConversation>>) {
  gap();
  print(
    `${PAD}${C.muted("ctrl+c / ")}${C.muted.italic("exit")}${C.muted(" to quit  ·  markdown rendered in responses")}`
  );
  gap();

  // Start turn count from existing message count so title isn't re-set on resumed conversations
  let turnCount = conversation.messages?.length ?? 0;

  while (true) {
    const userInput = await text({
      message: C.blue.bold("you"),
      placeholder: "Type a message…",
      validate(value) {
        if (!value || value.trim().length === 0) {
          return "Message cannot be empty";
        }
      },
    });

    if (isCancel(userInput)) {
      gap();
      print(`${PAD}${C.muted("Cancelled.")}  ${C.green("✓")}`);
      gap();
      process.exit(0);
    }

    if ((userInput as string).toLowerCase() === "exit") {
      gap();
      print(`${PAD}${C.muted("Session ended.")}  ${C.green("✓")}`);
      gap();
      break;
    }

    await saveMessage(conversation.id, "user", userInput as string);
    const aiResponse = await getAIResponse(conversation.id);
    await saveMessage(conversation.id, "assistant", aiResponse);

    turnCount++;
    await updateConversationTitle(conversation.id, userInput as string, turnCount);
  }
}
