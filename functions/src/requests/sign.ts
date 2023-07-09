import { Collections } from '../types/collections';
import { beforeUserCreated } from "firebase-functions/v2/identity";
import { auth } from "firebase-functions";
import { IUser } from "../types/user";
import { adminApp } from "../admin";
import { HttpsError } from 'firebase-functions/v2/https';
import { error } from 'firebase-functions/logger';
import { Subscription } from '../types/subscription';

export const SignNewUser = beforeUserCreated({ maxInstances: 10 }, async (userEvent) => {
    if (!userEvent.auth) throw new HttpsError("unauthenticated", "No User Id");
    if (!userEvent.data) throw new HttpsError("unauthenticated", "No User Data");
    try {
        const user: IUser = {
            id: userEvent.auth.uid,
            username: userEvent.data.email ?? userEvent.auth.uid,
            name: null,
            subscription: Subscription["Free"].revenueCat.identifier,
            customCharacters: {},
            customEnvironments: {},
            createdAt: new Date().getTime(),
            remaningQuoteInSeconds: 0,
            totalUsedInSeconds: 0,
            isSubscriptionCanceled: false,
            productChange: null
        }

        await adminApp.firestore().collection(Collections.Users).doc(userEvent.auth.uid).create(user);
    }
    catch (err) {
        const msg = (err as Error).message;
        error(msg)
        throw new HttpsError("unknown", msg);
    }
})

export const DeleteUser = auth.user().onDelete(async (userEvent) => {
    try {
        await adminApp.firestore().collection(Collections.Users).doc(userEvent.uid).delete()
    } catch (err) {
        const msg = (err as Error).message;
        error(msg)
        throw new HttpsError("unknown", msg);
    }
})