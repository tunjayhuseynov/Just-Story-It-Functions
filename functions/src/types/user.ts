import { Character, Environment } from "./inputs"
import { IStory } from "./story"
import { Subscription } from "./subscription"
import { firestore } from 'firebase-admin'


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
    userId: firestore.DocumentReference,
    story: IStory,
    created_at: number
}