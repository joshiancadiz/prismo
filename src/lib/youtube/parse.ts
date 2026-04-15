/**
 * Extracts the 11-character YouTube video ID from various URL formats.
 * Supports:
 * - Standard: youtube.com/watch?v=VIDEO_ID
 * - Shortened: youtu.be/VIDEO_ID
 * - Shorts: youtube.com/shorts/VIDEO_ID
 * - Embed: youtube.com/embed/VIDEO_ID
 * 
 * @param url The YouTube URL to parse.
 * @returns The 11-character video ID or null if not found.
 */
export const extractYoutubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
};
