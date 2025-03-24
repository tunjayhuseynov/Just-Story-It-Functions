import { falAIKey } from ".";
import { fal } from "@fal-ai/client";
import axios from "axios";
import { info } from "firebase-functions/logger";

export async function GenerateImageFromText(text: string) {
    fal.config({
        credentials: falAIKey.value()
    });

    const result = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
            image_size: {
                width: 512,
                height: 512
            },
            num_images: 1,
            prompt: text
        },
        onQueueUpdate: (update) => {
          if (update?.status === "IN_PROGRESS") {
                update?.logs?.map((log) => log.message)?.forEach(info);
            }
        },
    });

    const request = await axios.get(result.data.images[0].url, { responseType: "arraybuffer", responseEncoding: "base64" })

    return request.data
}