export type GptType = "gpt-4" | "gpt-4-32k" | "gpt-3.5-turbo" | "gpt-4-1106-preview" | "gpt-3.5-turbo-1106" | "gpt-4o-mini" | "gpt-4o"

export const GptFeatures: { [name in GptType]: { maxToken: number } } = {
    "gpt-3.5-turbo": { maxToken: 4095 },
    "gpt-3.5-turbo-1106": { maxToken: 16383 },
    "gpt-4": { maxToken: 8000 },
    "gpt-4-32k": { maxToken: 32000 },
    "gpt-4-1106-preview": { maxToken: 127000 },
    "gpt-4o-mini": { maxToken: 127000 },
    "gpt-4o": { maxToken: 127000 },
}