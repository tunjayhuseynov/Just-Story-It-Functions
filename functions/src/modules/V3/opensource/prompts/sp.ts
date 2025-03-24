import { LanguageName } from '../../../../types/inputs';
import { NarrationStyleEs } from '../../../../types/narrationStyles';
import { TInputGeneral, TInputPerChapter } from '.';
import { LanguageLevelEs } from '../../../../types/languages';


// Prompt for System

export const promptForSystem = `Eres una aplicación que produce historias de ficción basadas en las entradas del usuario.

Existen 6 tipos de entrada:
a. Entradas con los nombres y personalidades de los personajes que la historia debe incluir.
b. Entradas que describen los entornos y lugares que la historia debe incluir.
c. Entradas que describen los géneros de la historia.
d. Entrada opcional que describe cómo se supone que debe ser la historia.
f. Entrada que te indica en qué estilo de narración debes escribir la historia`



export const promptForUserInputsAndChapters = ({ characters, environments, genres, customDescription, chapterAmount, narrationStyle, storyLangauge }: TInputGeneral) => {
    return `Aquí está la lista de entradas:
a:
${characters.map((v, i) => `${i + 1}. Nombre del personaje: ${v.name}, Descripción del personaje: ${v.description}`)}

b:
${environments.map((v, i) => `${i + 1}. Nombre del entorno: ${v.name}, Descripción del entorno: ${v.description}`)}

c: Los géneros de la historia deben ser ${genres.join(", ")}

d: ${customDescription ?? "No hay una entrada opcional que describa cómo debe ser la historia, puedes ser completamente creativo"}

f: El estilo de narración que debes usar es ${narrationStyle}. La explicación de este estilo: ${NarrationStyleEs[narrationStyle]}

Necesito que me des ${chapterAmount} títulos de capítulo para una historia basada en estas entradas.

Tu respuesta debe estar siempre en el idioma ${LanguageName[storyLangauge]}.

Tu respuesta siempre debe ser solo JSON con la siguiente estructura de ejemplo:
{
"chapters": [{{títulos de los capítulos}}],
"title": {{título}},
"coverImagePrompt": {{coverImagePrompt}}
}`;
}


export const promptForEachChapter = ({ language, chapterName, wordAmount, narrationStyle }: TInputPerChapter) => {
    return `Escribe ${wordAmount} palabras de ${chapterName}.

Tu respuesta debe ser siempre únicamente la historia en sí.

Regla 1: La nueva línea tiene que ser una secuencia de escape
Regla 2: La historia debe tener el nivel de vocabulario de ${LanguageLevelEs[language.level]} y el idioma debe ser ${LanguageName[language.code]}
Regla 3: El estilo de narración de la historia debe ser ${narrationStyle}.
Regla 4: Debes usar los diálogos de los personajes si el estilo de narración lo permite`;
}

export type IChapterResponse = string;


// Extra Words

export const askExtraWords = (content: string, minWordLimit: number) => {
    return `La cantidad de palabras del contenido no es ${minWordLimit}. Agrega ${(minWordLimit - content.length) + 25} palabras más`;
};


export const promptForDialogueSystem = () => {
    throw new Error("Missing language")
}