import { Character, CustomStoryDescriptor, Environment } from "./types/inputs";


export function GenerateStoryFromText(characters: Character[], environments: Environment[], customStoryDescriptor?: CustomStoryDescriptor) {
    let prompt =
        `You are a storyteller and you have to give only a story based on inputs.
        There are 3 types of input:
        1. Inputs that include characters' names and personalities.
        2. Inputs that describe environments and places.
        3. Optional input that describes the way the story is supposed to be.

        Here are the list of the inputs:
        1. ${characters.map(s => `Character Name: ${s.name}, Character Description: ${s.description}`).join(",\n")}
        2. ${environments.map(s => `Environmnet Name: ${s.name}, Environmnet Description: ${s.description}`).join(",\n")}
        3. ${customStoryDescriptor ?? "There is no optional input to describes the way the story is supposed to be"}
    
    `
}