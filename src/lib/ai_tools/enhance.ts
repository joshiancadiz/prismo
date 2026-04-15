import { GoogleGenAI } from '@google/genai';
import { ENHANCE_TRANSCRIPT_PROMPT } from '../prompts/prompts';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function enhanceTranscript(transcript: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: `Transcript:\n${transcript}`,
        config: {
            systemInstruction: ENHANCE_TRANSCRIPT_PROMPT,
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
