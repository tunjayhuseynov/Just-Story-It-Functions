import { onSchedule } from "firebase-functions/v2/scheduler";
import { adminApp } from "../admin";
import { onDocumentUpdated } from "firebase-functions/firestore";
import { onCall } from "firebase-functions/https";
import { FieldValue } from "firebase-admin/firestore";

export const checkFinishedEvents = onSchedule({ schedule: "every 5 minutes" }, async () => {
    const now = new Date();
    const snapshot = await adminApp.firestore().collection("events")
      .where("endTime", "<", now)
      .where("finished", "==", false)
      .get();

    const batch = adminApp.firestore().batch();

    snapshot.forEach((doc) => {
      const eventData = doc.data();
      
      const finishedEventRef = adminApp.firestore().collection("finishedEvents").doc(doc.id);
      batch.set(finishedEventRef, eventData);
      
      batch.delete(doc.ref);
    });

    await batch.commit();
});


export const sendEmailOnDocumentAddition = onDocumentUpdated({ document: "users/{userId}" }, async (event) => {
    // Burada documents bir list'di
    const isDocumentCreated = event.data?.after.data().documents.length > event.data?.before.data().documents.length;
 
    if (isDocumentCreated) {
        const userEmail = event.data?.after.data().email;
        const documentName = event.data?.after.data().documents[event.data?.after.data().documents.length - 1].name;
        
        // Mock send email function
        MockSendEmail(userEmail, "New Document Added", `A new document named "${documentName}" has been added to your account.`);
    }
})


// Mock Send Email Function
function MockSendEmail(to: string, subject: string, body: string) {
    console.log(`Sending email to ${to} with subject "${subject}" and body "${body}"`);
}


export const warningOrBanTemporarly = onCall(async (request)=>{
    const { userId, reason } = request.data;
    if(request.auth == null) {
        throw new Error("Unauthorized access");
    }

    const currentUser = await adminApp.auth().getUser(request.auth.uid)

    if(currentUser.customClaims?.role !== "admin") {
        throw new Error("Unauthorized access");
    }

    const userRef = adminApp.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        throw new Error("User not found");
    }

    const userData = userDoc.data();
    
    if (userData && !userData.isBanned) {
        if(userData.warningCount + 1 < 3) {
            await userRef.update({
                warningCount: FieldValue.increment(1),
            });
        } else {
            await userRef.update({
                isBanned: true,
                banReason: reason,
                warningCount: 0,
                banEndTime: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days ban
            });
        }
    }
})

export const reminderForTomorrowEvents = onSchedule({ schedule: "every 12 hours from 09:00" }, async () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const snapshot = await adminApp.firestore().collection("events")
    .where("startDate", "<=", tomorrow)
    .where("startDate", ">", new Date())
    .where("lastDayReminderDone", "!=", false)
    .get();

      const batch = adminApp.firestore().batch();
      const eventIds: string[] = [];

      for (const eventDoc of snapshot.docs) {
          const eventId = eventDoc.id;
        
          const users = await adminApp.firestore().collection("users").where("joinedEvents", "array-contains", eventId).get()

          for (const userDoc of users.docs) {
              const userEmail = userDoc.data().email;

              MockSendEmail(userEmail, "Event Reminder", `You have an event starting tomorrow. Event ID: ${eventId}`);
          }

         eventIds.push(eventId);
      }

      eventIds.forEach((eventId) => {
          const eventRef = adminApp.firestore().collection("events").doc(eventId);
          batch.update(eventRef, { lastDayReminderDone: true });
      });

      await batch.commit();
});


export const reminder = {
    for: {
        tomorrow: {
            event: reminderForTomorrowEvents
        }
    }
}