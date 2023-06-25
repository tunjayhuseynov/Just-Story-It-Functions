import { HttpsError, onCall } from "firebase-functions/v2/https";
import { Character, CustomStoryDescriptor, Environment, ReferanceStory } from "../types/inputs";
import { GenderType, LanguageLevel, Languages, LangaugeSecondsToWordsDeltaIndex } from "../types/languages";
import { AddStoryToUser, getUserFromDB, isQuoteSufficient } from "../services/user";
import { GenerateStory } from "../services/generate";
import { v1 as uuid } from 'uuid'
import { IStory } from "../types/story";
import { error, info } from 'firebase-functions/logger';
import { openaiApiKey } from "../modules/openai";

interface IRequest {
    genres: string[],
    characters: Character[],
    environments: Environment[],
    language: Languages,
    languageLevel: LanguageLevel,
    customStoryDescriptor: CustomStoryDescriptor | null,
    averageDurationInSeconds: number,
    dialogues: boolean,
    voiceGenderType: GenderType,
    referanceStory: ReferanceStory | null,
}

interface IResponse {
    story: IStory,
    newQuote: number
}

// We may split GetStory functions into 2 parts. GetStory for 12 minutes and under, and GetStory for 13 minutes and above
export const GetStory = onCall<IRequest, Promise<IResponse>>({ maxInstances: 10, timeoutSeconds: 300, memory: "512MiB", secrets: [openaiApiKey] }, async (request) => {
    try {
        const uid = request.auth?.uid
        info("Language:")
        info(request.data.language)

        const secondToWordDelta = LangaugeSecondsToWordsDeltaIndex[request.data.language];

        if (!uid) throw new Error("Authorization is mandatory")

        const user = await getUserFromDB(uid)

        if (!user) throw new Error("There is no user with such an id")

        const storyId = uuid()

        if (await isQuoteSufficient(user, request.data.averageDurationInSeconds)) throw new Error("No enough usage")

        const { audioFileLink, coverImageLink, storyFileLink, storyTitle, durationInSeconds } = await GenerateStory({
            storyId,
            user,
            dialogues: request.data.dialogues,
            language: request.data.language,
            genres: request.data.genres,
            languageLevel: request.data.languageLevel,
            wordCount: Math.ceil(request.data.averageDurationInSeconds * secondToWordDelta),
            voiceGenderType: request.data.voiceGenderType,
            customStoryDescriptor: request.data.customStoryDescriptor,
            referanceStory: request.data.referanceStory,
            charaters: request.data.characters,
            environments: request.data.environments
        })

        const response: IResponse = {
            newQuote: 0,
            story: {
                id: storyId,
                created_at: new Date().getTime(),
                audioLink: audioFileLink,
                coverImage: coverImageLink,
                images: [],
                genres: request.data.genres,
                language: request.data.language,
                storyLink: storyFileLink,
                title: storyTitle,
                customStoryDescriptor: request.data.customStoryDescriptor,
                environments: request.data.environments,
                characters: request.data.characters,
                durationInSeconds
            }
        }

        response.newQuote = await AddStoryToUser(user, response.story)

        return response;
    } catch (err) {
        const msg = (err as Error).message;
        error(err)
        error(msg)
        throw new HttpsError("unknown", msg);
    }
})