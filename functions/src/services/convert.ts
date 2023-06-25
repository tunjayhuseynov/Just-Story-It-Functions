import mp3Duration from 'mp3-duration';

export async function getMP3Duration(buffer: Buffer): Promise<number> {
    return new Promise((resolve, reject) => {

        // Calculate the duration of the MP3 file
        mp3Duration(buffer, (err, duration) => {
            if (err) {
                reject(err);
            } else {
                // Delete the temporary file
                if (duration == undefined) {
                    reject(Error("Cannot get duration"))
                }
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                resolve(duration!);
            }
        });
    });
}