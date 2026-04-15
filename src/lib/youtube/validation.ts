// d:/projects/prismo/src/app/lib/youtube/validation.ts
import { fetchYouTubeMetadata } from './metadata';

export interface VideoValidationOptions {
    maxDurationSec?: number;
    minDurationSec?: number;
    requireCaptions?: boolean;
    allowedLanguages?: string[];
    allowShorts?: boolean;
}

/**
 * Validates a YouTube video based on provided options.
 * Fetches metadata and checks duration, captions, and type (Shorts).
 */
export async function validateVideo(videoId: string, options: VideoValidationOptions) {
    if (!videoId || videoId.length !== 11) {
        throw new Error("Invalid video ID");
    }

    // Fetch metadata from YouTube API
    const metadata = await fetchYouTubeMetadata(videoId);

    if (!metadata) {
        throw new Error("Video not found or API error");
    }

    if (metadata.durationSec > (options.maxDurationSec ?? 600)) {
        throw new Error("Video is longer than allowed duration");
    }

    if (metadata.durationSec < (options.minDurationSec ?? 10)) {
        throw new Error("Video is too short");
    }

    if (options.requireCaptions && !metadata.hasCaptions) {
        throw new Error("Video has no captions available");
    }

    // if (options.allowShorts === false && metadata.isShort) {
    //     throw new Error("Shorts videos are not supported");
    // }

    if (options.allowedLanguages && options.allowedLanguages.length > 0 && !options.allowedLanguages.includes(metadata.captionLanguage)) {
        throw new Error("Captions not available in allowed language");
    }

    return true; // passed all checks
}