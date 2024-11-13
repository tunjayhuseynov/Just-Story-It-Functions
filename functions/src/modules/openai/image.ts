import OpenAI from "openai";
import { openaiApiKey } from ".";

export async function GenerateImageFromText(text: string) {
    const openai = new OpenAI({
        apiKey: openaiApiKey.value(),
    });


    const res = await openai.images.generate({
        prompt: text,
        response_format: "b64_json",
        n: 1,
        model: "dall-e-3",
        size: "512x512"
    });

    const base64 = res.data[0].b64_json;

    if (!base64) throw new Error("The response of Dall-e is empty")

    return base64;
}