export interface TranscriptItem {
    timestamp: string;
    text: string;
}

export interface TranscriptOptions {
    lang?: string;        // Language code, default 'en'
}

/**
 * Fetches the transcript of a YouTube video using ytscribe API.
 * Returns parsed transcript items (timestamp + text) or null if unavailable.
 */
export async function fetchTranscript(
    videoId: string,
    options?: TranscriptOptions
): Promise<TranscriptItem[] | null> {
    if (!videoId || videoId.length !== 11) {
        throw new Error("Invalid video ID");
    }

    const apiKey = process.env.YT_TRANSCRIPT_API;
    
    if (!apiKey) {
        console.error("YT_TRANSCRIPT_API is missing in environment variables");
        return null;
    }

    try {
        const response = await fetch('https://ytscribe.ai/api/transcripts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: `https://youtube.com/watch?v=${videoId}`
            }),
        });

        if (!response.ok) {
            console.error(`YT-Transcript API Error: ${response.status} ${response.statusText}`);
            return null;
        }

        const responseData = await response.json();
        
        // ytscribe returns the array inside `data.segments`
        if (!responseData || !responseData.data || !Array.isArray(responseData.data.segments)) {
            console.error("Invalid response from transcript API");
            return null;
        }

        const rawTranscript: any[] = responseData.data.segments;
        const transcript: TranscriptItem[] = [];

        // Helper to format seconds (e.g. 65.5) into MM:SS.mmm (01:05.500) or HH:MM:SS.mmm
        const formatTime = (seconds: number) => {
            const date = new Date(Math.floor(seconds * 1000));
            const h = date.getUTCHours().toString().padStart(2, '0');
            const m = date.getUTCMinutes().toString().padStart(2, '0');
            const s = date.getUTCSeconds().toString().padStart(2, '0');
            const ms = date.getUTCMilliseconds().toString().padStart(3, '0');
            return h === '00' ? `${m}:${s}.${ms}` : `${h}:${m}:${s}.${ms}`;
        };

        for (const item of rawTranscript) {
            // Segments have `start`, `end`, `text`
            const timestamp = item.start !== undefined ? formatTime(item.start) : '';
            const rawText = item.text || '';
            const text = rawText.replace(/\s+/g, ' ').trim();

            if (!text) continue;

            if (transcript.length > 0) {
                const lastIdx = transcript.length - 1;
                const lastText = transcript[lastIdx].text;

                if (lastText === text) {
                    continue;
                }

                // For word-by-word rolling captions where sentence builds up
                if (text.startsWith(lastText)) {
                    transcript[lastIdx].text = text;
                    continue;
                }

                // For line-by-line scrolling, find overlapping words
                const lastWords = lastText.split(' ');
                const currentWords = text.split(' ');
                
                let overlapWords = 0;
                const maxOverlap = Math.min(lastWords.length, currentWords.length);
                
                for (let i = maxOverlap; i > 0; i--) {
                    if (lastWords.slice(-i).join(' ') === currentWords.slice(0, i).join(' ')) {
                        overlapWords = i;
                        break;
                    }
                }

                if (overlapWords > 0) {
                    const remainingWords = currentWords.slice(overlapWords);
                    if (remainingWords.length > 0) {
                        transcript.push({ timestamp, text: remainingWords.join(' ') });
                    }
                    continue;
                }
            }
            
            transcript.push({ timestamp, text });
        }

        return transcript.length > 0 ? transcript : null;
    } catch (err) {
        console.error("YT-Transcript Fetch Error:", err);
        return null;
    }
}