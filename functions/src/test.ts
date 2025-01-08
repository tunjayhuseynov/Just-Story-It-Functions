import admin from 'firebase-admin'
import serviceAccount from './service.json'

const adminApp = admin.initializeApp({
    credential: admin.credential.cert({ clientEmail: serviceAccount.client_email, privateKey: serviceAccount.private_key, projectId: serviceAccount.private_key }),
    projectId: serviceAccount.project_id
})


const msg = adminApp.messaging();
const icon = "https://firebasestorage.googleapis.com/v0/b/just-story-it.appspot.com/o/FCMImages%2FUpdated%20Logo512.png?alt=media&token=0e8a6296-85a5-4cbd-b2a0-a3ffa2657518";

(async () => {
    try {
        await msg.send({
            android: {
                notification: {
                    "icon": "ic_notification",
                    "imageUrl": icon,
                }
            },
            apns: {
                "payload": {
                    aps: {
                        "alert": {
                            title: "You have a new message!",
                            body: "Tap to reply",
                        },
                        "mutable-content": 1
                    }
                },
                "fcmOptions": {
                    imageUrl: icon
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