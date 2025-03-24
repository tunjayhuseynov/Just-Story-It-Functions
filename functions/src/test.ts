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
});


// (async () => {
//     function byteLength(str: string) {
//         // returns the byte length of an utf8 string
//         var s = str.length;
//         for (var i = str.length - 1; i >= 0; i--) {
//             var code = str.charCodeAt(i);
//             if (code > 0x7f && code <= 0x7ff) s++;
//             else if (code > 0x7ff && code <= 0xffff) s += 2;
//         }
//         return s;
//     }

//     function sizeOfObject(object: {[key: string]: any }) {
//         if (object === null) {
//             return 1;
//         }
//         //GeoPoint
//         if (object.hasOwnProperty("_lat") && typeof object.isEqual === "function")
//             return 16;
//         //Date
//         if (
//             typeof object.toDate === "function" ||
//             typeof object.getDate === "function"
//         )
//             return 8;
//         //Blob
//         if (typeof object.toUint8Array === "function") {
//             var blob = object.toUint8Array();
//             return blob.byteLength;
//         }
//         //Reference
//         if (typeof object.onSnapshot === "function") {
//             return object["_key"]["path"]["segments"]
//                 .slice(object["_key"]["path"]["offset"])
//                 .reduce(function (acc: any, curr: any) {
//                     return acc + curr.length + 1;
//                 }, 16);
//         }
//         var bytes = 0;
//         for (var key in object) {
//             if (!Object.hasOwnProperty.call(object, key)) {
//                 continue;
//             }

//             bytes += sizeof(key);
//             try {
//                 bytes += sizeof(object[key]);
//             } catch (ex) {
//                 if (ex instanceof RangeError) {
//                     // circular reference detected, final result might be incorrect
//                     // let's be nice and not throw an exception
//                     bytes = 0;
//                 }
//             }
//         }

//         return bytes;
//     }

//     function sizeof(object: any) : any{

//         var objectType = typeof object;
//         switch (objectType) {
//             case "string":
//                 return byteLength(object) + 1;
//             case "boolean":
//                 return 1;
//             case "number":
//                 return 8;
//             case "object":
//                 if (Array.isArray(object)) {
//                     return object.map(sizeof).reduce(function (acc, curr) {
//                         return acc + curr;
//                     }, 0);
//                 } else {
//                     return sizeOfObject(object);
//                 }
//             default:
//                 return 0;
//         }
//     }

//     function sizeOfDoc(object: any) {
//         return 32 + sizeof(object);
//     }

//     adminApp.firestore().collection("Users").doc("czgfMSvrKrd7yqWgBd63hySparz1").collection("StoryHistories").doc("a64186d0-f237-11ef-8f02-ed7ad78d83b6").get().then((snapshot) => {
//         console.log(sizeof(snapshot.data()))
//     })
// })