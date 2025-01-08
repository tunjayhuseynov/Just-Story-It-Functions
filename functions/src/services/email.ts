import { TransactionalEmailsApiApiKeys, TransactionalEmailsApi, SendSmtpEmailToInner, SendSmtpEmail } from '@getbrevo/brevo'
import { adminApp } from '../admin';
import { defineSecret } from 'firebase-functions/params';

export const brevoApiKey = defineSecret("Brevo_Key")

export class BrevoEmail {
    private apiInstance = new TransactionalEmailsApi();

    constructor(API_KEY: string) {
        this.apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, API_KEY)
    }

    async sendEmail(subject: string, to: SendSmtpEmailToInner[], templateId: number, params?: object) {
        const sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.templateId = templateId;
        sendSmtpEmail.params = params
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.to = to;
        sendSmtpEmail.sender = { name: "Just Story It", email: "noreply@juststoryit.net" }

        await this.apiInstance.sendTransacEmail(sendSmtpEmail)
    }
}


export const SendVerificationLinkEmail = async (email: string) => {
    const service = new BrevoEmail(brevoApiKey.value());
    const link = await adminApp.auth().generateEmailVerificationLink(email, { url: "https://juststoryit.net/auth" });
    await service.sendEmail("Your Verification Link", [{ email }], 7, { VER: link });
}

export const SendResetPasswordEmail = async (email: string) => {
    const service = new BrevoEmail(brevoApiKey.value());
    const link = await adminApp.auth().generatePasswordResetLink(email, { url: "https://juststoryit.net/auth" });
    await service.sendEmail("Your Reset Password Link", [{ email }], 9, { RES: link });
}

export const SendWelcomeEmail = async (emails: string[]) => {
    const service = new BrevoEmail(brevoApiKey.value());
    await service.sendEmail("Welcome to the Just Story It family!", emails.map(email => ({ email })), 12, {CLICK: "https://juststoryit.net/redirect-to-app"});
}

export const SendLeavingEmail = async (email: string) => {
    const service = new BrevoEmail(brevoApiKey.value());
    await service.sendEmail("We are sorry for your leave :( Miss you already!", [{ email }], 0, {});
}

export const SendComeBackEmail = async (email: string) => {
    const service = new BrevoEmail(brevoApiKey.value());
    await service.sendEmail("Your personalized audio stories are waiting for you!", [{ email }], 0, {});
}

export const SendNewSubscriptionEmail = async (email: string, hasEverSubscribed: boolean) => {
    const service = new BrevoEmail(brevoApiKey.value());
    let subject = "Wow! You've joined the crew!"
    if (hasEverSubscribed) {
        subject = "Wow! We are still writing our story!"
    }
    await service.sendEmail(subject, [{ email }], 0, {});
}

export const SendExtraMinuteEmail = async (email: string) => {
    const service = new BrevoEmail(brevoApiKey.value());
    await service.sendEmail("Wow! More minutes? You'll rock the story!", [{ email }], 0, {});
}

export const SendSubscriptionCancellationEmail = async (email: string) => {
    const service = new BrevoEmail(brevoApiKey.value());
    await service.sendEmail("We are sorry to hear your subscription cancellation :(", [{ email }], 0, {});
}

