import { NextRequest, NextResponse } from 'next/server';
import { extractYoutubeId } from '@/app/lib/youtube/parse';
import { fetchYouTubeMetadata } from '@/app/lib/youtube/metadata';
import { validateVideo } from '@/app/lib/youtube/validation';
import { fetchTranscript } from '@/app/lib/youtube/transcript';

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const videoId = extractYoutubeId(url);
        if (!videoId) {
            return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
        }

        // The validateVideo function internally calls fetchYouTubeMetadata
        // and throws if validation fails.
        try {
            await validateVideo(videoId, {
                maxDurationSec: 600,
                minDurationSec: 10,
                allowShorts: true
            });

            // If validation passes, we still want the metadata for the response
            const metadata = await fetchYouTubeMetadata(videoId);

            // Fetch and print the transcript
            const transcript = await fetchTranscript(videoId);
            if (transcript) {
                console.log("--- TRANSCRIPT START ---");
                console.log(transcript);
                console.log("--- TRANSCRIPT END ---");
            } else {
                console.log(`No transcript available for video: ${videoId}`);
            }

            return NextResponse.json({
                videoId,
                metadata,
                hasTranscript: !!transcript,
                transcript
            });
        } catch (validationError: any) {
            return NextResponse.json({ error: validationError.message }, { status: 422 });
        }

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
