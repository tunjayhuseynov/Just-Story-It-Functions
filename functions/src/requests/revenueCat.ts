import {
    onDocumentWritten,
} from "firebase-functions/v2/firestore";
import { IPurchaseEvent } from "../types/revenueCat";
import { adminApp } from "../admin";
import { Collections } from "../types/collections";
import { Subscription } from "../types/subscription";
import { info } from "firebase-functions/logger";
import { FieldValue } from "firebase-admin/firestore";
import { IUser } from "../types/user";

export const subscriptionEvent = onDocumentWritten({ document: "events/{docId}", maxInstances: 10, memory: "512MiB" }, async (event) => {
    if (event.data?.after.exists) {
        const data = event.data.after.data();
        info("Data")
        info(data ?? "Null")
        if (data) {
            const event = data as IPurchaseEvent;
            if (event.type == "RENEWAL" || event.type == "INITIAL_PURCHASE") {
                const entitlements = event.entitlement_ids;
                const plan = Subscription[entitlements[0]]
                info("Plan")
                info(plan)
                adminApp.firestore().collection(Collections.Users).doc(event.app_user_id).update({
                    subscription: plan.revenueCat.identifier,
                    remaningQuoteInSeconds: plan.freeUsageSecondsAmount,
                    isSubscriptionCanceled: false,
                    productChange: null,
                    hasEverSubscribed: true
                });
            } else if (event.type == "CANCELLATION") {
                adminApp.firestore().collection(Collections.Users).doc(event.app_user_id).update({
                    // subscription: null,
                    isSubscriptionCanceled: true,
                    productChange: null
                });
            } else if (event.type == "EXPIRATION") {
                adminApp.firestore().collection(Collections.Users).doc(event.app_user_id).update({
                    subscription: null,
                    remaningQuoteInSeconds: 0,
                    isSubscriptionCanceled: false,
                    productChange: null
                });
            } else if (event.type == "NON_RENEWING_PURCHASE") {
                if (event.presented_offering_id == "Extra Minutes" && event.product_id) {
                    const minutes = parseInt(event.product_id.split("_")[0]);

                    adminApp.firestore().collection(Collections.Users).doc(event.app_user_id).update({
                        remaningQuoteInSeconds: FieldValue.increment(minutes * 60),
                    });
                }
            } else if (event.type == "TRANSFER") {
                const from = event.transferred_from?.at(0)?.includes("$RCAnonymousID") ? event.transferred_from?.at(1) : event.transferred_from?.at(0);
                const to = event.transferred_to?.at(0)?.includes("$RCAnonymousID") ? event.transferred_to?.at(1) : event.transferred_to?.at(0);

                if (from && to) {
                    const fromUserDoc = await adminApp.firestore().collection(Collections.Users).doc(from).get()

                    if (fromUserDoc.data()) {
                        const fromUser = fromUserDoc.data() as IUser

                        await adminApp.firestore().collection(Collections.Users).doc(to).update({
                            subscription: fromUser.subscription,
                            productChange: fromUser.productChange,
                            remaningQuoteInSeconds: fromUser.remaningQuoteInSeconds,
                            hasEverSubscribed: fromUser.hasEverSubscribed,
                        })
                        await adminApp.firestore().collection(Collections.Users).doc(from).update({
                            subscription: null,
                            productChange: null,
                            remaningQuoteInSeconds: 0,
                        })
                    }
                }
            }
        }
    }
})