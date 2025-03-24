import { GenerateStoryFromText } from "../modules/V3/opensource";

const { coverImagePrompt, story, title, storyArray, dialogueArray } = await GenerateStoryFromText({
    characters: [
      {
        id: "1",
        name: "John",
        description: "A kind-hearted, curious man in his late 20s who works as a freelance photographer.",
        image: ""
      },
      {
        id: "2",
        name: "Jane",
        description: "A thoughtful, creative woman in her mid-20s who dreams of becoming a novelist.",
        image: ""
      }
    ],
    environments: [
      {
        id: "1",
        name: "Modern City",
        description: "A lively urban setting with coffee shops, bookstores, and hidden alleyways full of charm.",
        image: ""
      }
    ],
    language: "en-US",
    languageLevel: "Intermadiate",
    genres: ["Romance", "Drama", "Twist"],
    isCoverImagePromptNeeded: false,
    narrationStyle: "Traditional",
    customStoryDescriptor: "A romantic story about two strangers who meet by chance in a city and fall in love, but a shocking secret changes everything.",
    minimumWordCount: 600,
    aiModel: "microsoft/wizardlm-2-8x22b",
    referanceStory: null
  });
  

console.log(coverImagePrompt)
console.log(story)
console.log(title)
console.log(storyArray)
console.log(dialogueArray)



const narrationStyle = `Affect: A gentle, curious narrator with a British accent, guiding a magical, child-friendly adventure through a fairy tale world.

Tone: Magical, warm, and inviting, creating a sense of wonder and excitement for young listeners.

Pacing: Steady and measured, with slight pauses to emphasize magical moments and maintain the storytelling flow.

Emotion: Wonder, curiosity, and a sense of adventure, with a lighthearted and positive vibe throughout.

Pronunciation: Clear and precise, with an emphasis on storytelling, ensuring the words are easy to follow and enchanting to listen to.`