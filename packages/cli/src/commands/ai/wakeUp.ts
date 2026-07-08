import chalk from "chalk";
import { Command } from "commander";
import yoctoSpinner from "yocto-spinner";
import { getStoredToken } from "../auth/login.js";
import { apiRequest } from "../../lib/api.js";
import { select } from "@clack/prompts";
import { startChat } from "../../chats/chatWithAI.js";
import { startToolChat } from "../../chats/chatWithTools.js";
import { startAgentChat } from "../../chats/chatWithAgent.js";

const wakeUpAction = async () => {
  const token = await getStoredToken();

  if (!token?.access_token) {
    console.log(chalk.red("Not authenticated. Please login."));
    return;
  }

  const spinner = yoctoSpinner({ text: "Fetching User Information..." });
  spinner.start();

  let user;
  try {
    const data = await apiRequest("/api/user/whoami");
    if (!data?.success || !data?.user) {
      throw new Error("Failed to fetch user");
    }
    user = data.user;
  } catch (err: any) {
    spinner.stop();
    console.log(chalk.red("Not authenticated. Please login."));
    return;
  }

  spinner.stop();
  console.log(chalk.green("User information fetched successfully!"));
  console.log(chalk.blue(`Welcome, ${user.name || "User"}!`));

  const choice = await select({
    message: "Select an option:",
    options: [
      {
        value: "chat",
        label: "Chat",
        hint: "Simple chat with AI",
      },
      {
        value: "tool",
        label: "Tool Calling",
        hint: "Chat with tools (Google Search, Code Execution)",
      },
      {
        value: "agent",
        label: "Agentic Mode",
        hint: "Advanced AI agent (Coming soon)",
      },
    ],
  });

  switch (choice) {
    case "chat":
      console.log(chalk.blue("Starting chat..."));
      await startChat("chat");
      break;
    case "tool":
      console.log(chalk.blue("Starting tool chat..."));
      await startToolChat();
      break;
    case "agent":
      console.log(chalk.blue("Starting agentic mode..."));
      await startAgentChat();
      break;
    default:
      console.log(chalk.red("No such mode!"));
      break;
  }
};

export const wakeUp = new Command("wakeup").description("Wake up the AI").action(wakeUpAction);
