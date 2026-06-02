import dotenv from "dotenv";
dotenv.config();

export const googleConfig = {
  googleAPIKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! || "",
  model: process.env.ZENITH_MODEL || "gemini-2.5-flash",
  temperature: parseFloat(process.env.ZENITH_TEMPERATURE || "0.7"),
  maxTokens: parseInt(process.env.ZENITH_MAX_TOKENS || "2048"),
};
