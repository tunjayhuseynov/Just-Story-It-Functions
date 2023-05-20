import { ReferanceStory } from './../types/inputs';
import { GenerateImageFromText, GenerateStoryFromText } from "../modules/openai";
import { GenderType, LanguageLevel, Languages } from "../types/languages";
import { Subscription } from "../types/subscription";
import { IUser } from "../types/user";
import { UploadBase64AsImage, UploadBufferAsAudio, UploadTextAsFile } from './upload';
import { GenerateAudioLinkFromText } from '../modules/google';

interface IGenerateStoryProps {
    storyId: string,
    user: IUser,
    wordCount: number,
    genres: string[],
    language: Languages,
    languageLevel: LanguageLevel,
    voiceGenderType: GenderType,
    customStoryDescriptor?: string,
    referanceStory?: ReferanceStory
}

interface IGenerateStoryResponse {
    storyTitle: string,
    coverImageLink: string | null,
    storyFileLink: string,
    audioFileLink: string,
    durationInSeconds: number
}

export async function GenerateStory({ storyId, user, genres, language, languageLevel, wordCount, customStoryDescriptor, referanceStory, voiceGenderType }: IGenerateStoryProps): Promise<IGenerateStoryResponse> {
    let subscription = Subscription[user.subscription];
    let coverImageLink = ""

    let { story, title, coverImagePrompt } = await GenerateStoryFromText({
        aiModel: subscription.gptModel,
        characters: user.customCharacters,
        environments: user.customEnviornments,
        dialogues: subscription.dialogues,
        genres,
        language,
        languageLevel,
        minimumWordCount: wordCount,
        isCoverImagePromptNeeded: subscription.coverImage,
        customStoryDescriptor,
        referanceStory
    })

    if (subscription.coverImage && coverImagePrompt) {
        let imageBase64 = await GenerateImageFromText(coverImagePrompt)
        coverImageLink = await UploadBase64AsImage(imageBase64, user.id, storyId)
    }

    let buffer = await GenerateAudioLinkFromText({ text: story, languageCode: language, genderType: voiceGenderType, modelType: subscription.voicType == "Advanced" ? "Neural2" : "Standard" })
    let { url: audioFileLink, durationInSeconds } = await UploadBufferAsAudio(buffer, user.id, storyId)

    let storyFileLink = await UploadTextAsFile(story, user.id, storyId)

    return {
        storyTitle: title,
        coverImageLink: coverImageLink || null,
        audioFileLink,
        storyFileLink,
        durationInSeconds
    }
}