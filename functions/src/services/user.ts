import { adminApp } from "../admin";
import { IStory } from "../types/story";
import { IUser, IUserHistory } from "../types/user";
import { AdminCrud } from "./crud";

export async function getUserFromAuth(uid: string) {
    try {
        return await adminApp.auth().getUser(uid)
    } catch (error) {
        return undefined;
    }
}

export async function getUserFromDB(uid: string) {
    let users = await new AdminCrud<IUser>("Users").GetOne(uid)

    if (!users) return undefined

    return users as IUser
}

export async function AddStoryToUser(uid: string, story: IStory, predictedWordCount: number) {
    let historyCrud = new AdminCrud<IUserHistory>("UserHistories")

    let data: IUserHistory = {
        id: story.id,
        story: story,
        userId: uid,
        createdAt: new Date().getTime()
    }

    await historyCrud.Create(data, story.id)
    return await UpdateRemainingQuote(uid, story, predictedWordCount)
}

async function UpdateRemainingQuote(uid: string, story: IStory, predictedWordCount: number) {
    let user = await getUserFromDB(uid);

    if (!user) throw new Error("User not found")

    let crud = new AdminCrud<IUser>("Users")

    let duration = user.remaningQuoteInSeconds - (Math.min(CalculateNewQuote(predictedWordCount), story.durationInSeconds))

    await crud.Update({
        id: uid,
        remaningQuoteInSeconds: duration
    })

    return duration
}

export function CalculateNewQuote(wordCount: number) {
    let x = 0.384;
    let len = wordCount;
    return len * x;
}

export async function isQuoteSufficient(uid: string, wordCount: number) {
    let userQuote = await getUserFromDB(uid)
    if (!userQuote) throw new Error("No User Found")

    let seconds = CalculateNewQuote(wordCount)

    if (userQuote.remaningQuoteInSeconds - seconds < 0) return false

    return true
}