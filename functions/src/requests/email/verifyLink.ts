import { HttpsError, onCall, } from "firebase-functions/https";
import { brevoApiKey, SendVerificationLinkEmail } from "../../services/email";
import { getUserFromDB } from "../../services/user";
import { logger } from "firebase-functions/v2";
import { onDocumentUpdated } from "firebase-functions/firestore";
import { IUser } from "../../types/user";
import { isValidEmail } from "../../utils";


export const SendVerificationLink = onCall({ secrets: [brevoApiKey] }, async (req) => {
    try {
        if (!req.auth?.uid) throw new HttpsError("unauthenticated", "The function must be called while authenticated")
        const user = await getUserFromDB(req.auth.uid)
        if (user?.isAnonymous || !user?.username) throw new HttpsError("invalid-argument", "The account has no email attached to it")
        if (!isValidEmail(user.username)) throw new HttpsError("invalid-argument", "Username is not a valid email")

        await SendVerificationLinkEmail(user.username)

        logger.info(`Verification Email is sent to ${user.username}`)
        return { "message": `Verification Email is sent to ${user.username}` }
    } catch (error) {
        logger.error(`Verification Email Error: ${error}`)
        throw error;
    }
})


export const SendVerificationLinkOnSignup = onDocumentUpdated({ document: "Users/{docId}", secrets: [brevoApiKey] }, async (event) => {
    try {
        const currentData = event.data?.after.data() as IUser
        const prevData = event.data?.before.data() as IUser | undefined

        if (!!prevData && currentData.username != prevData.username && isValidEmail(currentData.username)) {
            await SendVerificationLinkEmail(currentData.username)
            logger.info(`Verification Email is sent to ${currentData.username}`)
        } else {
            logger.error(`Validation issue on SendVerificationLinkOnSignup: Current: ${currentData}; Prev: ${prevData}`)
        }
    } catch (error) {
        logger.error(`Verification Email Error: ${error}`)
        throw error
    }
})