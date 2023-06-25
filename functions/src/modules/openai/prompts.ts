import { Languages } from '../../types/languages';
import { Character, Environment, LanguageName } from './../../types/inputs';


// Prompt for System

export const promptForSystem = `You are an application that produces fictional stories based on user's inputs.

There are 5 types of input:
a. Inputs of the characters' names and personalities that the story has to include them.
b. Inputs of the describe environments and places that the story has to include them.
c. Inputs that describe the genres of the story
d. Optional input that describes the way the story is supposed to be.`


// User Inputs And Chapters

export const promptForUserInputsAndChapters = ({ characters, environments, genres, customDescription, chapterAmount }: { chapterAmount: number, customDescription: string | null, characters: Character[], environments: Environment[], genres: string[] }) => {
    return `Here are the list of the inputs:
a: 
${characters.map((v, i) => `${i + 1}. Character Name: ${v.name}, Character Description: ${v.description}`)}

b:
${environments.map((v, i) => `${i + 1}. Environment Name: ${v.name}, Environment Description: ${v.description}`)}

c: The genres of the story should be ${genres.join(", ")}

d: ${customDescription ?? "There is no optional input to describe the way the story is supposed to be, you can be fully creative"}

You have to give me ${chapterAmount} chapter title for a story based on these inputs.

Your response is always just JSON which looks like this example structure:
{
"chapters": [{{chapter titles}}],
"title": {{title}},
"coverImagePrompt": {{coverImagePrompt}}
}`
}

export interface IUserInputsAndChaptersResponse {
    chapters: string[],
    title: string,
    coverImagePrompt: string
}


// Each Chapter

export const promptForEachChapter = ({ dialogues, language, chapterName, wordAmount }: { wordAmount: number, chapterName: string, language: { code: Languages, level: string }, dialogues: boolean }) => {
    return `Write ${wordAmount} words of ${chapterName}.

Your response is always just the story itself

Rule 1: New line has to be an escape sequence
Rule 2: You have ${dialogues ? "" : "NOT"} to use the dialogues of characters
Rule 3: The story has to consist of the level of ${language.level} vocabulary and the language has to be ${LanguageName[language.code]}`
}

export type IChapterResponse = string;


// Extra Words

export const askExtraWords = (content: string, minWordLimit: number) => {
    return `The word amount of the content is not ${minWordLimit} words. Add more ${(minWordLimit - content.length) + 25} words`
}