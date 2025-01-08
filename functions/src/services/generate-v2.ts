import { Character, Environment, ReferanceStory } from '../types/inputs';
import { GenerateStoryFromText } from "../modules/V2/openai";
import { LanguageLevel, Languages, VoiceModels } from "../types/languages";
import { ISubscriptionName, Subscription } from "../types/subscription";
import { IUser } from "../types/user";
import { UploadBase64AsImage, UploadBufferAsAudio, UploadTextAsFile } from './upload';
import { GenerateBufferFromText as OpenaiGenerateBufferFromText } from '../modules/V2/openai/tts';
import { GenerateImageFromText } from '../modules/V2/openai/image';
import { info, error } from 'firebase-functions/logger';
import { SpeechCreateParams } from 'openai/resources/audio/speech';
import { TNarrationStyle } from '../types/narrationStyles';

interface IGenerateStoryProps {
    storyId: string,
    user: IUser,
    charaters: Character[],
    environments: Environment[],
    wordCount: number,
    genres: string[],
    language: Languages,
    languageLevel: LanguageLevel,
    voice: SpeechCreateParams["voice"]
    narrationStyle: TNarrationStyle,
    customStoryDescriptor: string | null,
    referanceStory: ReferanceStory | null,
}

interface IGenerateStoryResponse {
    storyTitle: string,
    coverImageLink: string | null,
    storyFileLink: string,
    audioFileLink: string,
    durationInSeconds: number,
    voiceModelType: VoiceModels
}

export async function GenerateStoryV2({ charaters, environments, storyId, user, genres, language, languageLevel, wordCount, customStoryDescriptor, referanceStory, narrationStyle, voice }: IGenerateStoryProps): Promise<IGenerateStoryResponse> {
    const subscription = Subscription[user.subscription as ISubscriptionName] ?? Subscription["The Little Prince"];
    let coverImageLink = ""
    info("Word count:")
    info(wordCount)
    const { story, title, coverImagePrompt } = await GenerateStoryFromText({
        aiModel: subscription.gptModel,
        characters: charaters,
        environments: environments,
        genres,
        language,
        languageLevel,
        minimumWordCount: wordCount,
        isCoverImagePromptNeeded: subscription.coverImage,
        customStoryDescriptor,
        referanceStory,
        narrationStyle
    })

    if (subscription.coverImage && coverImagePrompt) {
        try {
            let imageBase64;
            try {
                imageBase64 = await GenerateImageFromText(coverImagePrompt)
            } catch (err) {
                error(`Error with initial GenerateImageFromText: ${err}`)
                imageBase64 = await GenerateImageFromText(coverImagePrompt, "dall-e-2")
                throw err
            }
            coverImageLink = await UploadBase64AsImage(imageBase64, `users/${user.id}`, storyId)
        } catch (err) {
            error(`Error in image overall process: ${err}`)
        }
    }

    const storyFileLink = await UploadTextAsFile(story, `users/${user.id}`, storyId)

    const buffer = await OpenaiGenerateBufferFromText({ text: story, voice, model: subscription.voicType == "Advanced" ? "hd" : "basic" })

    const { url: audioFileLink, durationInSeconds } = await UploadBufferAsAudio(buffer, `users/${user.id}`, storyId)


    return {
        storyTitle: title,
        coverImageLink: coverImageLink || null,
        audioFileLink,
        storyFileLink,
        voiceModelType: subscription.voicType == "Advanced" ? "Neural2" : "Standard",
        durationInSeconds
    }
}