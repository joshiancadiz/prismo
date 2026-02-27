// d:/projects/prismo/src/app/lib/youtube/transcript.ts
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export interface TranscriptItem {
    timestamp: string;
    text: string;
}

export interface TranscriptOptions {
    lang?: string;        // Language code, default 'en'
    tmpDir?: string;      // Temporary folder for VTT files
    ytDlpPath?: string;   // Full path to yt-dlp executable
}

/**
 * Fetches the auto-generated transcript of a YouTube video using yt-dlp.
 * Returns parsed transcript items (timestamp + text) or null if unavailable.
 */
export async function fetchTranscript(
    videoId: string,
    options?: TranscriptOptions
): Promise<TranscriptItem[] | null> {
    if (!videoId || videoId.length !== 11) {
        throw new Error("Invalid video ID");
    }

    const lang = options?.lang ?? "en";
    const tmpDir = options?.tmpDir ?? path.join(process.cwd(), "tmp");

    // Check options, then environment variable, then fallback to local Windows path
    const ytDlpPath = options?.ytDlpPath ?? process.env.YT_DLP_PATH;
    console.log("YouTube Transcript Debug - Loaded environment keys:", Object.keys(process.env).filter(k => k.includes('YT') || k.includes('DLP')));

    if (!ytDlpPath) {
        console.error("YT_DLP_PATH is missing in environment variables");
        return null;
    }

    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const outputPath = path.join(tmpDir, `${videoId}.%(ext)s`);

    const command = `"${ytDlpPath}" --write-auto-sub --sub-lang ${lang} --sub-format vtt --skip-download -o "${outputPath}" https://www.youtube.com/watch?v=${videoId}`;

    try {
        await execAsync(command);

        const vttFile = path.join(tmpDir, `${videoId}.${lang}.vtt`);
        if (!fs.existsSync(vttFile)) {
            console.error(`Expected transcript file not found: ${vttFile}`);
            return null;
        }

        const vttContent = fs.readFileSync(vttFile, "utf-8");

        const blocks = vttContent.split(/\n\s*\n/);
        const transcript: TranscriptItem[] = [];

        for (const block of blocks) {
            const lines = block.trim().split('\n');
            let timestamp = '';
            let textLines = [];

            for (const line of lines) {
                if (line.includes('-->')) {
                    // Extract start time, optionally strip hours if 00
                    const rawTime = line.split(' --> ')[0].trim();
                    timestamp = rawTime.startsWith('00:') ? rawTime.substring(3, 12) : rawTime.substring(0, 12);
                } else if (line !== 'WEBVTT' && line.trim() && !line.includes('Kind: captions') && !line.includes('Language:')) {
                    // Remove VTT styling tags like <c>
                    textLines.push(line.replace(/<[^>]+>/g, '').trim());
                }
            }

            if (timestamp && textLines.length > 0) {
                const text = textLines.join(' ');
                // Simple deduplication for rolling captions
                if (transcript.length === 0 || transcript[transcript.length - 1].text !== text) {
                    transcript.push({ timestamp, text });
                }
            }
        }

        // Clean up temporary file
        fs.unlinkSync(vttFile);

        return transcript.length > 0 ? transcript : null;
    } catch (err) {
        console.error("YT-DLP Transcript Error:", err);
        return null;
    }
}