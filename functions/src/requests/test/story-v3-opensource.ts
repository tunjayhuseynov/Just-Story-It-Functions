import { HttpsError, onRequest } from "firebase-functions/v2/https";
import { Character, CustomStoryDescriptor, Environment, ReferanceStory } from "../../types/inputs";
import { LanguageLevel, Languages, LangaugeSecondsToWordsDeltaIndex } from "../../types/languages";
import { AddLoadingStoryToUser, ConvertLoadingStoryToFailedStory, ConvertLoadingStoryToReadyStory, getUserFromDB, isQuoteSufficient } from "../../services/user";
import { GenerateStoryV3 } from "../../services/generate-v3-opensource";
import { v1 as uuid } from 'uuid'
import { IStory } from "../../types/story";
import { error, info } from 'firebase-functions/logger';
import { openaiApiKey, openrouterApiKey } from "../../modules/V3/opensource";
import { TNarrationStyle } from "../../types/narrationStyles";
import { SpeechCreateParams } from "openai/resources/audio/speech";
import { UnauthorizedError } from "../../utils/errors";
import cors from 'cors';
const corsHandler = cors({ origin: true });

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

const MY_UID = "czgfMSvrKrd7yqWgBd63hySparz1"

// We may split GetStory functions into 2 parts. GetStory for 12 minutes and under, and GetStory for 13 minutes and above
export const GetStoryV3OpenSource = onRequest({ maxInstances: 10, timeoutSeconds: 300, memory: "512MiB", secrets: [openaiApiKey, openrouterApiKey] }, async (req, res) => corsHandler(req, res, async () => {
    const storyId = uuid()
    const request = req.body as IRequest
    const uid = MY_UID
    try {
        info(`UID: ${uid}`)
        info(`Input: ${JSON.stringify(request)}`)

        const secondToWordDelta = LangaugeSecondsToWordsDeltaIndex[request.language];

        if (!uid) throw new UnauthorizedError("Authorization is mandatory")

        const user = await getUserFromDB(uid)

        if (!user) throw new UnauthorizedError("There is no user with such an id")


        if (await isQuoteSufficient(user, request.averageDurationInSeconds)) throw new Error("No enough usage")

        await AddLoadingStoryToUser(user, storyId)
        info("Loading story to user is finished!")

        const { audioFileLink, coverImageLink, storyFileLink, storyTitle, durationInSeconds, voiceModelType } = await GenerateStoryV3({
            storyId,
            user,
            language: request.language,
            genres: request.genres,
            languageLevel: request.languageLevel,
            wordCount: Math.ceil(request.averageDurationInSeconds * secondToWordDelta),
            customStoryDescriptor: request.customStoryDescriptor,
            referanceStory: request.referanceStory,
            charaters: request.characters,
            environments: request.environments,
            narrationStyle: request.narrationStyle,
            voice: request.voice
        })

        const response: IResponse = {
            newQuote: 0,
            story: {
                id: storyId,
                created_at: new Date().getTime(),
                audioLink: audioFileLink,
                coverImage: coverImageLink,
                images: [],
                genres: request.genres,
                language: request.language,
                storyLink: storyFileLink,
                title: storyTitle,
                customStoryDescriptor: request.customStoryDescriptor,
                environments: request.environments,
                characters: request.characters,
                durationInSeconds,
                playlist: [],
                languageLevel: request.languageLevel,
                voiceModel: voiceModelType,
                narrationStyle: request.narrationStyle,
                voice: request.voice,
                version: "v2"
            }
        }

        response.newQuote = await ConvertLoadingStoryToReadyStory(user, response.story)

        return response;
    } catch (err) {
        const msg = (err as Error).message;
        if (!(err instanceof UnauthorizedError) && uid) {
            try {
                await ConvertLoadingStoryToFailedStory(uid, storyId)
            } catch (err2) {
                error(`Error in ConvertLoadingStoryToFailedStory: User: ${uid}, Error: ${err2}`)
            }
        }
        error(err)
        error(msg)
        throw new HttpsError("unknown", msg);
    }
}))