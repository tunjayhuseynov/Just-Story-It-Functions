import { IStory } from "./story";

export interface IPlaylist {
    id: string,
    name: string,
    userId: string,
    createdAt: number
    stories: { [id: string]: IStory }
}