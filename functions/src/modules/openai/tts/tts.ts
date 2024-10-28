import { GenderType } from "../../../types/languages";
import { info } from "firebase-functions/logger";
import OpenAI from "openai";
import { openaiApiKey } from "..";

interface IProps {
    text: string,
    genderType: GenderType,
    model: "basic" | "hd"
}


export async function TextToSpeech({ text, genderType, model }: IProps): Promise<Buffer> {
    if (text.length >= 5000) throw new Error("Text's length must be less than 5000 characters")
    const openai = new OpenAI({
        apiKey: openaiApiKey.value(),
    });



    info("Text On TTS:")
    info(text)

    const mp3 = await openai.audio.speech.create({
        model: model === "basic" ? "tts-1" : "tts-1-hd",
        voice: genderType == "MALE" ? "echo" : "nova",
        input: text,
        response_format: "mp3",
    });

    return Buffer.from(await mp3.arrayBuffer())
}
