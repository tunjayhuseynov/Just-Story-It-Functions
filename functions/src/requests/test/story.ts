import { HttpsError, onRequest } from "firebase-functions/v2/https";
import { Character, CustomStoryDescriptor, Environment, ReferanceStory } from "../../types/inputs";
import { GenderType, LanguageLevel, Languages, LangaugeSecondsToWordsDeltaIndex } from "../../types/languages";
import { AddStoryToUser, getUserFromDB, isQuoteSufficient } from "../../services/user";
import { GenerateStory } from "../../services/generate";
import { v1 as uuid } from 'uuid'
import { IStory } from "../../types/story";
import { error, info } from 'firebase-functions/logger';
import { openaiApiKey } from "../../modules/openai";
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
    dialogues: boolean,
    voiceGenderType: GenderType,
    referanceStory: ReferanceStory | null,
}

interface IResponse {
    story: IStory,
    newQuote: number
}

const MY_UID = "czgfMSvrKrd7yqWgBd63hySparz1"

// We may split GetStory functions into 2 parts. GetStory for 12 minutes and under, and GetStory for 13 minutes and above
export const GetStory = onRequest({ maxInstances: 10, timeoutSeconds: 300, memory: "512MiB", secrets: [openaiApiKey] }, async (req, res) => corsHandler(req, res, async () => {
    const request = req.body as IRequest
    try {
        const uid = MY_UID; // request.auth?.uid
        info("Language:")
        info(request.language)

        const secondToWordDelta = LangaugeSecondsToWordsDeltaIndex[request.language];

        if (!uid) throw new Error("Authorization is mandatory")

        const user = await getUserFromDB(uid)

        if (!user) throw new Error("There is no user with such an id")

        const storyId = uuid()

        if (await isQuoteSufficient(user, request.averageDurationInSeconds)) throw new Error("No enough usage")

        const { audioFileLink, coverImageLink, storyFileLink, storyTitle, durationInSeconds, voiceModelType } = await GenerateStory({
            storyId,
            user,
            dialogues: request.dialogues,
            language: request.language,
            genres: request.genres,
            languageLevel: request.languageLevel,
            wordCount: Math.ceil(request.averageDurationInSeconds * secondToWordDelta),
            voiceGenderType: request.voiceGenderType,
            customStoryDescriptor: request.customStoryDescriptor,
            referanceStory: request.referanceStory,
            charaters: request.characters,
            environments: request.environments,
            ttsVersion: "OpenAI"
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
                dialogues: request.dialogues,
                genderType: request.voiceGenderType,
                languageLevel: request.languageLevel,
                voiceModel: voiceModelType
            }
        }

        response.newQuote = await AddStoryToUser(user, response.story)

        res.send(response)
    } catch (err) {
        const msg = (err as Error).message;
        error(err)
        error(msg)
        throw new HttpsError("unknown", msg);
    }
}))