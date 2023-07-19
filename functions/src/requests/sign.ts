import { Collections } from '../types/collections';
import { auth } from "firebase-functions";
import { IUser } from "../types/user";
import { adminApp } from "../admin";
import { HttpsError } from 'firebase-functions/v2/https';
import { error } from 'firebase-functions/logger';
import { Subscription } from '../types/subscription';

export const SignNewUser = auth.user().onCreate(async (userEvent) => {
 
    try {
        const user: IUser = {
            id: userEvent.uid,
            username: userEvent.email ?? userEvent.uid,
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
        await adminApp.firestore().collection(Collections.Users).doc(userEvent.uid).delete()
    } catch (err) {
        const msg = (err as Error).message;
        error(msg)
        throw new HttpsError("unknown", msg);
    }
})