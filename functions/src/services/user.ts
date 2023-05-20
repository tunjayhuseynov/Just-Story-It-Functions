import { firestore } from "firebase-admin";
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

export async function AddStoryToUser(uid: string, story: IStory) {
    let crud = new AdminCrud<IUserHistory>("UserHistories")

    let data: IUserHistory = {
        story: story,
        userId: firestore().collection("Users").doc(uid),
        created_at: new Date().getTime()
    }

    await crud.Create(data, story.id)
    await UpdateRemainingQuote(uid, story)
}

async function UpdateRemainingQuote(uid: string, story: IStory) {
    let user = await getUserFromDB(uid);

    if (!user) throw new Error("User not found")

    let crud = new AdminCrud<IUser>("Users")

    await crud.Update({
        id: uid,
        remaningQuoteInSeconds: (user.remaningQuoteInSeconds - story.durationInSeconds + 1)
    })
}