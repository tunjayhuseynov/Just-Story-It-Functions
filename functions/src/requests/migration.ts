import { https } from "firebase-functions";
import { Subscription } from "../types/subscription";
import { adminApp } from "../admin";
import { Collections } from "../types/collections";




export const SubscriptionPackageMigration = https.onRequest(async (req, res) => {
    const promises = Object.entries(Subscription).map(async ([packageName, value]) => {
        await adminApp.firestore().collection(Collections.SubscriptionPackages).doc(packageName).update(value);
    })

    await Promise.all(promises)

    res.send("Done")
})