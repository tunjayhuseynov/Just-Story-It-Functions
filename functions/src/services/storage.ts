import { adminApp } from "../admin"
import { publicURL } from "../utils/const";


export const MoveFile = async (currentFilePath: string, destinationPath: string) => {
    await adminApp.storage().bucket().file(currentFilePath).move(destinationPath);
    return publicURL(destinationPath);
}