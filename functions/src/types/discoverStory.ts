import { SpeechCreateParams } from "openai/resources/audio/speech";
import { Languages } from "./languages";
import { VoiceType } from "./subscription";
import { TNarrationStyle } from "./narrationStyles";



export interface IIncomingDiscoveryStory {
    title: string,
    genres: string[],
    imagePath: string,
    language: Languages,
    storyText: string,
    voiceType: VoiceType,
    voice: SpeechCreateParams["voice"],
    narrationStyle: TNarrationStyle
    locked: boolean
}