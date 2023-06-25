import { Character, Environment, ReferanceStory } from './../types/inputs';
import { GenerateStoryFromText } from "../modules/openai";
import { GenderType, LanguageLevel, Languages } from "../types/languages";
import { Subscription } from "../types/subscription";
import { IUser } from "../types/user";
import { UploadBase64AsImage, UploadBufferAsAudio, UploadTextAsFile } from './upload';
import { GenerateBufferFromText } from '../modules/google';
import { GenerateImageFromText } from '../modules/openai/image';
import { info } from 'firebase-functions/logger';

interface IGenerateStoryProps {
    storyId: string,
    user: IUser,
    charaters: Character[],
    environments: Environment[],
    wordCount: number,
    genres: string[],
    language: Languages,
    languageLevel: LanguageLevel,
    voiceGenderType: GenderType,
    customStoryDescriptor: string | null,
    referanceStory: ReferanceStory | null,
    dialogues: boolean
}

interface IGenerateStoryResponse {
    storyTitle: string,
    coverImageLink: string | null,
    storyFileLink: string,
    audioFileLink: string,
    durationInSeconds: number
}

export async function GenerateStory({ dialogues, charaters, environments, storyId, user, genres, language, languageLevel, wordCount, customStoryDescriptor, referanceStory, voiceGenderType }: IGenerateStoryProps): Promise<IGenerateStoryResponse> {
    if (!user.subscription) throw Error("No Subscription yet")

    const subscription = Subscription[user.subscription];
    let coverImageLink = ""
    info("Word count:")
    info(wordCount)
    const { story, title, coverImagePrompt } = await GenerateStoryFromText({
        aiModel: subscription.gptModel,
        characters: charaters,
        environments: environments,
        dialogues: subscription.dialogues == true ? dialogues : false,
        genres,
        language,
        languageLevel,
        minimumWordCount: wordCount,
        isCoverImagePromptNeeded: subscription.coverImage,
        customStoryDescriptor,
        referanceStory
    })

    if (subscription.coverImage && coverImagePrompt) {
        const imageBase64 = await GenerateImageFromText(coverImagePrompt)
        coverImageLink = await UploadBase64AsImage(imageBase64, user.id, storyId)
    }

    const storyFileLink = await UploadTextAsFile(story, user.id, storyId)

    const buffer = await GenerateBufferFromText({ text: story, languageCode: language, genderType: voiceGenderType, model: subscription.voicType == "Advanced" ? "Neural2" : "Standard" })
    const { url: audioFileLink, durationInSeconds } = await UploadBufferAsAudio(buffer, user.id, storyId)


    return {
        storyTitle: title,
        coverImageLink: coverImageLink || null,
        audioFileLink,
        storyFileLink,
        durationInSeconds
    }
}