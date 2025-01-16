import { info } from "firebase-functions/logger";
import { TextToSpeech } from "./tts";
import { ParagraphSplitter } from "../../../../utils/textFormatter";
import { SpeechCreateParams } from "openai/resources/audio/speech";
// import * as path from 'path';
interface IProps {
    text: string,
    voice: SpeechCreateParams["voice"],
    model: "basic" | "hd"
}


export async function GenerateBufferFromText({ text, voice, model }: IProps) {
    const CHARACTER_LIMIT = 3000

    const textArray: string[] = ParagraphSplitter(text, CHARACTER_LIMIT)

    info("TTS Generate Function is working")
    info(`TTS Paramteres: Voice - ${voice}; Model - ${model}`)


    const buffers = []
    for (const text of textArray) {
        const buffer = await TextToSpeech({ text, voice, model })
        info(`TTS produces new buffer: ${buffer.byteLength} bytes`)
        buffers.push(buffer)
    }

    return Buffer.concat(buffers, buffers.reduce((len, a) => len + a.length, 0));
}



