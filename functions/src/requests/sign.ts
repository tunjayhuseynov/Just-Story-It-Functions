import { Collections } from '../types/collections';
import { auth } from "firebase-functions";
import { IUser } from "../types/user";
import { adminApp } from "../admin";
import { HttpsError } from 'firebase-functions/v2/https';
import { error } from 'firebase-functions/logger';

export const SignNewUser = auth.user().onCreate(async (userEvent) => {

    try {
        const user: IUser = {
            id: userEvent.uid,
            username: userEvent.email ?? userEvent.uid,
            name: null,
            subscription: "",
            customCharacters: {
                "luckyball": {
                    name: "Luna Evergreen",
                    description: "Imaginative storyteller with a quill in hand, weaving enchanting tales of wonder.",
                    id: "luckyball",
                    image: null
                }
            },
            customEnvironments: {
                "luckyteam": {
                    name: "Enchanted Forest",
                    description: "Luna's creative haven, surrounded by ancient trees and vibrant fireflies, where every word becomes a magical journey.",
                    id: "luckyteam",
                    image: null
                }
            },
            createdAt: new Date().getTime(),
            remaningQuoteInSeconds: 0,
            totalUsedInSeconds: 0,
            isSubscriptionCanceled: false,
            offers: {

            },
            productChange: null,
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

        await mainDoc.delete()
    } catch (err) {
        const msg = (err as Error).message;
        error(msg)
        throw new HttpsError("unknown", msg);
    }
})