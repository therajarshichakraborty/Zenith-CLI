
import chalk from "chalk";
import figlet from "figlet";
import { Command } from "commander";
import { login, logout, whoami } from "../commands/auth/login.js";
import { wakeUp } from "../commands/ai/wakeUp.js";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const VERSION = require("../package.json").version;

function gradientBanner(text: string): string {
  const trimmed = text.trimEnd();
  const lines = trimmed.split("\n");
  const total = lines.length;

  const from = { r: 6, g: 182, b: 212 };
  const to = { r: 139, g: 92, b: 246 };

  return lines
    .map((line, i) => {
      const ratio = total <= 1 ? 0 : i / (total - 1);
      const r = Math.round(from.r + (to.r - from.r) * ratio);
      const g = Math.round(from.g + (to.g - from.g) * ratio);
      const b = Math.round(from.b + (to.b - from.b) * ratio);
      return chalk.rgb(r, g, b)(line);
    })
    .join("\n");
}

export function printBanner() {
  const log = console.log;
  const rawBanner = figlet.textSync("Zenith CLI", {
    font: "Standard",
    horizontalLayout: "default",
  });

  const coloredBanner = gradientBanner(rawBanner);
  const version = chalk.dim("version : ") + chalk.white.bold(VERSION);
  const runtime =
    chalk.dim("runtime : ") + chalk.hex("#fbbd23")(typeof process.versions.bun !== "undefined" ? "bun" : "node");
  const platform = chalk.dim("platform : ") + chalk.hex("#38bdf8")(process.platform + "-" + process.arch);
  const metaLine = `  ${version}  ${chalk.dim("|")}  ${runtime}  ${chalk.dim("|")}  ${platform}`;
  const tagline = chalk.dim.italic("The developer toolkit that gets out of your way.");
  log(`\n${coloredBanner}\n\n${metaLine}\n${tagline}\n`);
}

export async function main(): Promise<void> {
  printBanner();
  const program = new Command("zenith");

  program
    .name("zenith")
    .version(VERSION)
    .description("Zenith CLI - The developer toolkit that gets out of your way.")
    .action(() => {});

  program.addCommand(login);
  program.addCommand(logout);
  program.addCommand(whoami);
  program.addCommand(wakeUp);

  program.parse(process.argv);
}

main().catch((error) => {
  console.error(chalk.red("Error running Zenith CLI:"), error);
  process.exit(1);
});
