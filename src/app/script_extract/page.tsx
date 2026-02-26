"use client";

import React, { useState } from 'react';
import { Play, Info, CheckCircle2, AlertCircle, Link as LinkIcon, Instagram, Youtube, Clapperboard } from 'lucide-react';
import { extractYoutubeId } from '@/app/lib/youtube/parse';

export default function ScriptExtractPage() {
    const [videoUrl, setVideoUrl] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [videoData, setVideoData] = useState<any>(null);

    const handleProcessUrl = async () => {
        setError(null);
        setVideoData(null);
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

            console.log('Video processed successfully:', data);
            setVideoData(data);
        } catch (err) {
            console.error('Error calling API:', err);
            setError('Failed to connect to the server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="bg-white rounded-[10px] flex-1 p-8 overflow-y-auto h-full">
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-[#101010]">Video Script Extractor</h1>
                        <p className="text-gray-500 mt-2">Extract precise text, captions, and insights from Youtube videos, shorts, and Tiktok reels .</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="p-2 bg-pink-50 rounded-lg"><Instagram className="w-5 h-5 text-pink-500" /></div>
                        <div className="p-2 bg-red-50 rounded-lg"><Youtube className="w-5 h-5 text-red-500" /></div>
                        <div className="p-2 bg-slate-50 rounded-lg"><Clapperboard className="w-5 h-5 text-slate-800" /></div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-[10px] flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                        <button onClick={() => setError(null)} className="ml-auto text-xs font-semibold hover:underline cursor-pointer">Dismiss</button>
                    </div>
                )}

                <div className="max-w-lg space-y-6">
                    {/* URL Input */}
                    <div className="bg-[#f9f9f9] p-6 rounded-[15px] border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-400">
                            <LinkIcon className="w-5 h-5 text-blue-500" />
                            Paste Video URL
                        </h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 p-3 bg-white border border-gray-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-400"
                                placeholder="https://www.youtube.com/shorts/..."
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleProcessUrl()}
                            />
                            <button
                                onClick={handleProcessUrl}
                                disabled={isLoading}
                                className={`px-6 py-2 bg-[#101010] text-white text-sm font-medium rounded-[10px] hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Process URL"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                                {isLoading ? 'Processing...' : 'Process'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-3">Supports Youtube Vidoes, YouTube Shorts, and Tiktok Reels.</p>
                    </div>

                    {/* Extraction Tips */}

                    <div className="bg-purple-50 p-6 rounded-[15px] border border-purple-100">
                        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-purple-800">
                            <Info className="w-5 h-5" />
                            Extraction Tips
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-xs text-purple-700">
                                <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                Video duration must not exceed 10 minutes.
                            </li>
                            <li className="flex items-start gap-2 text-xs text-purple-700">
                                <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                Clear background music helps increase transcription accuracy.
                            </li>
                            <li className="flex items-start gap-2 text-xs text-purple-700">
                                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                Processing may take 1-2x the duration of the video.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
