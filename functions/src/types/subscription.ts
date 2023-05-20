import { GptType } from "./gpt"

type VoicType = "Basic" | "Advanced"

type Subscription = {
    [name: string]: {
        price: number | null,
        maxWordCount: number,
        freeUsageSecondsAmount: number,
        dialogues: boolean,
        coverImage: boolean,
        userHistory: boolean,
        customCharacterLimit: number,
        customEnvironmentLimit: number,
        voicType: VoicType,
        continuationOfStory: boolean,
        gptModel: GptType,
        extraStoryPrice: number
    }
}

export const Subscription: Subscription = {
    "Free": {
        price: null,
        freeUsageSecondsAmount: 6 * 60,
        maxWordCount: 500,
        dialogues: false,
        coverImage: false,
        userHistory: false,
        customCharacterLimit: 1,
        customEnvironmentLimit: 1,
        voicType: "Basic",
        continuationOfStory: false,
        gptModel: "gpt-3.5-turbo",
        extraStoryPrice: 0.29
    },
    "The Little Prince": {
        price: 3.99,
        freeUsageSecondsAmount: 36 * 60,
        maxWordCount: 1000,
        continuationOfStory: false,
        coverImage: false,
        customCharacterLimit: 3,
        customEnvironmentLimit: 3,
        dialogues: false,
        gptModel: "gpt-3.5-turbo",
        userHistory: true,
        voicType: "Basic",
        extraStoryPrice: 0.39
    },
    "The Great Gatsby": {
        price: 7.99,
        freeUsageSecondsAmount: 120 * 60,
        maxWordCount: 2000,
        continuationOfStory: false,
        coverImage: true,
        customCharacterLimit: 6,
        customEnvironmentLimit: 6,
        dialogues: true,
        gptModel: "gpt-3.5-turbo",
        extraStoryPrice: 0.69,
        userHistory: true,
        voicType: "Basic"
    },
    "The Prime Shakespeare": {
        price: 14.99,
        freeUsageSecondsAmount: 300 * 60,
        coverImage: true,
        customCharacterLimit: 12,
        customEnvironmentLimit: 12,
        dialogues: true,
        extraStoryPrice: 0.99,
        gptModel: "gpt-4",
        userHistory: true,
        voicType: "Advanced",
        maxWordCount: 3500,
        continuationOfStory: false,
    },
    "The Greatest of All Time": {
        price: 99.99,
        freeUsageSecondsAmount: 1440 * 60,
        gptModel: "gpt-4",
        userHistory: true,
        voicType: "Advanced",
        maxWordCount: 6000,
        customCharacterLimit: 30,
        customEnvironmentLimit: 30,
        dialogues: true,
        extraStoryPrice: 2.99,
        coverImage: true,
        continuationOfStory: true,
    }
}