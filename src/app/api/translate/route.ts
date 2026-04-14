import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/app/lib/ai_tools/translate';

export async function POST(request: NextRequest) {
    try {
        const { text, fromLanguage, toLanguage } = await request.json();

        if (!text || typeof text !== 'string' || !text.trim()) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        if (!toLanguage || typeof toLanguage !== 'string') {
            return NextResponse.json(
                { error: 'Target language is required' },
                { status: 400 }
            );
        }

        const translatedText = await translateText(text, fromLanguage || 'auto', toLanguage);

        return NextResponse.json({ translatedText });
    } catch (error) {
        console.error('Translate error:', error);
        return NextResponse.json(
            { error: 'Failed to translate text. Please try again.' },
            { status: 500 }
        );
    }
}
