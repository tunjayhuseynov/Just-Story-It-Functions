export type GptType = "gpt-4" | "gpt-4-32k" | "gpt-3.5-turbo" | "gpt-3.5-turbo-16k"

export const GptFeatures: { [name in GptType]: { maxToken: number } } = {
    "gpt-3.5-turbo": { maxToken: 4095 },
    "gpt-3.5-turbo-16k": { maxToken: 16383 },
    "gpt-4": { maxToken: 8000 },
    "gpt-4-32k": { maxToken: 32000 }
}