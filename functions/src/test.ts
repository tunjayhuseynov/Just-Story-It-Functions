import admin from 'firebase-admin'
import serviceAccount from './service.json'

const adminApp = admin.initializeApp({
    credential: admin.credential.cert({ clientEmail: serviceAccount.client_email, privateKey: serviceAccount.private_key, projectId: serviceAccount.private_key }),
    projectId: serviceAccount.project_id
})


const msg = adminApp.messaging();

(async () => {
    try {
        await msg.send({
            android: {
                notification: {
                    "icon": "ic_notification",
                    "imageUrl": "https://juststoryit.net/assets/images/old_logo.png",
                }
            },
            token: "",
            notification: {
                title: 'You have a new message!',
                body: 'Tap to reply',
            },
            data: {
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
            }
        })
    } catch (error) {
        console.log(error)
    }
})()