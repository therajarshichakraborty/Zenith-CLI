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

const DEMO_URL = "http://localhost:4000";
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CONFIG_DIR = path.join(os.homedir(), ".better-auth");
const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");

export async function loginAction(opts: any) {
    const options = z
        .object({
            serverUrl: z.string().optional(),
            clientId: z.string().optional(),
        })
        .parse(opts);

    const serverUrl = options.serverUrl || DEMO_URL;
    const clientId = options.clientId || CLIENT_ID;

    intro(chalk.bold.cyan("Zenith CLI Login"));

    const existingToken = false;
    const expired = false;

    if (existingToken && !expired) {
        const shouldReauth = await confirm({
            message: "You're already logged in. Do you want to log in again?",
            initialValue: false,
        });

        if (isCancel(shouldReauth) || !shouldReauth) {
            cancel("Login cancelled");
            process.exit(0);
        }

        const authClient = createAuthClient({
            baseURL: serverUrl,
            plugins: [deviceAuthorizationClient()],
        });

        const spinner = yoctoSpinner({ text: "Requesting device authorization..." });
        spinner.start();


        try {
            const { data, error } = await authClient.device.code({
                client_id: "clientId",
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

        } catch (error) {

        }






    }
}

/* Commander Setup */

export const login = new Command("login")
    .description("Login to Zenith CLI")
    .option("--server-url <url>", "The Zenith CLI server URL", DEMO_URL)
    .option("--client-id <id>", "The OAuth client ID", CLIENT_ID)
    .action(loginAction);
