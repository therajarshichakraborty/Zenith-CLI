import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { googleConfig } from "../config/google.config.js";
import chalk from "chalk";
import { generateObject } from "ai";

export class GoogleAiService {
  public model: any;

  constructor() {
    if (!googleConfig.googleAPIKey) {
      throw new Error("Google API key not found. Please set the GOOGLE_GENERATIVE_AI_API_KEY environment variable.");
    }
    this.model = google(googleConfig.model);
  }
  /**
   * Send a message and get streaming response
   * @param {Array} messages - Array of message objects {role, content}
   * @param {Function} onChunk - Callback for each text chunk
   * @param {Object} tools - Optional tools object
   * @param {Function} onToolCall - Callback for tool calls
   * @returns {Promise<Object>} Full response with content, tool calls, and usage
   */

  async sendMessage(
    messages: any[],
    onChunk: (chunk: string) => void,
    tools: any = undefined,
    onToolCall: any = null
  ): Promise<{
    content: string;
    finishReason: any;
    usage: any;
  }> {
    try {
      const streamConfig = {
        model: this.model,
        messages: messages,
        temperature: googleConfig.temperature,
        maxTokens: googleConfig.maxTokens,
      };

      if (tools && Object.keys(tools).length > 0) {
        (streamConfig as any).tools = tools;
        (streamConfig as any).maxSteps = 5;

        console.log(chalk.gray(`[DEBUG] Tools enabled: ${Object.keys(tools).join(", ")}`));
      }

      const result = streamText(streamConfig);

      let fullResponse = "";

      for await (const chunk of result.textStream) {
        fullResponse += chunk;
        if (chunk) {
          onChunk(chunk as string);
        }
      }

      const fullResult = result;

      const toolCalls = [];
      const toolResults = [];

      if (fullResult.steps && Array.isArray(fullResult.steps)) {
        for (const step of fullResult.steps) {
          if (step.toolCalls && step.toolCalls.length > 0) {
            for (const toolCall of step.toolCalls) {
              toolCalls.push(toolCall);
              if (onToolCall) {
                onToolCall(toolCall);
              }
            }
          }

          if (step.toolResults && step.toolResults.length > 0) {
            toolResults.push(...step.toolResults);
          }
        }
      }

      return {
        content: fullResponse,
        finishReason: fullResult.finishReason,
        usage: fullResult.usage,
      };
    } catch (error: any) {
      console.error(chalk.red("AI Service Error:"), error.message);
      console.error(chalk.red("Full error:"), error);
      throw error;
    }
  }

  /**
   * Get a non-streaming response
   * @param {Array} messages - Array of message objects
   * @param {Object} tools - Optional tools
   * @returns {Promise<string>} Response text
   */

  async getMessage(messages: any[], tools: any = undefined): Promise<string> {
    const result = await this.sendMessage(messages, () => {}, tools);
    return result.content;
  }

  /**
   * generate a structured output in docs
   * @param {Object} tools - Optional tools
   * @param {Function} onToolCall - Callback for tool calls
   * @returns {Promise<Object>} Full response with content, tool calls, and usage
   */

  async generateStructured(schema: any, prompt: string) {
    try {
      const result = await generateObject({
        model: this.model,
        schema: schema,
        prompt: prompt,
      });

      return result.object;
    } catch (error: any) {
      console.error(chalk.red("AI Structured Generation Error:"), error.message);
      throw error;
    }
  }
}
