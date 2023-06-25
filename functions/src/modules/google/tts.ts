import { LanguageTypes, Languages, GenderType, VoiceModels } from "../../types/languages";
import { google } from "@google-cloud/text-to-speech/build/protos/protos";
import textToSpeech from "@google-cloud/text-to-speech"
import { info } from "firebase-functions/logger";

interface IProps {
    text: string,
    languageCode: Languages,
    genderType: GenderType,
    model: VoiceModels
}

const client = new textToSpeech.TextToSpeechClient(
    // { keyFilename: path.join(__dirname, "./service.json") }
);

export async function TextToSpeech({ text, languageCode, genderType, model }: IProps): Promise<Buffer> {
    if (text.length >= 5000) throw new Error("Text's length must be less than 5000 characters")

    const selectedModel = LanguageTypes[languageCode].find(s => s.gender === genderType && s.model === model)

    if (!selectedModel) throw new Error("There is no such a model")


    info("Selected Model:")
    info(selectedModel.modelType)

    info("Text On TTS:")
    info(text)

    const request: google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text: text },
        voice: { name: selectedModel.modelType, languageCode: selectedModel.language },
        audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request, {
        retry: {
            backoffSettings: {
                maxRetries: 20,
                initialRetryDelayMillis: 5000,
                maxRetryDelayMillis: 5000,
                retryDelayMultiplier: 1.5
            }
        }
    })

    info("TTS Response")
    info(response.audioContent?.length)

    if (!response.audioContent) throw new Error("Response is null")
    if (!(response.audioContent instanceof Uint8Array)) throw new Error('Response from Google Text-to-Speech API is not a Buffer.');


    return Buffer.from(response.audioContent)
}
