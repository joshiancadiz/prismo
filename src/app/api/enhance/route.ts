import { NextRequest, NextResponse } from 'next/server';
import { enhanceTranscript } from '@/app/lib/ai_tools/enhance';

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json();

        if (!text || typeof text !== 'string' || !text.trim()) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        const enhancedText = await enhanceTranscript(text);

        return NextResponse.json({ enhancedText });
    } catch (error) {
        console.error('Enhancement error:', error);
        return NextResponse.json(
            { error: 'Failed to enhance text. Please try again.' },
            { status: 500 }
        );
    }
}
