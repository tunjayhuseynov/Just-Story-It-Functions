import { adminApp } from "../admin"
import { Readable } from 'stream'
import { getAudioDurationInSeconds } from 'get-audio-duration'

export const UploadBufferAsAudio = async (buffer: Buffer, userId: string, storyId: string) => {
    let storage = adminApp.storage().bucket()

    const file = storage.file(`${userId}/${storyId}/storyAudio.mp3`);
    await file.save(buffer, { contentType: "audio/mpeg" })

    let stream = Readable.from(buffer)
    const duration = await getAudioDurationInSeconds(stream)


    return {
        url: file.publicUrl(),
        durationInSeconds: duration
    };
}

export const UploadBase64AsImage = async (base64: string, userId: string, storyId: string) => {
    let storage = adminApp.storage().bucket()

    const file = storage.file(`${userId}/${storyId}/coverImage.png`);
    await file.save(base64, { contentType: "image/jpeg" })



    return file.publicUrl();
}


export const UploadTextAsFile = async (text: string, userId: string, storyId: string) => {
    let storage = adminApp.storage().bucket()

    const file = storage.file(`${userId}/${storyId}/text.txt`);
    await file.save(text, { contentType: "text/plain" })

    return file.publicUrl();
}