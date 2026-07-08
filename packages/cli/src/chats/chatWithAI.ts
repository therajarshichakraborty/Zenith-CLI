import chalk from "chalk";
import { text, isCancel } from "@clack/prompts";
import yoctoSpinner from "yocto-spinner";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import { GoogleAiService } from "../ai/google.service.js";
import { getStoredToken } from "../commands/auth/login.js";
import { apiRequest } from "../lib/api.js";

// Console colors & layout helpers
const C = {
  purple: chalk.hex("#8b5cf6"),
  cyan: chalk.hex("#06b6d4"),
  gray: chalk.hex("#4b5563"),
  white: chalk.hex("#f3f4f6"),
  green: chalk.hex("#10b981"),
  muted: chalk.hex("#6b7280"),
  italic: chalk.italic,
  error: chalk.hex("#f43f5e"),
};

const W = 96; // Terminal width target
const PAD = "  "; // Side padding

const print = (text: string = "") => console.log(text);
const gap = () => print();
const hr = (char = "─") => C.gray(char.repeat(W));
const rule = () => print(hr("─"));
const boldRule = () => print(hr("═"));

const indent = (text: string, spaces = "    ") => {
  return text
    .split("\n")
    .map((line) => spaces + line)
    .join("\n");
};

marked.setOptions({
  renderer: new markedTerminal({
    code: chalk.yellow,
    blockquote: chalk.gray.italic,
    html: chalk.green,
    heading: chalk.bold.cyan,
    firstHeading: chalk.bold.cyan,
    hr: chalk.gray,
    listitem: chalk.white,
    table: chalk.white,
    paragraph: chalk.white,
    strong: chalk.bold,
    em: chalk.italic,
    codespan: chalk.yellow.bgBlack,
    del: chalk.dim.gray.strikethrough,
    link: chalk.blue.underline,
    href: chalk.blue.underline,
  }) as any,
});

const aiService = new GoogleAiService();

async function getUserFromToken() {
  const token = await getStoredToken();

  if (!token?.access_token) {
    throw new Error("Not authenticated. Please run 'zenith login' first.");
  }

  const spinner = yoctoSpinner({ text: C.muted("Authenticating…") }).start();

  let user;
  try {
    const data = await apiRequest("/api/user/whoami");
    if (!data?.success || !data?.user) {
      throw new Error("Session validation failed");
    }
    user = data.user;
  } catch (error) {
    spinner.error("Authentication failed");
    throw new Error("User not found. Please login again.");
  }

  spinner.success(C.green("✓") + "  " + C.white.bold(user.name || "User") + C.muted("  authenticated"));
  return user;
}

async function initConvo(userId: string, conversationId: string | null = null, mode: string = "chat") {
  const spinner = yoctoSpinner({ text: C.muted("Loading conversation…") }).start();
  
  let conversation;
  try {
    conversation = await apiRequest("/api/chats", {
      method: "POST",
      body: JSON.stringify({ conversationId, mode }),
    });
  } catch (error: any) {
    spinner.error("Failed to load conversation");
    throw error;
  }
  
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
  return await apiRequest("/api/chats/message", {
    method: "POST",
    body: JSON.stringify({ conversationId, role, content }),
  });
}

async function getAIResponse(conversationId: string) {
  const spinner = yoctoSpinner({
    text: C.muted("Generating response…"),
    color: "cyan",
  }).start();

  let aiMessages = [];
  try {
    const dbMessages = await apiRequest(`/api/chats/${conversationId}/messages`);
    aiMessages = dbMessages.map((msg: any) => ({
      role: msg.role,
      content: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content),
    }));
  } catch (error) {
    spinner.stop();
    throw error;
  }

  let fullResponse = "";

  try {
    await aiService.sendMessage(aiMessages, (chunk) => {
      fullResponse += chunk;
    });

    spinner.stop();

    gap();
    print(`${PAD}${C.green.bold("◆ Zenith")}` + `  ${C.muted("─".repeat(W - 12))}`);
    gap();

    const rendered = marked.parse(fullResponse) as string;
    const trimmed = rendered.trimEnd();

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

    const user = await getUserFromToken();
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
      print(`${PAD}${C.blue.bold("you")}` + `  ${C.muted("─".repeat(W - 7))}`);
      gap();
      print(indent(C.white(msg.content)));
      gap();
    } else {
      print(`${PAD}${C.green.bold("◆ Zenith")}` + `  ${C.muted("─".repeat(W - 12))}`);
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
    await apiRequest(`/api/chats/${conversationId}/title`, {
      method: "PUT",
      body: JSON.stringify({ title }),
    });
  }
}

async function chatLoop(conversation: any) {
  gap();
  print(
    `${PAD}${C.muted("ctrl+c / ")}${C.muted.italic("exit")}${C.muted(" to quit  ·  markdown rendered in responses")}`
  );
  gap();

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
