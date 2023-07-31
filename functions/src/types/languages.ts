export type Languages = "en-US" | "es-ES" | "fr-FR" | "de-DE" | "it-IT" | "da-DK" | "fil-PH"

export type LanguageLevel = "Beginner" | "Intermadiate" | "Advanced"

export type VoiceModels = "Standard" | "Neural2" | "WaveNet"

export type GenderType = "MALE" | "FEMALE"

type LanguageType = { [langauge in Languages]: { language: Languages, model: VoiceModels, modelType: string, gender: GenderType, pitch: number, speed: number }[] }

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
            modelType: "en-US-Neural2-D",
            gender: "MALE",
            speed: 0.96,
            pitch: -3.6
        },
        {
            language: "en-US",
            model: "Neural2",
            modelType: "en-US-Neural2-F",
            gender: "FEMALE",
            speed: 1,
            pitch: 0
        },
        {
            language: "en-US",
            model: "Standard",
            modelType: "en-US-Standard-D",
            gender: "MALE",
            speed: 0.96,
            pitch: -3.6
        },
        {
            language: "en-US",
            model: "Standard",
            modelType: "en-US-Standard-F",
            gender: "FEMALE",
            speed: 0.96,
            pitch: -0.4
        },
    ],
    "es-ES": [],
    "da-DK": [],
    "de-DE": [],
    "it-IT": [],
    "fil-PH": [],
    "fr-FR": [],
}