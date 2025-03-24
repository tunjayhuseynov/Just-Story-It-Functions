import OpenAI from "openai";
import { IGenerateStoryFromText } from ".";
import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources";
// import { HttpsError } from "firebase-functions/https";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function RequestChatGPT(messages: ChatCompletionMessageParam[], aiModel: IGenerateStoryFromText["aiModel"], attemptCount: number): Promise<OpenAI.Chat.Completions.ChatCompletionMessage | undefined> {
    try {

        const openai = axios.create({
            baseURL: "https://openrouter.ai/api/v1",
            headers: {
                "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
                "HTTP-Referer": "https://www.juststoryit.net",
                "X-Title": "Just Story It",
                "Content-Type": "application/json"
            }
        })

        // if (detection) {
        //     throw new HttpsError("failed-precondition", `Harmful content is detected: ${Object.entries(detection.categories).find(entry => entry[1] === true)?.[0]}`)
        // }

        const response = await openai.post<ChatCompletion>("/chat/completions", {
            model: aiModel,
            messages: messages.map(message => ({
                role: message.role,
                content: message.content
            })),
            // ignore: ["NovitaAI","SambaNova"]
        })

        // const response = await openai.chat.completions.create({
        //     model: "qwen/qwq-32b:free",
        //     messages,
        //     temperature: 0.5
        // })


        if (attemptCount > 20) throw new Error("Attempt limit exceeded")

        return response.data.choices[0].message;

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