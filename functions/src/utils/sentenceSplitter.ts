

export const SentenceSplitter = (text: string, limit: number) => {
    const CHARACTER_LIMIT = limit
    const textArray: string[] = []
    const sentences = text.split(".")
    let character_count = 0;
    let textElement = "";
    let index = 0;
    while (index < sentences.length) {
        const s = sentences[index]
        if (s.length + character_count + 1 < CHARACTER_LIMIT) {
            textElement += s + ".";
            character_count += s.length + 1
            index++

            if (index == sentences.length) reset()
        } else {
            reset()
        }
    }

    function reset() {
        textArray.push(textElement)
        textElement = ""
        character_count = 0;
    }

    return textArray;
}