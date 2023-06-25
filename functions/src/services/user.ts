import { adminApp } from "../admin";
import { Collections } from "../types/collections";
import { IStory } from "../types/story";
import { IUser, IUserStoryHistory } from "../types/user";
import { AdminCrud } from "./crud";

export async function getUserFromAuth(uid: string) {
    try {
        return await adminApp.auth().getUser(uid)
    } catch (error) {
        return undefined;
    }
}

export async function getUserFromDB(uid: string) {
    const users = await new AdminCrud<IUser>(Collections.Users).GetOne(uid)

    if (!users) return undefined

    return users as IUser
}

export async function AddStoryToUser(user: IUser, story: IStory) {
    const historyCrud = new AdminCrud<IUserStoryHistory>(Collections.UserStoryHistories)

    const data: IUserStoryHistory = {
        id: story.id,
        story: story,
        userId: user.id,
        createdAt: new Date().getTime()
    }

    await historyCrud.Create(data, story.id)
    return await UpdateRemainingQuote(user, story)
}

async function UpdateRemainingQuote(user: IUser, story: IStory) {
    const crud = new AdminCrud<IUser>(Collections.Users)

    const duration = user.remaningQuoteInSeconds - story.durationInSeconds

    await crud.Update({
        id: user.id,
        remaningQuoteInSeconds: Math.max(0, duration)
    })

    return duration
}

export async function isQuoteSufficient(user: IUser, avarageDuration: number) {
    return user.remaningQuoteInSeconds - avarageDuration < -1
}