import OpenAI from "openai";
import { IGenerateStoryFromText, openaiApiKey } from ".";
import { ChatCompletionMessageParam } from "openai/resources";
// import { HttpsError } from "firebase-functions/https";

export async function RequestChatGPT(messages: ChatCompletionMessageParam[], aiModel: IGenerateStoryFromText["aiModel"], attemptCount: number): Promise<OpenAI.Chat.Completions.ChatCompletionMessage | undefined> {
    try {
        const openai = new OpenAI({
            apiKey: openaiApiKey.value(),
        });

        // const checkRepsonse = await openai.moderations.create({
        //     input: messages.filter(message => message.content && (message.role === "user" || message.role === "system")).map(message => (message.content as string)),
        //     model: "omni-moderation-latest"
        // })

        // const detection = checkRepsonse.results.find(value => value.flagged === true);

        // if (detection) {
        //     throw new HttpsError("failed-precondition", `Harmful content is detected: ${Object.entries(detection.categories).find(entry => entry[1] === true)?.[0]}`)
        // }

        const response = await openai.chat.completions.create({
            model: aiModel,
            messages,
            temperature: 0.5
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