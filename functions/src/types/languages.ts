export type Languages = "en-US" | "es-ES" | "fr-FR" | "ru-RU" | "cmn-TW" | "tr-TR"

export type VoiceModels = "WaveNet" | "Standard" | "Neural2"

export type GenderType = "MALE" | "FEMALE"

export type LanguageType = { [langauge in Languages]: { language: Languages, model: VoiceModels, modelType: string, gender: GenderType }[] }

export const LanguageTypes: LanguageType = {
    "en-US": [
        {
            language: "en-US",
            model: "Neural2",
            modelType: "en-US-Neural2-A",
            gender: "MALE"
        },
        {
            language: "en-US",
            model: "Neural2",
            modelType: "en-US-Neural2-G",
            gender: "FEMALE"
        },
        {
            language: "en-US",
            model: "Standard",
            modelType: "en-US-Standard-A",
            gender: "MALE"
        },
        {
            language: "en-US",
            model: "Standard",
            modelType: "en-US-Standard-C",
            gender: "FEMALE"
        },
    ],
    "cmn-TW": [],
    "es-ES": [],
    "fr-FR": [],
    "ru-RU": [],
    "tr-TR": []
}