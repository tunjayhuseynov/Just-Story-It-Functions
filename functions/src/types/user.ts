import { Character, Environment } from "./inputs"
import { IStory } from "./story"
import { Subscription } from "./subscription"


export interface IUser {
    id: string,
    username: string,
    name: string | null
    subscription: string,
    isSubscriptionCanceled: boolean,
    productChange: string | null,
    customCharacters: { [id: string]: Character },
    customEnvironments: { [id: string]: Environment },
    remaningQuoteInSeconds: number,
    totalUsedInSeconds: number,
    offers: { [storeProductId: string]: { storeProductId: string, offerProductId: string } }
    createdAt: number,
    hasEverSubscribed: boolean
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