import { GenderType, Languages } from "./languages";
import { VoiceType } from "./subscription";



export interface IIncomingDiscoveryStory {
    title: string,
    genres: string[],
    imageLink: string,
    language: Languages,
    storyText: string,
    voiceType: VoiceType,
    genderType: GenderType
}