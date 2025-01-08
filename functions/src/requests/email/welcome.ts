import { SendWelcomeEmail } from "../../services/email";
import { logger, pubsub } from "firebase-functions/v1";
import { adminApp } from "../../admin";
import { Collections } from "../../types/collections";
import { IUser } from "../../types/user";
import { isValidEmail } from "../../utils";

export const SendWelcomeCron = pubsub.schedule('every 15 minutes').onRun(async () => {
    try {
        const fiftenMinutesAgo = Date.now() - (15 * 60 * 1000)
        const req = await adminApp.firestore()
            .collection(Collections.Users)
            .where("registeredAt", ">=", fiftenMinutesAgo)
            .orderBy('registeredAt', 'desc')
            .get()

        const emails: string[] = []
        for (const doc of req.docs) {
            try {
                const user = doc.data() as IUser;
                if (isValidEmail(user.username)) {
                    const userAuth = await adminApp.auth().getUser(doc.id)
                    if (userAuth.emailVerified) {
                        emails.push(user.username)
                    }
                }
            } catch (error) {
                logger.error(`SendWelcomeCron: ${error}`)
            }
        }
        if (emails.length === 0) {
            logger.info(`Welcome emails: No new welcomers`)
        } else {
            logger.info(`Welcome emails are ready to be sent`)
            await SendWelcomeEmail(emails)
        }

        logger.info(`Welcome emails are sent to: ${emails.length} users; From: ${new Date(fiftenMinutesAgo).toISOString()} - To: ${new Date().toISOString()}`)
    } catch (error) {
        logger.error(`Welcome Email Error: ${error}`)
    }

    return null;
});