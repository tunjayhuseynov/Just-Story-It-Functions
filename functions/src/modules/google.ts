import textToSpeech from "@google-cloud/text-to-speech"
import { google } from "@google-cloud/text-to-speech/build/protos/protos";
import { GenderType, LanguageTypes, Languages, VoiceModels } from "../types/languages";
import * as path from 'path';
interface IProps {
    text: string,
    languageCode: Languages,
    genderType: GenderType,
    modelType: VoiceModels
}

const CHARATER_LIMIT = 5000

export async function GenerateAudioLinkFromText({ text, genderType, languageCode, modelType }: IProps) {
    let pagination = Math.ceil(text.length / CHARATER_LIMIT)
    let textArray = []

    while (pagination > 0) {
        textArray.push(text.slice(pagination * CHARATER_LIMIT, ((pagination * CHARATER_LIMIT) + CHARATER_LIMIT)))
        pagination--
    }

    let buffers = []
    for (const text of textArray) {
        let buffer = await TextToSpeech({ text, genderType, languageCode, modelType })
        buffers.push(buffer)
    }

    return Buffer.concat(buffers, buffers.reduce((len, a) => len + a.length, 0));
}



async function TextToSpeech({ text, languageCode, genderType, modelType }: IProps): Promise<Buffer> {
    if (text.length >= 5000) throw new Error("Text's length must be less than 5000 characters")

    let model = LanguageTypes[languageCode].find(s => s.gender === genderType && s.modelType === modelType)

    if (!model) throw new Error("There is no such a model")

    const client = new textToSpeech.TextToSpeechClient({
        keyFilename: path.join(__dirname, "./service.json")
    });

    const request: google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text: text },
        voice: { languageCode: model.language, ssmlGender: model.gender, name: model.modelType },
        audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request, {
        maxRetries: 5,
    })

    if (!response.audioContent) throw new Error("Response is null")
    if (!(response.audioContent instanceof Uint8Array)) throw new Error('Response from Google Text-to-Speech API is not a Buffer.');


    return Buffer.from(response.audioContent)
}
