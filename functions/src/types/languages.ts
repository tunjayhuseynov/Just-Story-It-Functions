export type Languages = "en-US" | "es-ES" | "fr-FR" | "de-DE" | "it-IT" | "da-DK" | "fil-PH"

export type LanguageLevel = "Beginner" | "Intermadiate" | "Advanced"

export type VoiceModels = "Standard" | "Neural2" | "WaveNet"

export type GenderType = "MALE" | "FEMALE"

type LanguageType = { [langauge in Languages]: { language: Languages, model: VoiceModels, modelType: string, gender: GenderType }[] }

export const LangaugeSecondsToWordsDeltaIndex: { [lan in Languages]: number } = {
    "en-US": 2.795,
    "da-DK": 2.795,
    "de-DE": 2.795,
    "es-ES": 2.795,
    "fil-PH": 2.795,
    "fr-FR": 2.795,
    "it-IT": 2.795
}

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
    "es-ES": [],
    "da-DK": [],
    "de-DE": [],
    "it-IT": [],
    "fil-PH": [],
    "fr-FR": [],
}