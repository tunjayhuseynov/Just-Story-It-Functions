import { Collections } from '../types/collections';
import { auth } from "firebase-functions/v1";
import { IUser } from "../types/user";
import { adminApp } from "../admin";
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { error } from 'firebase-functions/logger';
import { https } from 'firebase-functions/v2';
import { FieldValue } from 'firebase-admin/firestore';

export const SignNewUser = auth.user().onCreate(async (userEvent) => {
    try {
        const isAnonymous = userEvent.providerData.length === 0

        const user: IUser = {
            id: userEvent.uid,
            isAnonymous,
            username: userEvent.email ?? userEvent.uid,
            name: null,
            subscription: "",
            customCharacters: {
                // "luckyball": {
                //     name: "Luna Evergreen",
                //     description: "Imaginative storyteller with a quill in hand, weaving enchanting tales of wonder.",
                //     id: "luckyball",
                //     image: null
                // }
            },
            customEnvironments: {
                // "luckyteam": {
                //     name: "Enchanted Forest",
                //     description: "Luna's creative haven, surrounded by ancient trees and vibrant fireflies, where every word becomes a magical journey.",
                //     id: "luckyteam",
                //     image: null
                // }
            },
            createdAt: new Date().getTime(),
            remaningQuoteInSeconds: 0,
            totalUsedInSeconds: 0,
            isSubscriptionCanceled: false,
            offers: {

            },
            productChange: null,
            registeredAt: isAnonymous ? null : new Date().getTime(),
            hasEverSubscribed: false
        }

        await adminApp.firestore().collection(Collections.Users).doc(userEvent.uid).create(user);
    }
    catch (err) {
        const msg = (err as Error).message;
        error(msg)
        throw new HttpsError("unknown", msg);
    }
})

export const DeleteUser = auth.user().onDelete(async (userEvent) => {
    try {
        const mainDoc = adminApp.firestore().collection(Collections.Users).doc(userEvent.uid);
        for (const subcollection of await mainDoc.listCollections()) {
            const batch = adminApp.firestore().batch();

            const docs = await subcollection.get()
            for (const doc of docs.docs) {
                batch.delete(doc.ref);
            }
            await batch.commit()
        }

        await mainDoc.update({ isDeleted: true, deletedAt: new Date().getTime() })
    } catch (err) {
        const msg = (err as Error).message;
        error(msg)
        throw new HttpsError("unknown", msg);
    }
})


export const ConvertNewUserFromAnonym = onCall(async (req) => {
    const userId = req.auth?.uid
    if (!userId) throw new https.HttpsError("permission-denied", "Unauthorized user")

    const username = req.data["username"];
    const oldUserDocs = await adminApp.firestore().collection(Collections.Users).where("username", "==", username).get()
    const isOldUser = oldUserDocs.docs.length > 0;
    const hasEverSubscribed = oldUserDocs.docs.some(doc => doc.data()["hasEverSubscribed"])

    await adminApp.firestore().collection(Collections.Users).doc(userId).update({
        "isAnonymous": false,
        "username": username,
        "remaningQuoteInSeconds": FieldValue.increment(isOldUser ? 0 : 180),
        "registeredAt": new Date().getTime(),
        "hasEverSubscribed": hasEverSubscribed
    })

    return { success: 201 }
})