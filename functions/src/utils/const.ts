export const publicURL = (path: string) => {
    return `https://firebasestorage.googleapis.com/v0/b/just-story-it.appspot.com/o/${encodeURIComponent(path)}?alt=media`
}