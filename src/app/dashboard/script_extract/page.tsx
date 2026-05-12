"use client";

import React, { useState } from 'react';
import { Play, Info, CheckCircle2, AlertCircle, Link as LinkIcon, Instagram, Youtube, Clapperboard, Copy, Clock, Check, X } from 'lucide-react';
// import { extractYoutubeId } from '@/app/lib/youtube/parse';
import { saveHistory } from '@/lib/supabase/updateHistory';
import { createClient } from '@/utils/supabase/client';

export default function ScriptExtractPage({ params }: { params: Promise<{}> }) {
    const [videoUrl, setVideoUrl] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [videoData, setVideoData] = useState<any | null>(null);
    const [showTimestamps, setShowTimestamps] = useState(true);
    const [copied, setCopied] = useState(false);

    const handleProcessUrl = async () => {
        setError(null);
        setVideoData(null);
        setCopied(false);
        const url = videoUrl.trim();

        if (!url) {
            setError('Please enter a YouTube URL.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/youtube', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'An error occurred while processing the video.');
                return;
            }

            if (!data.hasTranscript || !data.transcript) {
                setError('Scripts cannot be extracted from this video. It may be an official music video or lack available captions.');
                return;
            }

            console.log('Video processed successfully:', data);
            setVideoData(data);

            // Save to history
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user && data.transcript) {
                const pureText = data.transcript.map((item: { text: string }) => item.text).join('\n');
                await saveHistory({
                    userId: user.id,
                    originalText: url,
                    processedText: pureText,
                    action: "extract",
                });
            }
        } catch (err) {
            console.error('Error calling API:', err);
            setError('Failed to connect to the server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!videoData?.transcript) return;

        const textToCopy = videoData.transcript.map((item: { timestamp: string; text: string }) =>
            showTimestamps ? `[${item.timestamp}] ${item.text}` : item.text
        ).join('\n');

        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    return (
        <div className="flex-1 p-8 overflow-y-auto h-full text-white">
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Script Extractor</h1>
                        <p className="text-gray-400 mt-2">Extract precise text, captions, and insights from Youtube videos and shorts.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="p-2 bg-red-500/10 rounded-lg"><Youtube className="w-5 h-5 text-red-500" /></div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-[10px] flex items-center gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                        <button onClick={() => setError(null)} className="ml-auto text-xs font-semibold hover:underline cursor-pointer">Dismiss</button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8 items-start h-full">
                    {/* Inputs Left Side */}
                    <div className={`space-y-6 w-full ${videoData?.transcript ? 'lg:max-w-[400px] xl:max-w-[480px] shrink-0' : 'max-w-lg'}`}>
                        {/* URL Input */}
                        <div className="bg-white/5 p-6 rounded-[15px] border border-white/5">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-300">
                                <LinkIcon className="w-5 h-5 text-blue-400" />
                                Paste Video URL
                            </h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 p-3 bg-white/5 border border-white/10 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-gray-500"
                                    placeholder="https://www.youtube.com/shorts/..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleProcessUrl()}
                                />
                                <button
                                    onClick={handleProcessUrl}
                                    disabled={isLoading}
                                    className={`px-6 py-2 bg-white text-black text-sm font-medium rounded-[10px] hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title="Process URL"
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <Play className="w-4 h-4" />
                                    )}
                                    {isLoading ? 'Processing...' : 'Process'}
                                </button>
                                <button
                                    onClick={() => {
                                        setVideoUrl('');
                                        setError(null);
                                    }}
                                    className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-[10px] hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
                                    title="Clear Input"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Extraction Tips */}
                        <div className="bg-purple-500/10 p-6 rounded-[15px] border border-purple-500/20">
                            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-purple-300">
                                <Info className="w-5 h-5" />
                                Extraction Rules
                            </h2>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-xs text-purple-200/70">
                                    <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    Duration must not exceed 10 minutes.
                                </li>
                                <li className="flex items-start gap-2 text-xs text-purple-200/70">
                                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    Videos without available transcripts or due to copyright protection cannot be extracted.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Transcript Right Side */}
                    {videoData?.transcript && (
                        <div className="flex-1 bg-white/5 p-6 rounded-[15px] border border-white/5 w-full flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
                            <div className="flex justify-between items-center mb-6 shrink-0">
                                <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                                    Transcript
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowTimestamps(!showTimestamps)}
                                        className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-medium rounded-[8px] hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                                    >
                                        <Clock className="w-3.5 h-3.5" />
                                        {showTimestamps ? 'Hide Times' : 'Show Times'}
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium rounded-[8px] hover:bg-blue-500/20 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copied ? 'Copied!' : 'Copy All'}
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-y-auto space-y-4 pr-4 custom-scrollbar flex-1 pb-4">
                                {videoData.transcript.map((item: { timestamp: string; text: string }, i: number) => (
                                    <div key={i} className="flex gap-4 items-start group">
                                        {showTimestamps && (
                                            <span className="text-[10px] font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded-[6px] w-20 shrink-0 text-center border border-blue-400/20">
                                                {item.timestamp}
                                            </span>
                                        )}
                                        <p className="text-xs text-gray-300 leading-relaxed pt-0.5 group-hover:text-white transition-colors">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-4 pb-16 text-xs text-gray-500 font-medium text-left">
                    Note: Prismo AI can make mistakes. Please verify important information.
                </div>
            </div>
        </div>
    );
}
