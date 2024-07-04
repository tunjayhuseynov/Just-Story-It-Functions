import { Languages } from './languages';
export type Character = {
    id: string
    name: string;
    description: string
    image: string | null
}

export type ReferanceStory = {
    link: string,
    title: string
}

export type Environment = {
    id: string
    name: string;
    description: string
    image: string | null
}

export type CustomStoryDescriptor = string

export const LanguageName: { [n in Languages]: string } = {
    "en-US": "English",
    "es-ES": "Spanish",
    "fr-FR": "French",
    "da-DK": "Danish",
    "de-DE": "German",
    "fil-PH": "Pilipino",
    "it-IT": "Italian"
}