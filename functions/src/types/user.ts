import { Character, Environment } from "./inputs"
import { IStory } from "./story"
import { Subscription } from "./subscription"


export interface IUser {
    id: string,
    username: string,
    isAnonymous: boolean,
    name: string | null
    subscription: string | null,
    isSubscriptionCanceled: boolean,
    productChange: string | null,
    customCharacters: { [id: string]: Character },
    customEnvironments: { [id: string]: Environment },
    remaningQuoteInSeconds: number,
    totalUsedInSeconds: number,
    offers: { [storeProductId: string]: { storeProductId: string, offerProductId: string } }
    createdAt: number,
    hasEverSubscribed: boolean;
    notificationId?: string
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