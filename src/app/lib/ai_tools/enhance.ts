import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function enhanceTranscript(transcript: string): Promise<string> {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `You are a professional transcript editor.
Your job is to enhance the following YouTube video transcript by:
- Removing filler words (um, uh, like, you know, basically, right)
- Fixing grammar and punctuation errors
- Improving sentence clarity and readability
- Breaking into proper paragraphs where needed
- Keeping the original meaning and tone intact
- Do NOT add new information or change the topic

Only return the enhanced transcript, nothing else.

Transcript:
${transcript}`
            }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
    });

    const result = chatCompletion.choices[0]?.message?.content;

    if (!result) {
        throw new Error("No response from Groq API");
    }

    return result;
}
