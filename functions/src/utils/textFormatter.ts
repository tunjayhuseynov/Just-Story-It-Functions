

export const ParagraphSplitter = (text: string, limit: number) => {
    const CHARACTER_LIMIT = limit
    const textArray: string[] = []
    const sentences = text.split(".")
    let textElement = "";
    let index = 0;
    while (index < sentences.length) {
        const s = sentences[index]
        if (s.length + textElement.length < CHARACTER_LIMIT) {
            textElement += s + ".";
            index++

            if (index == sentences.length) reset()
        } else {
            reset()
        }
    }

    function reset() {
        textArray.push(textElement)
        textElement = ""
    }

    return textArray;
}

export function Breaker(text: string) {
    const split = text.split("\n")
    return split.filter(s=>s.length > 0).map(function(text) {
        return text + ` <break time="1.33s"/>`;
    }).join("\n")
}