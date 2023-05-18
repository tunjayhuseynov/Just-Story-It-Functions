import { LanguageName, type Character, type CustomStoryDescriptor, type Environment } from "./types/inputs";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai"
import type { Languages } from "./types/languages";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
interface IGenerateStoryFromText {
    aiModel: "gpt-4" | "gpt-4-32k" | "gpt-3.5-turbo",
    genres: string[],
    referanceStoryLink?: string,
    characters: Character[],
    environments: Environment[],
    language: Languages,
    languageLevel: "beginner" | "intermediate" | "advanced",
    customStoryDescriptor?: CustomStoryDescriptor,
    minimumWordCount: number,
    dialogues: boolean,
    requestTimeout: number,
}

export async function GenerateStoryFromText(
    { characters, environments, language, customStoryDescriptor, minimumWordCount, dialogues, requestTimeout, languageLevel, aiModel, referanceStoryLink, genres }: IGenerateStoryFromText) {
    const openai = new OpenAIApi(configuration);

    if (referanceStoryLink && aiModel === "gpt-3.5-turbo") {
        referanceStoryLink = ""
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

        ${referanceStoryLink ? `This story is based on another story, and it has to be the continuation of the base story. Here is the link of the base story: ${referanceStoryLink}` : ""}

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

        await new Promise((resolve) => setTimeout(() => resolve("done"), requestTimeout))

        messages.push({ role: "user", content: chapterCountdown === chapters ? prompt : "Next Chapter" })

        let response = await openai.createChatCompletion({
            model: aiModel,
            messages,
            temperature: 0.4
        })
        if (response.status != 200) continue

        if (response.data.choices[0].message) {
            messages.push(response.data.choices[0].message)
        }

        chapterCountdown--
    }

    return messages.filter(s => s.role === "assistant").map(s => s.content).join("\n_____\n")
}