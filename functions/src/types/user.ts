import { Character, Environment } from "./inputs"
import { IStory } from "./story"
import { Subscription } from "./subscription"


export interface IUser {
    id: string,
    username: string,
    name: string | null
    subscription: (keyof typeof Subscription) | null,
    customCharacters: Character[],
    customEnviornments: Environment[],
    remaningQuoteInSeconds: number,
    createdAt: number
}

export interface IUserHistory {
    id: string
    userId: string,
    story: IStory,
    createdAt: number
}