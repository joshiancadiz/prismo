import { YoutubeTranscript } from 'youtube-transcript';

/**
 * Fetches the transcript for a given YouTube video ID.
 * @param videoId The 11-character YouTube video ID.
 * @returns The full transcript text or null if not available.
 */
export async function fetchTranscript(videoId: string): Promise<string | null> {
    try {
        console.log(`Fetching transcript for video: ${videoId}`);
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

        if (!transcriptItems || transcriptItems.length === 0) {
            console.log("No transcript items found.");
            return null;
        }

        // Combine all transcript parts into a single string
        const fullText = transcriptItems
            .map(item => item.text)
            .join(' ')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");

        return fullText;
    } catch (error) {
        console.error("Error fetching YouTube transcript:", error);
        return null;
    }
}
