import { IStory } from "./story";

export interface IPlaylist {
    id: string,
    name: string,
    userId: string,
    stories: { [id: string]: IStory }
}