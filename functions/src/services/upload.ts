import { adminApp } from "../admin"
import { info } from 'firebase-functions/logger';
import { getMP3Duration } from "./media";
import { publicURL } from "../utils/const";

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
    await file.save(Buffer.from(base64, "base64"), { contentType: "image/jpeg" })



    return publicURL(path);
}


export const UploadTextAsFile = async (text: string, userId: string, storyId: string) => {
    const storage = adminApp.storage().bucket()

    const path = `${userId}/${storyId}/text.txt`;
    const file = storage.file(path);
    await file.save(text, { contentType: "text/plain" })

    return publicURL(path);
}