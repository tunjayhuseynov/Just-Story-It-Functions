import { Character, Environment } from "./inputs";
import { Languages } from "./languages";

export interface IStory {
    id: string,
    created_at: number;
    characters: Character[];
    environments: Environment[];
    customStoryDescriptor?: string;
    storyLink: string;
    audioLink: string;
    coverImage: string | null;
    images: string[];
    title: string;
    durationInSeconds: number;
    language: Languages;
}