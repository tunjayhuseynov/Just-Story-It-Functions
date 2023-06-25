import { Configuration, OpenAIApi } from "openai";
import { openaiApiKey } from ".";

export async function GenerateImageFromText(text: string) {
    const configuration = new Configuration({
        apiKey: openaiApiKey.value(),
    });
    const openai = new OpenAIApi(configuration);

    const res = await openai.createImage({
        prompt: text,
        response_format: "b64_json"
    });

    const base64 = res.data.data[0].b64_json;

    if (!base64) throw new Error("The response of Dall-e is empty")

    return base64;
}