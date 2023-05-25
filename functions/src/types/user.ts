import { Character, Environment } from "./inputs"
import { IStory } from "./story"
import { Subscription } from "./subscription"


export interface IUser {
    id: string,
    username: string,
    name: string
    subscription: keyof typeof Subscription,
    customCharacters: Character[],
    customEnviornments: Environment[],
    remaningQuoteInSeconds: number
}

export interface IUserHistory {
    id: string
    userId: string,
    story: IStory,
    createdAt: number
}