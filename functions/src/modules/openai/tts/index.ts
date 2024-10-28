import { info } from "firebase-functions/logger";
import { GenderType } from "../../../types/languages";
import { TextToSpeech } from "./tts";
import { ParagraphSplitter } from "../../../utils/textFormatter";
// import * as path from 'path';
interface IProps {
    text: string,
    genderType: GenderType,
    model: "basic" | "hd"
}


export async function GenerateBufferFromText({ text, genderType, model }: IProps) {
    const CHARACTER_LIMIT = 3000

    const textArray: string[] = ParagraphSplitter(text, CHARACTER_LIMIT)

    info("Text On TTS Generate Function:")
    info(text)

    info("Text Array Before init:")
    info(textArray)


    const buffers = []
    for (const text of textArray) {
        const buffer = await TextToSpeech({ text, genderType, model })
        info("new buffer:")
        info(buffer.byteLength)
        buffers.push(buffer)
    }

    return Buffer.concat(buffers, buffers.reduce((len, a) => len + a.length, 0));
}



