import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { Collections } from "../types/collections";
import { IPlaylist } from "../types/playlist";
import { AdminCrud } from "../services/crud";
import { FieldValue } from "firebase-admin/firestore";




export const updateTriggerPlaylistToStory = onDocumentUpdated({ document: `${Collections.Users}/{userId}/${Collections.Playlist}/{docId}`, maxInstances: 10 }, (event) => {
    const doc = event.data?.after;
    const prevDoc = event.data?.before;
    if (doc?.exists && prevDoc?.exists) {
        const playlist = doc.data() as IPlaylist;
        const prevPlaylist = prevDoc.data() as IPlaylist;
        const crud = new AdminCrud<{ "story.playlist": FieldValue }>(Collections.Users, { doc: event.params.userId, collection: Collections.StoryHistories });

        if (Object.keys(prevPlaylist.stories).length < Object.keys(playlist.stories).length) {
            const newStoriesId: string[] = []

            for (const storyId of Object.keys(playlist.stories)) {
                if (prevPlaylist.stories[storyId] == undefined) {
                    newStoriesId.push(storyId)
                }
            }


            for (const id of newStoriesId) {
                crud.Update({ id, "story.playlist": FieldValue.arrayUnion(event.params.docId) })
            }
        }

        if (Object.keys(prevPlaylist.stories).length > Object.keys(playlist.stories).length) {
            const removedStoriesId: string[] = []

            for (const storyId of Object.keys(prevPlaylist.stories)) {
                if (playlist.stories[storyId] == undefined) {
                    removedStoriesId.push(storyId)
                }
            }

            for (const id of removedStoriesId) {
                crud.Update({ id, "story.playlist": FieldValue.arrayRemove(event.params.docId) })
            }
        }
    }
})