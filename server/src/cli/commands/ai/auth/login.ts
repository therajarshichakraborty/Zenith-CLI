import { cancel, confirm, intro, isCancel, outro } from "@clack/prompts";
import { logger } from "better-auth";
import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";
import chalk from "chalk";
import { Command } from "commander";
import fs from "fs/promises";
import open from "open";
import os from "node:os";
import path from "node:path";
import yoctoSpinner from "yocto-spinner";
import * as z from "zod";
import dotenv from "dotenv";
//import prisma from "../../../../lib/db.ts"

dotenv.config();
dotenv.config({ path: path.join(process.cwd(), "server", ".env") });

const DEMO_URL = "http://localhost:4000";
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CONFIG_DIR = path.join(os.homedir(), ".better-auth");
const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");

/* Token Management */
export async function getStoredToken() {
  try {
    const data = await fs.readFile(TOKEN_FILE, "utf-8");
    const token = JSON.parse(data);
    return token;
  } catch (error) {
    return null;
  }
}

export async function storeToken(token:any) {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });

    const tokenData = {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      token_type: token.token_type || "Bearer",
      scope: token.scope,
      expires_at: token.expires_in
        ? new Date(Date.now() + token.expires_in * 1000).toISOString()
        : null,
      created_at: new Date().toISOString(),
    };

    await fs.writeFile(TOKEN_FILE, JSON.stringify(tokenData, null, 2), "utf-8");
    return true;
  } catch (error:any) {
    console.error(chalk.red("Failed to store token:"), error.message);
    return false;
  }
}

export async function clearStoredToken() {
  try {
    await fs.unlink(TOKEN_FILE);
    return true;
  } catch (error) {
    return false;
  }
}

export async function isTokenExpired() {
  const token = await getStoredToken();
  if (!token || !token.expires_at) {
    return true;
  }

  const expiresAt = new Date(token.expires_at);
  const now = new Date();
  return expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;
}

export async function requireAuth() {
  const token = await getStoredToken();

  if (!token) {
    console.log(
      chalk.red("❌ Not authenticated. Please run 'your-cli login' first.")
    );
    process.exit(1);
  }

  if (await isTokenExpired()) {
    console.log(
      chalk.yellow("⚠️  Your session has expired. Please login again.")
    );
    console.log(chalk.gray("   Run: your-cli login\n"));
    process.exit(1);
  }

  return token;
}

export async function loginAction(opts: any) {
    const options = z
        .object({
            serverUrl: z.string().optional(),
            clientId: z.string().optional(),
        })
        .parse(opts);

    const serverUrl = options.serverUrl || DEMO_URL;
    const clientId = options.clientId || CLIENT_ID;

    if (!clientId) {
        cancel("Error: GITHUB_CLIENT_ID is not configured in your environment or options.");
        process.exit(1);
    }

    intro(chalk.bold.cyan("Zenith CLI Login"));

    const existingToken = await getStoredToken();
    const expired = await isTokenExpired();

    if (existingToken && !expired) {
        const shouldReauth = await confirm({
            message: "You're already logged in. Do you want to log in again?",
            initialValue: false,
        });

        if (isCancel(shouldReauth) || !shouldReauth) {
            cancel("Login cancelled");
            process.exit(0);
        }
    }

    const authClient = createAuthClient({
        baseURL: serverUrl,
        plugins: [deviceAuthorizationClient()],
    });

    const spinner = yoctoSpinner({ text: "Requesting device authorization..." });
    spinner.start();


    try {
        const { data, error } = await authClient.device.code({
            client_id: clientId as string,
            scope: "openid profile email",
        })

        spinner.stop()
        if (error || !data) {
            logger.error(
                `Failed to request device authorization: ${error?.error_description || error?.statusText || "Unknown error"}`
            )
            process.exit(1);
        }
        const {
            device_code,
            user_code,
            verification_uri,
            verification_uri_complete,
            interval = 5,
            expires_in,
        } = data;

        console.log("");
        console.log(chalk.cyan("Device Authorization is Required"));
        console.log("");
        console.log(
            `Please visit: ${chalk.underline.blue(
                verification_uri_complete || verification_uri
            )}`
        );
        console.log(`Enter code: ${chalk.bold.green(user_code)}`);
        console.log("");

        const shouldOpen = await confirm({
            message: "Open browser automatically?",
            initialValue: true,
        });

        if (!isCancel(shouldOpen) && shouldOpen) {
            const urlToOpen = verification_uri_complete || verification_uri;
            await open(urlToOpen);
        }

        console.log(
            chalk.gray(
                `Waiting for authorization (expires in ${Math.floor(
                    expires_in / 60
                )} minutes)...`
            )
        );


        const token = await pollForToken(
            authClient,
            device_code,
            clientId,
            interval
        );

        if(token){
            const save = await storeToken(token);

            if(!save){
                console.log(chalk.yellow("Warning: Token could not be stored. You'll need to provide it manually when needed."))
                console.log(chalk.gray("Token"))
                console.log(chalk.cyan("you may need authentication again soon"))
            } else{
                console.log(chalk.green("✅ Authentication Successful!"))
            }
        }
         
        /* Todo Get User Data */

        outro(chalk.green("User Login Successfully"))
        console.log(chalk.cyan(`Token Saved to ${TOKEN_FILE}`));

        console.log(chalk.gray("You are all set to use Zenith AI"))
        console.log(chalk.blue("run - zenith ai --help"))
        
    } catch (error: any) {
        spinner.stop()
        logger.error("Error during login:", error.message);
        process.exit(1);
    }
}

async function pollForToken(authClient : any, deviceCode : any, clientId : any, initialInterval : any) {
  let pollingInterval = initialInterval;
  const spinner = yoctoSpinner({ text: "", color: "cyan" });
  let dots = 0;

  return new Promise((resolve, _) => {
    const poll = async () => {
      dots = (dots + 1) % 4;
      spinner.text = chalk.gray(
        `Polling for authorization${".".repeat(dots)}${" ".repeat(3 - dots)}`
      );
      if (!spinner.isSpinning) spinner.start();

      try {
        const { data, error } = await authClient.device.token({
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
          device_code: deviceCode,
          client_id: clientId,
          fetchOptions: {
            headers: {
              "user-agent": `Better Auth CLI`,
            },
          },
        });

        if (data?.access_token) {
          console.log(
            chalk.bold.yellow(`Your access token: ${data.access_token}`)
          );
          spinner.stop();
          resolve(data);
          return;
        } else if (error) {
          switch (error.error) {
            case "authorization_pending":
              break;
            case "slow_down":
              pollingInterval += 5;
              break;
            case "access_denied":
              spinner.stop();
              logger.error("Access was denied by the user");
              process.exit(1);
            case "expired_token":
              spinner.stop();
              logger.error("The device code has expired. Please try again.");
              process.exit(1);
            default:
              spinner.stop();
              logger.error(`Error: ${error.error_description}`);
              process.exit(1);
          }
        }
      } catch (error : any) {
        spinner.stop();
        logger.error(`Network error: ${error.message}`);
        process.exit(1);
      }

      setTimeout(poll, pollingInterval * 1000);
    };

    setTimeout(poll, pollingInterval * 1000);
  });
}

/* Commander Setup */

export const login = new Command("login")
    .description("Please Login to Zenith CLI")
    .option("--server-url <url>", "The Zenith CLI server URL", DEMO_URL)
    .option("--client-id <id>", "The OAuth client ID", CLIENT_ID)
    .action(loginAction);
