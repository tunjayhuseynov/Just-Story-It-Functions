import { LanguageName } from '../../../../types/inputs';
import { NarrationStyleEn } from '../../../../types/narrationStyles';
import { TInputGeneral, TInputPerChapter } from '.';
import { LanguageLevelEn } from '../../../../types/languages';


// Prompt for System

export const promptForSystem = `You are an application that produces fictional stories based on user's inputs.

There are 6 types of input:
a. Inputs of the characters' names and personalities that the story has to include them.
b. Inputs of the describe environments and places that the story has to include them.
c. Inputs that describe the genres of the story
d. Optional input that describes the way the story is supposed to be.
f. Input that let you know in which narration style you should write the story`



export const promptForUserInputsAndChapters = ({ characters, environments, genres, customDescription, chapterAmount, narrationStyle, storyLangauge }: TInputGeneral) => {
    return `Here are the list of the inputs:
a: 
${characters.map((v, i) => `${i + 1}. Character Name: ${v.name}, Character Description: ${v.description}`)}

b:
${environments.map((v, i) => `${i + 1}. Environment Name: ${v.name}, Environment Description: ${v.description}`)}

c: The genres of the story should be ${genres.join(", ")}

d: ${customDescription ?? "There is no optional input to describe the way the story is supposed to be, you can be fully creative"}

f: The narration style you must use is ${narrationStyle}. The explanation of this style: ${NarrationStyleEn[narrationStyle]}

You have to give me ${chapterAmount} chapter title for a story based on these inputs.

You have to answer in ${LanguageName[storyLangauge]} language.

Your response is always just JSON which looks like this example structure:
{
"chapters": [{{chapter titles}}],
"title": {{title}},
"coverImagePrompt": {{coverImagePrompt}}
}`
}


export const promptForEachChapter = ({ language, chapterName, wordAmount, narrationStyle }: TInputPerChapter) => {
    return `Write ${wordAmount} words of ${chapterName}.

Your response is always just the story itself

Rule 1: New line has to be an escape sequence
Rule 2: The story has to consist of the level of ${LanguageLevelEn[language.level]} vocabulary and the language has to be ${LanguageName[language.code]}
Rule 3: The story's narration style must be in ${narrationStyle}.
Rule 4: You must use the characters' dialogues if the narration style supports it


`
}

export const promptForDialogueSystem = () => {
    return `You are acting as a "dialogue finder." Your objective is to locate all dialogues within a given text. A dialogue is defined as any piece of text enclosed in double quotes ("). Once you identify a dialogue, you must apply the following rules:
1. Wrap the dialogue text in '<dialogue>' tags.  
   - The format should look like:
     <dialogue ...> "Example dialogue text" </dialogue>
   - You must close each '<dialogue>' tag with a corresponding '</dialogue>'.

2. Include the following attributes in the '<dialogue>' tag:
   - 'name' — the name of the character who speaks the dialogue.  
   - 'gender' — the gender of the character.
     - If no gender is specified in the source text, default to 'gender="neutral"'.  
   - 'tone' — a **full sentence** expressing how the dialogue is spoken.  
     - If the tone is not clear, default to a neutral sentence (e.g., "They spoke in an even, calm manner.").  
   - 'emotion' — a **full sentence** describing the character's emotional state.  
     - If the emotion is not clear, default to a neutral sentence (e.g., "They did not seem to show any strong emotion.").  
   - 'delivery' — a **full sentence** describing the manner in which the dialogue was delivered (e.g., whispered, shouted).  
     - If the delivery is not specified or clear, default to a neutral sentence (e.g., "They spoke without any distinctive mannerisms.").

When combined, your '<dialogue>' tag might look like this:

<dialogue
    name="{Character Name}"
    gender="{Character Gender}"
    tone="{Sentence describing tone}"
    emotion="{Sentence describing emotion}"
    delivery="{Sentence describing delivery}"
>
    "Actual dialogue text"
</dialogue>

Example:

Original Text:
Alice opened the door and said, "Hello, everyone! It's great to be here," in a bright and excited tone. Bob responded quietly, "Hi, Alice," showing little emotion.

Expected Output:
<dialogue
    name="Alice"
    gender="female"
    tone="She spoke in a bright and excited manner, her voice full of enthusiasm."
    emotion="She seemed genuinely happy and eager to engage with everyone."
    delivery="She projected her voice confidently toward the group."
>
    "Hello, everyone! It's great to be here,"
</dialogue>

<dialogue
    name="Bob"
    gender="male"
    tone="He spoke softly, barely above a whisper."
    emotion="He appeared reserved, showing very little emotion in his response."
    delivery="He answered quietly and without much emphasis."
>
    "Hi, Alice,"
</dialogue>


Explanation:

Alice's Dialogue:
-Name: "Alice" (from the text)
-Gender: This name is typically associated with a female character, so we default to gender="female"
-Tone: The text indicates "bright and excited tone". We transform that into a sentence expressing how she sounded.
-Emotion: She is "excited", suggesting positive emotion, so we write a sentence describing her happiness and enthusiasm.
-Delivery: She addressed "everyone", so we can assume she spoke confidently to the group. We write a short sentence for her delivery.
-Wrapped dialogue text: "Hello, everyone! It's great to be here,"

Bob's Dialogue:
-Name: "Bob" (from the text)
-Gender: This name is typically associated with a male character, so we default to gender="male"
-Tone: He responded quietly, so we use a full sentence to reflect that tone.
-Emotion: The text says "showing little emotion", so we describe that in a sentence.
-Delivery: Also "quietly", so we write a sentence capturing the low volume and understated delivery.
-Wrapped dialogue text: "Hi, Alice,"
`
}

export type IChapterResponse = string;


// Extra Words

export const askExtraWords = (content: string, minWordLimit: number) => {
    return `The word amount of the content is not ${minWordLimit} words. Add more ${(minWordLimit - content.length) + 25} words`
}