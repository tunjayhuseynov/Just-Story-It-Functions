import { Character, Environment } from "./inputs"
import { IStory } from "./story"
import { Subscription } from "./subscription"


export interface IUser {
    id: string,
    username: string,
    name: string | null
    subscription: string,
    customCharacters: { [id: string]: Character },
    customEnvironments: { [id: string]: Environment },
    remaningQuoteInSeconds: number,
    createdAt: number
}

export interface IUserSubscriptionHistory {
    id: string,
    userId: string,
    subscriptionType: keyof typeof Subscription,
    subscriptionAction: "Renewed" | "Subscribed" | "Canceled"
    createdAt: number,
}

export interface IUserStoryHistory {
    id: string
    userId: string,
    story: IStory,
    createdAt: number
}