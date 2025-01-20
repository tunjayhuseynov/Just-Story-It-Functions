import { IChapterResponse, IUserInputsAndChaptersResponse, askExtraWords, promptForEachChapter, promptForSystem, promptForUserInputsAndChapters } from './prompts/index';
import { ReferanceStory } from "../../../types/inputs";
import type { Character, CustomStoryDescriptor, Environment } from "../../../types/inputs";
import type { LanguageLevel, Languages } from "../../../types/languages";
import { GptType } from "../../../types/gpt";
import { defineSecret } from "firebase-functions/params";
import { RequestChatGPT } from "./request";
import { info } from 'firebase-functions/logger';
import { ChatCompletionMessageParam } from 'openai/resources';
import { TNarrationStyle } from '../../../types/narrationStyles';

export const openaiApiKey = defineSecret("OpenAI_API_Key");

export interface IGenerateStoryFromText {
    aiModel: GptType,
    genres: string[],
    referanceStory: ReferanceStory | null,
    characters: Character[],
    environments: Environment[],
    language: Languages,
    languageLevel: LanguageLevel,
    narrationStyle: TNarrationStyle,
    customStoryDescriptor: CustomStoryDescriptor | null,
    minimumWordCount: number,
    isCoverImagePromptNeeded: boolean
}

export async function GenerateStoryFromText(
    { characters, environments, language, customStoryDescriptor, minimumWordCount, languageLevel, aiModel, genres, isCoverImagePromptNeeded, narrationStyle }: IGenerateStoryFromText) {


    const messages: ChatCompletionMessageParam[] = [
        {
            role: "system", content: promptForSystem(language)
        },
    ]

    const chapterWordAmount = minimumWordCount > 500 ? 500 : minimumWordCount;

    const chapterAmount = Math.ceil(minimumWordCount / 550)

    const chapterPrompt = promptForUserInputsAndChapters({
        chapterAmount: chapterAmount,
        narrationStyle,
        characters: characters,
        customDescription: customStoryDescriptor,
        environments: environments,
        genres: genres,
        storyLangauge: language
    })

    messages.push({ role: "user", content: chapterPrompt })

    info("Chapters is processing")
    const chaptersResponse = await RequestChatGPT(messages, aiModel, 0)
    if (!chaptersResponse?.content) throw Error("Content is undefined");

    const chapters = JSON.parse(chaptersResponse.content) as IUserInputsAndChaptersResponse;
    messages.push(chaptersResponse)
    info(`Chaperts: ${JSON.stringify(chapters)}`)
    
    const storyArray: string[] = []

    let chapterIndex = 0
    while (chapterIndex < chapterAmount) {
        messages.push({ role: "user", content: promptForEachChapter({ wordAmount: chapterWordAmount, narrationStyle, chapterName: chapters.chapters[chapterIndex], language: { code: language, level: languageLevel } }) })

        const chapterResponse = await RequestChatGPT(messages, aiModel, 0)
        if (!chapterResponse?.content) throw Error("Content is undefined")
        let chapter = chapterResponse.content as IChapterResponse
        messages.push(chapterResponse)

        if (minimumWordCount > 200 && chapter.length < (chapterWordAmount - 80) && chapterIndex < 2) {
            messages.push({ role: "user", content: askExtraWords(chapter, chapterWordAmount, language) })

            const chapterResponse = await RequestChatGPT(messages, aiModel, 0)
            if (!chapterResponse?.content) throw Error("Content is undefined")
            chapter = chapterResponse.content as IChapterResponse
            messages.push(chapterResponse)
        }

        if (chapter) {
            storyArray.push(chapter)
        }

        chapterIndex++
    }


    const mainStory = storyArray.join("\n\n");

    const title = chapters.title;

    let coverImagePrompt = "";
    if (isCoverImagePromptNeeded) {
        coverImagePrompt = chapters.coverImagePrompt;
    }

    return { title, coverImagePrompt, story: mainStory }
}






