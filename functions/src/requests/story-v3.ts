import { HttpsError, onCall } from "firebase-functions/v2/https";
import { Character, CustomStoryDescriptor, Environment, ReferanceStory } from "../types/inputs";
import { LanguageLevel, Languages, LangaugeSecondsToWordsDeltaIndex } from "../types/languages";
import { AddLoadingStoryToUser, ConvertLoadingStoryToFailedStory, ConvertLoadingStoryToReadyStory, getUserFromDB, isQuoteSufficient } from "../services/user";
import { GenerateStoryV3 } from "../services/generate-v3";
import { v1 as uuid } from 'uuid'
import { IStory } from "../types/story";
import { error, info } from 'firebase-functions/logger';
import { openaiApiKey } from "../modules/V3/openai";
import { TNarrationStyle } from "../types/narrationStyles";
import { SpeechCreateParams } from "openai/resources/audio/speech";
import { UnauthorizedError } from "../utils/errors";

interface IRequest {
    genres: string[],
    characters: Character[],
    environments: Environment[],
    language: Languages,
    languageLevel: LanguageLevel,
    customStoryDescriptor: CustomStoryDescriptor | null,
    averageDurationInSeconds: number,
    referanceStory: ReferanceStory | null,
    narrationStyle: TNarrationStyle
    voice: SpeechCreateParams["voice"]
}

interface IResponse {
    story: IStory,
    newQuote: number
}

// We may split GetStory functions into 2 parts. GetStory for 12 minutes and under, and GetStory for 13 minutes and above
export const GetStoryV3 = onCall<IRequest, Promise<IResponse>>({ invoker: "public", cpu: 6, timeoutSeconds: 3600, memory: "16GiB", secrets: [openaiApiKey], concurrency: 500 }, async (request) => {
    const storyId = uuid()
    const uid = request.auth?.uid
    try {
        info(`UID: ${uid}`)
        info(`Input: ${JSON.stringify(request.data)}`)

        const secondToWordDelta = LangaugeSecondsToWordsDeltaIndex[request.data.language];

        if (!uid) throw new UnauthorizedError("Authorization is mandatory")

        const user = await getUserFromDB(uid)

        if (!user) throw new UnauthorizedError("There is no user with such an id")


        if (await isQuoteSufficient(user, request.data.averageDurationInSeconds)) throw new Error("No enough usage")

        await AddLoadingStoryToUser(user, storyId)
        info("Loading story to user is finished!")

        const { audioFileLink, coverImageLink, storyFileLink, storyTitle, durationInSeconds, voiceModelType } = await GenerateStoryV3({
            storyId,
            user,
            language: request.data.language,
            genres: request.data.genres,
            languageLevel: request.data.languageLevel,
            wordCount: Math.ceil(request.data.averageDurationInSeconds * secondToWordDelta),
            customStoryDescriptor: request.data.customStoryDescriptor,
            referanceStory: request.data.referanceStory,
            charaters: request.data.characters,
            environments: request.data.environments,
            narrationStyle: request.data.narrationStyle,
            voice: request.data.voice
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
                durationInSeconds,
                playlist: [],
                languageLevel: request.data.languageLevel,
                voiceModel: voiceModelType,
                narrationStyle: request.data.narrationStyle,
                voice: request.data.voice,
                version: "v2"
            }
        }

        response.newQuote = await ConvertLoadingStoryToReadyStory(user, response.story)

        return response;
    } catch (err) {
        const msg = (err as Error).message;
        if (!(err instanceof UnauthorizedError) && uid) {
            ConvertLoadingStoryToFailedStory(uid, storyId).catch(e => error(`Error in ConvertLoadingStoryToFailedStory: User: ${uid}, Error: ${e}`))
        }
        error(err)
        error(msg)
        throw new HttpsError("unknown", msg);
    }
})