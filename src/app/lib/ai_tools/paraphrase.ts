import { GoogleGenAI } from '@google/genai';
import { PARAPHRASE_TRANSCRIPT_PROMPT } from '../prompts/prompts';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function paraphraseText(text: string, tone: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Text:\n${text}`,
        config: {
            systemInstruction: PARAPHRASE_TRANSCRIPT_PROMPT(tone),
            temperature: 1,
            topP: 1,
        }
    });

    const result = response.text;

    if (!result) {
        throw new Error("No response from Gemini API");
    }

    return result;
}
