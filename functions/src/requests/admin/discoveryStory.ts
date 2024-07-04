import { https } from "firebase-functions/v2";
import { HttpsError } from "firebase-functions/v2/https";
import { IIncomingDiscoveryStory } from "../../types/discoverStory";
import { GenerateBufferFromText } from "../../modules/google";
import { UploadBufferAsAudio, UploadTextAsFile } from "../../services/upload";
import { v1 } from 'uuid'
import { AdminFunctions } from "../../services/admin";
import { MoveFile } from "../../services/storage";
import { IStory } from "../../types/story";
import { VoiceType } from "../../types/subscription";
import { GenderType } from "../../types/languages";

export const GenerateDiscoveryStory = https.onCall<IIncomingDiscoveryStory>({ maxInstances: 10 }, async (event) => {
    const isAdmin = event.auth?.token["admin"];
    if (!isAdmin) return new HttpsError("unauthenticated", "You are not an admin");

    const data = event.data;

    const storyId = v1()

    const buffer = await GenerateBufferFromText({ text: data.storyText, languageCode: data.language, genderType: data.genderType, model: data.voiceType == "Advanced" ? "Neural2" : "Standard" })

    const storyFileLink = await UploadTextAsFile(data.storyText, "discoveryStories", storyId)
    const { url: audioFileLink, durationInSeconds } = await UploadBufferAsAudio(buffer, "discoveryStories", storyId)

    const imageLink = await MoveFile(data.imagePath, `discoveryStories/${storyId}/coverImage.png`)

    const story: IStory & { voiceType: VoiceType, genderType: GenderType, locked: boolean } = {
        id: storyId,
        created_at: new Date().getTime(),
        audioLink: audioFileLink,
        coverImage: imageLink,
        images: [],
        genres: data.genres,
        language: data.language,
        storyLink: storyFileLink,
        title: data.title,
        customStoryDescriptor: "",
        environments: [],
        characters: [],
        durationInSeconds,
        genderType: data.genderType,
        voiceType: data.voiceType,
        playlist: [],
        locked: data.locked,
        dialogues: true,
        languageLevel: "Advanced",
        voiceModel: data.voiceType === "Advanced" ? "Neural2" : "Standard"
    }

    await new AdminFunctions().uploadDiscoveryStory(storyId, story)

    return { status: 201, statusText: "Successfully" }

})

export const DeleteDiscoveryStory = https.onCall<{ storyId: string }>({ maxInstances: 10 }, async (event) => {
    const isAdmin = event.auth?.token["admin"];
    if (!isAdmin) return new HttpsError("unauthenticated", "You are not an admin");

    await new AdminFunctions().deleteDiscoveryStory(event.data.storyId)

    return { status: 200, statusText: "Successfully" }

})