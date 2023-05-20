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
    "cmn-TW": "Chinese",
    "en-US": "English",
    "es-ES": "Spanish",
    "fr-FR": "French",
    "ru-RU": "Russian",
    "tr-TR": "Turkish"
}