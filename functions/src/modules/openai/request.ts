import { ChatCompletionRequestMessage, ChatCompletionResponseMessage, Configuration, OpenAIApi } from "openai";
import { IGenerateStoryFromText, openaiApiKey } from ".";

export async function RequestChatGPT(messages: ChatCompletionRequestMessage[], aiModel: IGenerateStoryFromText["aiModel"], attemptCount: number): Promise<ChatCompletionResponseMessage | undefined> {
    const configuration = new Configuration({
        apiKey: openaiApiKey.value(),
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
        model: aiModel,
        messages,
        temperature: 0.7
    })

    if (response.status != 200 && response.status != 429) throw new Error(response.statusText)

    let message = response.data.choices[0]?.message

    if (attemptCount > 20) throw new Error("Attempt limit exceeded")

    // Bypass Rate Limit
    if (response.status == 429) {
        await new Promise((resolve) => setTimeout(resolve, 10000))
        message = await RequestChatGPT(messages, aiModel, attemptCount + 1)
    }

    return message
}