import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { googleConfig } from "../../config/google.config";
import chalk from 'chalk';

export class GoogleAiService {
    private model: any;

    constructor() {
        if (!googleConfig.googleAPIKey) {
            throw new Error("Gooogle api key not found from environmental variables")
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
            }

            const result = streamText(streamConfig);

            let fullResponse = "";

            for await (const chunk of result.textStream) {
                fullResponse += chunk;
                if (chunk) {
                    onChunk(chunk as string)
                }
            }

            const fullResult = result;
            return {
                content: fullResponse,
                finishReason: fullResult.finishReason,
                usage: fullResult.usage,
            }
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
}