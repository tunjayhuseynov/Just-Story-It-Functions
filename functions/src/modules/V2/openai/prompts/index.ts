import { LanguageLevel, Languages } from '../../../../types/languages';
import { Character, Environment } from '../../../../types/inputs';
import { TNarrationStyle } from '../../../../types/narrationStyles';
import { promptForUserInputsAndChapters as promptForUserInputsAndChaptersEnglish, promptForEachChapter as promptForEachChapterEnglish, askExtraWords as askExtraWordsEnglish, promptForSystem as promptForSystemEn } from './en'
import { promptForUserInputsAndChapters as promptForUserInputsAndChaptersSpanish, promptForEachChapter as promptForEachChapterSpanish, askExtraWords as askExtraWordsSpanish, promptForSystem as promptForSystemEs} from './sp'

// Prompt for System
export const promptForSystem = (storyLangauge: Languages) => {
    if (storyLangauge === "en-US") {
        return promptForSystemEn
    } else if (storyLangauge === "es-ES") {
        return promptForSystemEs;
    }

    throw new Error("Missing language")
}


// User Inputs And Chapters

export type TInputGeneral = {
    chapterAmount: number,
    customDescription: string | null,
    characters: Character[],
    environments: Environment[],
    genres: string[],
    narrationStyle: TNarrationStyle,
    storyLangauge: Languages
}


export const promptForUserInputsAndChapters = (params: TInputGeneral) => {
    if (params.storyLangauge === "en-US") {
        return promptForUserInputsAndChaptersEnglish(params)
    } else if (params.storyLangauge === "es-ES") {
        return promptForUserInputsAndChaptersSpanish(params);
    }

    throw new Error("Missing language")
}

export interface IUserInputsAndChaptersResponse {
    chapters: string[],
    title: string,
    coverImagePrompt: string
}


// Each Chapter

export type TInputPerChapter = {
    wordAmount: number,
    chapterName: string,
    language: {
        code: Languages,
        level: LanguageLevel
    },
    narrationStyle: TNarrationStyle
}

export const promptForEachChapter = (params: TInputPerChapter) => {
    if (params.language.code === "en-US") {
        return promptForEachChapterEnglish(params)
    } else if (params.language.code === "es-ES") {
        return promptForEachChapterSpanish(params);
    }

    throw new Error("Missing language")
}

export type IChapterResponse = string;


// Extra Words

export const askExtraWords = (content: string, minWordLimit: number, storyLangauge: Languages) => {
    if (storyLangauge === "en-US") {
        return askExtraWordsEnglish(content, minWordLimit)
    } else if (storyLangauge === "es-ES") {
        return askExtraWordsSpanish(content, minWordLimit);
    }

    throw new Error("Missing language")
}