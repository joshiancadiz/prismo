import Groq from 'groq-sdk';
import { TRANSLATE_TEXT_PROMPT } from '../prompts/prompts';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function translateText(text: string, fromLanguage: string, toLanguage: string): Promise<string> {
    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'system',
                content: TRANSLATE_TEXT_PROMPT(fromLanguage, toLanguage),
            },
            {
                role: 'user',
                content: `Text:\n${text}`,
            },
        ],
        temperature: 0.3,
        top_p: 1,
    });

    const result = response.choices[0]?.message?.content;

    if (!result) {
        throw new Error('No response from Groq API');
    }

    return result;
}
