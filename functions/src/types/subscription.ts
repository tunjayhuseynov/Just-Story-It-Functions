import { GptType } from "./gpt"

type VoicType = "Basic" | "Advanced"

type Subscription = {
    [name: string]: {
        price: number | null,
        maxWordCount: number,
        maxSecondsPerStory: number,
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
        freeUsageSecondsAmount: 9 * 60,
        maxWordCount: 500,
        maxSecondsPerStory: 3 * 60,
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
        price: 2.99,
        freeUsageSecondsAmount: 36 * 60,
        maxWordCount: 1000,
        maxSecondsPerStory: 6 * 60,
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
        price: 8.99,
        freeUsageSecondsAmount: 120 * 60,
        maxWordCount: 2000,
        maxSecondsPerStory: 12 * 60,
        continuationOfStory: false,
        coverImage: true,
        customCharacterLimit: 6,
        customEnvironmentLimit: 6,
        dialogues: true,
        gptModel: "gpt-3.5-turbo",
        extraStoryPrice: 0.69,
        userHistory: true,
        voicType: "Advanced"
    },
    "The Prime Shakespeare": {
        price: 19.99,
        freeUsageSecondsAmount: 315 * 60,
        maxWordCount: 3500,
        maxSecondsPerStory: 21 * 60,
        coverImage: true,
        customCharacterLimit: 12,
        customEnvironmentLimit: 12,
        dialogues: true,
        extraStoryPrice: 0.99,
        gptModel: "gpt-4",
        userHistory: true,
        voicType: "Advanced",
        continuationOfStory: false,
    },
    "The Greatest of All Time": {
        price: 149.99,
        freeUsageSecondsAmount: 1440 * 60,
        maxWordCount: 6000,
        maxSecondsPerStory: 36 * 60,
        gptModel: "gpt-4",
        userHistory: true,
        voicType: "Advanced",
        customCharacterLimit: 30,
        customEnvironmentLimit: 30,
        dialogues: true,
        extraStoryPrice: 2.99,
        coverImage: true,
        continuationOfStory: true,
    }
}