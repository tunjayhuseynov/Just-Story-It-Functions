import { HttpsError, onCall, } from "firebase-functions/https";
import { brevoApiKey, SendResetPasswordEmail } from "../../services/email";
import { logger } from "firebase-functions/v2";
import { isValidEmail } from "../../utils";


export const SendResetPassword = onCall({ secrets: [brevoApiKey], invoker: "public" }, async (req) => {
    try {
        if (!req.data?.email) throw new HttpsError("invalid-argument", "Body does not contain the 'email' property")

        if (!isValidEmail(req.data.email)) throw new HttpsError("invalid-argument", "Data is not a valid email")

        await SendResetPasswordEmail(req.data.email)

        logger.info(`Reset Password Email is sent to ${req.data.email}`)
        return { "message": `Reset Password is sent to ${req.data.email}` }
    } catch (error) {
        logger.error(`Reset Password Email Error: ${error}`)
        throw error;
    }
})