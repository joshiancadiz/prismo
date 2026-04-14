import { NextRequest, NextResponse } from 'next/server';
import { paraphraseText } from '@/app/lib/ai_tools/paraphrase';

export async function POST(request: NextRequest) {
    try {
        const { text, tone } = await request.json();

        if (!text || typeof text !== 'string' || !text.trim()) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        if (!tone || typeof tone !== 'string') {
            return NextResponse.json(
                { error: 'Tone is required' },
                { status: 400 }
            );
        }

        const paraphrasedText = await paraphraseText(text, tone);

        return NextResponse.json({ paraphrasedText });
    } catch (error) {
        console.error('Paraphrase error:', error);
        return NextResponse.json(
            { error: 'Failed to paraphrase text. Please try again.' },
            { status: 500 }
        );
    }
}
