import { Collections } from "../types/collections";
import { IStory } from "../types/story";
import { AdminCrud } from "./crud";


export class AdminFunctions {
    async uploadDiscoveryStory(id: string, story: IStory) {
        const create = await new AdminCrud<IStory>(Collections.DiscoveryStories).Create(story, id);

        return create;
    }
}