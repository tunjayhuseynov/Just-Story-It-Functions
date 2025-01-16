import OpenAI from "openai";
import { openaiApiKey } from "..";
import { SpeechCreateParams } from "openai/resources/audio/speech";

interface IProps {
    text: string,
    voice: SpeechCreateParams["voice"],
    model: "basic" | "hd"
}


export async function TextToSpeech({ text, voice, model }: IProps): Promise<Buffer> {
    if (text.length >= 5000) throw new Error("Text's length must be less than 5000 characters")
    const openai = new OpenAI({
        apiKey: openaiApiKey.value(),
    });

    const mp3 = await openai.audio.speech.create({
        model: model === "basic" ? "tts-1" : "tts-1-hd",
        voice: voice,
        input: text,
        response_format: "mp3",
    });

    return Buffer.from(await mp3.arrayBuffer())
}
