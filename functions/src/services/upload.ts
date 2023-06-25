import { adminApp } from "../admin"
import { info } from 'firebase-functions/logger';
import { getMP3Duration } from "./convert";

const publicURL = (path: string) => {
    return `https://firebasestorage.googleapis.com/v0/b/just-story-it.appspot.com/o/${encodeURIComponent(path)}?alt=media`
}

export const UploadBufferAsAudio = async (buffer: Buffer, userId: string, storyId: string) => {
    const storage = adminApp.storage().bucket()

    info("Buffer:")
    info(buffer.byteLength);

    const path = `${userId}/${storyId}/storyAudio.mp3`;
    const file = storage.file(path);
    const duration = await getMP3Duration(buffer)

    await file.save(buffer, {
        contentType: "audio/mpeg", metadata: {
            duration
        }
    })

    return {
        url: publicURL(path),
        durationInSeconds: duration
    };
}

export const UploadBase64AsImage = async (base64: string, userId: string, storyId: string) => {
    const storage = adminApp.storage().bucket()

    const path = `${userId}/${storyId}/coverImage.png`;
    const file = storage.file(path);
    await file.save(base64, { contentType: "image/jpeg" })



    return publicURL(path);
}


export const UploadTextAsFile = async (text: string, userId: string, storyId: string) => {
    const storage = adminApp.storage().bucket()

    const path = `${userId}/${storyId}/text.txt`;
    const file = storage.file(path);
    await file.save(text, { contentType: "text/plain" })

    return publicURL(path);
}