import { IChapterResponse, IUserInputsAndChaptersResponse, askExtraWords, promptForEachChapter, promptForSystem, promptForUserInputsAndChapters } from './prompts';
import { ReferanceStory } from "../../types/inputs";
import type { Character, CustomStoryDescriptor, Environment } from "../../types/inputs";
import { ChatCompletionRequestMessage } from "openai"
import type { LanguageLevel, Languages } from "../../types/languages";
import { GptType } from "../../types/gpt";
import { defineSecret } from "firebase-functions/params";
import { RequestChatGPT } from "./request";
import { info } from 'firebase-functions/logger';

export const openaiApiKey = defineSecret("OpenAI_API_Key");


export interface IGenerateStoryFromText {
    aiModel: GptType,
    genres: string[],
    referanceStory: ReferanceStory | null,
    characters: Character[],
    environments: Environment[],
    language: Languages,
    languageLevel: LanguageLevel,
    customStoryDescriptor: CustomStoryDescriptor | null,
    minimumWordCount: number,
    dialogues: boolean,
    isCoverImagePromptNeeded: boolean
}

export async function GenerateStoryFromText(
    { characters, environments, language, customStoryDescriptor, minimumWordCount, dialogues, languageLevel, aiModel, referanceStory, genres, isCoverImagePromptNeeded }: IGenerateStoryFromText) {

    if (referanceStory && aiModel.includes("gpt-3.5")) {
        referanceStory = null
    }
    const messages: ChatCompletionRequestMessage[] = [
        {
            role: "system", content: promptForSystem
        },
    ]

    const chapterWordAmount = minimumWordCount > 500 ? 500 : minimumWordCount;

    const chapterAmount = Math.ceil(minimumWordCount / 550)

    const chapterPrompt = promptForUserInputsAndChapters({ chapterAmount: chapterAmount, characters: characters, customDescription: customStoryDescriptor, environments: environments, genres: genres })

    messages.push({ role: "user", content: chapterPrompt })

    const chaptersResponse = await RequestChatGPT(messages, aiModel.includes("gpt-4") ? aiModel : "gpt-3.5-turbo", 0)
    if (!chaptersResponse?.content) throw Error("Content is undefined");

    const chapters = JSON.parse(chaptersResponse.content) as IUserInputsAndChaptersResponse;
    info(chapters)
    messages.push(chaptersResponse)


    const storyArray: string[] = []

    let chapterIndex = 0
    while (chapterIndex < chapterAmount) {
        messages.push({ role: "user", content: promptForEachChapter({ wordAmount: chapterWordAmount, chapterName: chapters.chapters[chapterIndex], dialogues: dialogues, language: { code: language, level: languageLevel } }) })

        const chapterResponse = await RequestChatGPT(messages, (aiModel.includes("gpt-3") && chapterIndex === 0) ? "gpt-3.5-turbo" : aiModel, 0)
        if (!chapterResponse?.content) throw Error("Content is undefined")
        let chapter = chapterResponse.content as IChapterResponse
        messages.push(chapterResponse)

        if (minimumWordCount > 200 && chapter.length < (chapterWordAmount - 80) && chapterIndex < 2) {
            messages.push({ role: "user", content: askExtraWords(chapter, chapterWordAmount) })

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






