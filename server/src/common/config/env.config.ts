import "dotenv/config";
import { z } from "zod";
import logger from "./logger.config";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.coerce.string().min(1),
  DIRECT_URL: z.url(), 
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error(" Invalid environment variables:");
  logger.error(parsedEnv.error);
  process.exit(1);
}

export const envVariable = parsedEnv.data;