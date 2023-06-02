import { Languages } from './languages';
export type Character = {
    name: string;
    description: string
}

export type ReferanceStory = {
    link: string,
    title: string
}

export type Environment = {
    name: string;
    description: string
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