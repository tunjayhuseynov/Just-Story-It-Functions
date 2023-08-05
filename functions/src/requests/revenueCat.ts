import {
    onDocumentWritten,
} from "firebase-functions/v2/firestore";
import { IPurchaseEvent } from "../types/revenueCat";
import { adminApp } from "../admin";
import { Collections } from "../types/collections";
import { Subscription } from "../types/subscription";
import { info } from "firebase-functions/logger";
import { FieldValue } from "firebase-admin/firestore";

export const subscriptionEvent = onDocumentWritten({ document: "events/{docId}", maxInstances: 10, memory: "512MiB" }, (event) => {
    if (event.data?.after.exists) {
        const data = event.data.after.data();
        info("Data")
        info(data ?? "Null")
        if (data) {
            const event = data as IPurchaseEvent;
            if (event.type == "RENEWAL" || event.type == "INITIAL_PURCHASE") {
                const entitlements = event.entitlement_ids;
                const plan = Subscription[entitlements.length > 0 ? entitlements[0] : "Free"]
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
                    isSubscriptionCanceled: true,
                    productChange: null
                });
            } else if (event.type == "EXPIRATION") {
                const plan = Subscription["Free"]
                adminApp.firestore().collection(Collections.Users).doc(event.app_user_id).update({
                    subscription: plan.revenueCat.identifier,
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
            }
        }
    }
})