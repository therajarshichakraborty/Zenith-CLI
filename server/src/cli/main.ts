#!/usr/bin/env bun

import dotenv from "dotenv";
dotenv.config();

import chalk from "chalk";
import figlet from "figlet";
import { Command } from "commander";
import { login, logout, whoami } from "./commands/ai/auth/login";

const VERSION = "0.1.0";

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
    .action(() => {
      // printBanner();
      // console.log(chalk.cyan("Usage:"));
      // console.log(`  $ zenith ${chalk.dim("<command> [options]")}\n`);
      // console.log(chalk.cyan("Commands:"));
      // console.log(`  ${chalk.bold("login")}       Authenticate with your Zenith account\n`);
      // console.log(`Run ${chalk.bold("zenith --help")} to see all available options and commands.\n`);
    });

  program.addCommand(login);
  program.addCommand(logout);
  program.addCommand(whoami);

  program.parse(process.argv);
}

main().catch((error) => {
  console.error(chalk.red("Error running Zenith CLI:"), error);
  process.exit(1);
});
