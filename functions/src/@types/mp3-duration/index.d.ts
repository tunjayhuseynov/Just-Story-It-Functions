declare module 'mp3-duration' {
    function mp3Duration(filePath: string | Buffer, callback: (err: Error | null, duration?: number) => void): void;
    export = mp3Duration;
}
