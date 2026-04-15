// d:/projects/prismo/src/app/lib/youtube/metadata.ts

export interface YouTubeMetadata {
    videoId: string;
    title: string;
    durationSec: number;
    hasCaptions: boolean;
    isShort: boolean;
    captionLanguage: string;
}

/**
 * Fetches metadata for a YouTube video using the Data API v3.
 * Requires YOUTUBE_API key in environment.
 */
export async function fetchYouTubeMetadata(videoId: string): Promise<YouTubeMetadata | null> {
    const apiKey = process.env.YOUTUBE_API;
    console.log("YouTube API Debug - Loaded environment keys:", Object.keys(process.env).filter(k => k.includes('YOUTUBE') || k.includes('API')));

    if (!apiKey) {

        console.error("YOUTUBE_API key is missing in environment variables");
        return null;
    }

    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`YouTube API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            console.log("YouTube API Debug - No items found in response");
            return null;
        }

        const item = data.items[0];
        const duration = item.contentDetails.duration; // ISO 8601 format PT#M#S
        const durationSec = parseISO8601Duration(duration);

        const metadata = {
            videoId,
            title: item.snippet.title,
            durationSec,
            hasCaptions: item.contentDetails.caption === 'true',
            isShort: durationSec <= 60, // Basic proxy for shorts
            captionLanguage: item.snippet.defaultAudioLanguage || item.snippet.defaultLanguage || 'unknown',
        };

        return metadata;
    } catch (error) {
        console.error("YouTube API Debug - Error fetching YouTube metadata:", error);
        return null;
    }
}


/**
 * Parses an ISO 8601 duration string (e.g., PT3M15S) into total seconds.
 */
function parseISO8601Duration(duration: string): number {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);

    if (!matches) return 0;

    const hours = parseInt(matches[1] || '0');
    const minutes = parseInt(matches[2] || '0');
    const seconds = parseInt(matches[3] || '0');

    return (hours * 3600) + (minutes * 60) + seconds;
}
