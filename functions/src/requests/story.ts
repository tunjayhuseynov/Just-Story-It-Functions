import { onCall } from "firebase-functions/v2/https";
import { Character, CustomStoryDescriptor, Environment, ReferanceStory } from "../types/inputs";
import { GenderType, LanguageLevel, Languages } from "../types/languages";
import { AddStoryToUser, getUserFromDB, isQuoteSufficient } from "../services/user";
import { GenerateStory } from "../services/generate";
import { v1 as uuid } from 'uuid'
import { IStory } from "../types/story";

interface IRequest {
    genres: string[],
    characters: Character[],
    environments: Environment[],
    language: Languages,
    languageLevel: LanguageLevel,
    customStoryDescriptor?: CustomStoryDescriptor,
    minimumWordCount: number,
    dialogues: boolean,
    voiceGenderType: GenderType,
    referanceStory?: ReferanceStory,
}

interface IResponse {
    story: IStory,
    newQuote: number
}

export const GetStory = onCall<IRequest, Promise<IResponse>>(async (request) => {
    let uid = request.auth?.uid;

    if (!uid) throw new Error("Authorization is mandatory")

    let user = await getUserFromDB(uid)

    if (!user) throw new Error("There is no user with such an id")

    let storyId = uuid()

    if (await isQuoteSufficient(uid, request.data.minimumWordCount)) throw new Error("No enough quote")

    let { audioFileLink, coverImageLink, storyFileLink, storyTitle, durationInSeconds } = await GenerateStory({
        storyId,
        user,
        language: request.data.language,
        genres: request.data.genres,
        languageLevel: request.data.languageLevel,
        wordCount: request.data.minimumWordCount,
        voiceGenderType: request.data.voiceGenderType,
        customStoryDescriptor: request.data.customStoryDescriptor,
        referanceStory: request.data.referanceStory
    })

    let response: IResponse = {
        newQuote: 0,
        story: {
            id: storyId,
            created_at: new Date().getTime(),
            audioLink: audioFileLink,
            coverImage: coverImageLink,
            images: [],
            language: request.data.language,
            storyLink: storyFileLink,
            title: storyTitle,
            customStoryDescriptor: request.data.customStoryDescriptor,
            environments: request.data.environments,
            characters: request.data.characters,
            durationInSeconds
        }
    }

    response.newQuote = await AddStoryToUser(uid, response.story, request.data.minimumWordCount)

    return response;
})