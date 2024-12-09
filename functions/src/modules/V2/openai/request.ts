import OpenAI from "openai";
import { IGenerateStoryFromText, openaiApiKey } from ".";
import { ChatCompletionMessageParam } from "openai/resources";

export async function RequestChatGPT(messages: ChatCompletionMessageParam[], aiModel: IGenerateStoryFromText["aiModel"], attemptCount: number): Promise<OpenAI.Chat.Completions.ChatCompletionMessage | undefined> {
    try {
        const openai = new OpenAI({
            apiKey: openaiApiKey.value(),
        });

        const response = await openai.chat.completions.create({
            model: aiModel,
            messages,
            temperature: 0.4
        })


        if (attemptCount > 20) throw new Error("Attempt limit exceeded")

        return response.choices[0].message;

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            if (error.status != 200 && error.status != 429) throw new Error(error.message)

            // Bypass Rate Limit
            if (error.status == 429) {
                await new Promise((resolve) => setTimeout(resolve, 10000))
                return await RequestChatGPT(messages, aiModel, attemptCount + 1)
            }

            throw error;
        } else throw error;
    }
}