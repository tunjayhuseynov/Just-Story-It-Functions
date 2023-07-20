import { onDocumentDeleted, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { Collections } from "../types/collections";
import { IPlaylist } from "../types/playlist";
import { AdminCrud } from "../services/crud";
import { FieldValue } from "firebase-admin/firestore";
import { IUserStoryHistory } from "../types/user";
import { adminApp } from "../admin";
import { IStory } from "../types/story";


export const updateTriggerStoryToPlaylist = onDocumentUpdated({ document: `${Collections.Users}/{userId}/${Collections.StoryHistories}/{docId}`, maxInstances: 10 }, async (event) => {
    const doc = event.data?.after;
    const prevDoc = event.data?.before;
    if (doc?.exists && prevDoc?.exists) {
        const story = doc.data() as IUserStoryHistory;
        const prevStory = prevDoc.data() as IUserStoryHistory;
        const crud = new AdminCrud<{ [name: string]: string }>(Collections.Users, { doc: event.params.userId, collection: Collections.Playlist });

        if (story.story.title != prevStory.story.title) {
            const batch = adminApp.firestore().batch()
            for (const playlistId of story.story.playlist) {
                batch.update(crud.GetDocumentReference.doc(playlistId), { [`stories.${story.id}.title`]: story.story.title })
            }
            await batch.commit()
        }
    }
})

export const updateTriggerPlaylistToStory = onDocumentUpdated({ document: `${Collections.Users}/{userId}/${Collections.Playlist}/{docId}`, maxInstances: 10 }, async (event) => {
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
            const batch = adminApp.firestore().batch()
            for (const id of newStoriesId) {
                batch.update(crud.GetDocumentReference.doc(id), { "story.playlist": FieldValue.arrayUnion(event.params.docId) })
            }
            await batch.commit()
        }

        if (Object.keys(prevPlaylist.stories).length > Object.keys(playlist.stories).length) {
            const removedStoriesId: string[] = []

            for (const storyId of Object.keys(prevPlaylist.stories)) {
                if (playlist.stories[storyId] == undefined) {
                    removedStoriesId.push(storyId)
                }
            }
            const batch = adminApp.firestore().batch()
            for (const id of removedStoriesId) {
                batch.update(crud.GetDocumentReference.doc(id), { "story.playlist": FieldValue.arrayRemove(event.params.docId) })
            }
            await batch.commit()
        }
    }
})

export const deleteTriggerPlaylist = onDocumentDeleted({ document: `${Collections.Users}/{userId}/${Collections.Playlist}/{docId}`, maxInstances: 10 }, async (event) => {
    const data = event.data;

    if (data?.exists) {
        const playlist = data.data() as IPlaylist;

        const stories = Object.values(playlist.stories) as IStory[];

        const crud = new AdminCrud<{ [name: string]: string }>(Collections.Users, { doc: event.params.userId, collection: Collections.StoryHistories });

        const batch = adminApp.firestore().batch();
        for (const story of stories) {
            batch.update(crud.GetDocumentReference.doc(story.id), { playlist: FieldValue.arrayRemove(event.params.docId) })
        }
        await batch.commit()
    }
})