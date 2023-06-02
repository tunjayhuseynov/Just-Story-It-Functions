import { LanguageName, type Character, type CustomStoryDescriptor, type Environment, ReferanceStory } from "../types/inputs";
import { ChatCompletionRequestMessage, ChatCompletionResponseMessage, Configuration, OpenAIApi } from "openai"
import type { LanguageLevel, Languages } from "../types/languages";
import { GptType } from "../types/gpt";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});



interface IGenerateStoryFromText {
    aiModel: GptType,
    genres: string[],
    referanceStory?: ReferanceStory,
    characters: Character[],
    environments: Environment[],
    language: Languages,
    languageLevel: LanguageLevel,
    customStoryDescriptor?: CustomStoryDescriptor,
    minimumWordCount: number,
    dialogues: boolean,
    isCoverImagePromptNeeded: boolean
}

export async function GenerateStoryFromText(
    { characters, environments, language, customStoryDescriptor, minimumWordCount, dialogues, languageLevel, aiModel, referanceStory, genres, isCoverImagePromptNeeded }: IGenerateStoryFromText) {

    if (referanceStory && aiModel === "gpt-3.5-turbo") {
        referanceStory = undefined
    }

    let chapters = Math.ceil(minimumWordCount / 3000)

    let prompt =
        `You are a storyteller and you have to give only a story based on inputs.
        There are 3 types of input:
        1. Inputs that include characters' names and personalities.
        2. Inputs that describe environments and places.
        3. Inputs that describe the genres of the story
        4. Optional input that describes the way the story is supposed to be.

        Here are the list of the inputs:
        1. ${characters.map(s => `Character Name: ${s.name}, Character Description: ${s.description}`).join(",\n")}
        2. ${environments.map(s => `Environment Name: ${s.name}, Environment Description: ${s.description}`).join(",\n")}
        3. The genres of the story should be ${genres.join(",")}
        4. ${customStoryDescriptor ?? "There is no optional input to describe the way the story is supposed to be"}

        The language of the story has to be in ${LanguageName[language]}

        The language level of the readers is a ${languageLevel} level

        The story's word count must be around ${minimumWordCount} words

        ${referanceStory ? `This story is based on another story, and it has to be the continuation of the base story. Here is the link of the base story: ${referanceStory.link}` : ""}

        ${chapters > 1 ? `The story words amount exceeds the token limits of yours. Therefore, we splits the stories into chapters. We have ${chapters} chapters. Give me the first chapter after I say 'Directly give the story'. Then, when I say 'Next Chapter', directly give me the next chapter` : ""}

        The story must ${dialogues ? "" : "NOT"} include dialogues

        Directly give the story
    `

    let messages: ChatCompletionRequestMessage[] = [
        { role: "system", content: "You are a story generator bot" },
        { role: "user", content: prompt }
    ]

    let chapterCountdown = chapters
    while (chapterCountdown > 0) {

        messages.push({ role: "user", content: chapterCountdown === chapters ? prompt : "Next Chapter" })

        let response = await RequestChatGPT(messages, aiModel, 0)

        if (response) {
            messages.push(response)
        }

        chapterCountdown--
    }

    let title = await GetTitleFromStory(messages, aiModel)

    let coverImagePrompt = ""
    if (isCoverImagePromptNeeded) {
        coverImagePrompt = await GetCoverImagePromptText(messages, aiModel);
    }

    return { title, coverImagePrompt, story: messages.filter(s => s.role === "assistant").map(s => s.content).join("\n\n") }
}

async function GetCoverImagePromptText(messages: ChatCompletionRequestMessage[], aiModel: IGenerateStoryFromText["aiModel"]) {
    let coverImagePrompt = ""
    messages.push({ role: "user", content: "I'll create a cover image for this story. I use DALL·E 2. I need a prompt text contains only words to describe it to DALL·E 2. Graphic design style must look like Art Deco style. Give me a maximum 800 character limited prompt text directly" })
    let coverImageReq = await RequestChatGPT(messages, aiModel, 0)

    if (coverImageReq) {
        coverImagePrompt = coverImageReq.content;
    }

    return coverImagePrompt;
}

async function GetTitleFromStory(messages: ChatCompletionRequestMessage[], aiModel: IGenerateStoryFromText["aiModel"], referanceStory?: ReferanceStory) {
    let prompt = referanceStory ? `The based story's title is ${referanceStory.title}. Write a title based on the based story's title directly` : "Write a title to the story directly"

    messages.push({ role: "user", content: prompt })

    let titleReq = await RequestChatGPT(messages, aiModel, 0)

    let title = ""
    if (titleReq) {
        title = titleReq.content
        messages.push(titleReq)
    }

    return title;
}

async function RequestChatGPT(messages: ChatCompletionRequestMessage[], aiModel: IGenerateStoryFromText["aiModel"], attemptCount: number): Promise<ChatCompletionResponseMessage | undefined> {
    const openai = new OpenAIApi(configuration);

    let response = await openai.createChatCompletion({
        model: aiModel,
        messages,
        temperature: 0.4
    })
    if (response.status != 200 && response.status != 429) throw new Error(response.statusText)

    let message = response.data.choices[0].message

    if (attemptCount > 10) throw new Error("Attempt limit exceeded")

    // Bypass Rate Limit
    if (response.status == 429) {
        await new Promise((resolve) => setTimeout(resolve, 10000))
        message = await RequestChatGPT(messages, aiModel, attemptCount + 1)
    }

    return message
}


export async function GenerateImageFromText(text: string) {
    const openai = new OpenAIApi(configuration);

    let res = await openai.createImage({
        prompt: text,
        response_format: "b64_json"
    });

    let base64 = res.data.data[0].b64_json;

    if (!base64) throw new Error("The response of Dall-e is empty")

    return base64;
}