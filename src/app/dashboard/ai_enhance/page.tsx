"use client";

import React, { useState } from 'react';
import { Wand2, Copy, Trash2, ArrowRight } from 'lucide-react';
import { saveHistory } from '@/lib/supabase/updateHistory';
import { createClient } from '@/utils/supabase/client';

export default function AIEnhancePage() {
    const [inputText, setInputText] = useState("");
    const [resultText, setResultText] = useState("");
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleEnhance = async () => {
        if (!inputText.trim()) return;

        setIsEnhancing(true);
        setResultText("");

        try {
            const response = await fetch('/api/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText }),
            });

            const data = await response.json();

            if (!response.ok) {
                setResultText(`Error: ${data.error || 'Something went wrong.'}`);
                return;
            }

            setResultText(data.enhancedText);

            // Save to history
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await saveHistory({
                    userId: user.id,
                    originalText: inputText,
                    processedText: data.enhancedText,
                    action: "enhance",
                });
            }
        } catch (error) {
            setResultText("Error: Failed to connect to the enhancement service.");
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleClear = () => {
        setInputText("");
        setResultText("");
    };

    const handleCopy = () => {
        if (resultText) {
            navigator.clipboard.writeText(resultText);
            // Could add a toast notification here
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto h-full min-h-[calc(100vh-40px)] text-white">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-white">Enhance</h1>
                    </div>
                    <p className="text-gray-400">Transform and refine your content with our intelligent enhancement engine.</p>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px]">
                    {/* Input Side */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <label className="text-sm font-semibold text-white flex items-center gap-2">
                                Input Content
                                <span className="text-[10px] font-normal text-gray-500">Enter text to enhance</span>
                            </label>
                            <button
                                onClick={handleClear}
                                className="text-gray-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                                title="Clear Input"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="relative flex-1 group">
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Paste your script or content here..."
                                className="w-full h-full p-6 bg-white/5 border border-white/10 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none text-white placeholder:text-gray-600"
                            />
                            <div className="absolute bottom-4 right-4">
                                <button
                                    onClick={handleEnhance}
                                    disabled={!inputText.trim() || isEnhancing}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all cursor-pointer ${!inputText.trim() || isEnhancing
                                        ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                                        : 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/5 hover:scale-105 active:scale-95'
                                        }`}
                                >
                                    {isEnhancing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            Enhancing...
                                        </>
                                    ) : (
                                        <>
                                            Enhance <Wand2 className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Output Side */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <label className="text-sm font-semibold text-white flex items-center gap-2">
                                AI Result
                                <span className="text-[10px] font-normal text-gray-500">Refined output</span>
                            </label>
                            {resultText && (
                                <button
                                    onClick={handleCopy}
                                    className="text-gray-400 hover:text-blue-400 transition-colors p-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                >
                                    <Copy className="w-3 h-3" /> Copy
                                </button>
                            )}
                        </div>
                        <div className="relative flex-1">
                            <div
                                className={`w-full h-full p-6 border border-dashed rounded-[20px] overflow-y-auto transition-all ${resultText
                                    ? 'bg-blue-500/5 border-blue-500/20 text-white'
                                    : 'bg-white/5 border-white/10 text-gray-600 flex items-center justify-center'
                                    }`}
                            >
                                {resultText ? (
                                    <div className="whitespace-pre-wrap leading-relaxed animate-in fade-in duration-500">
                                        {resultText}
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 shadow-sm border border-white/5">
                                            <ArrowRight className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <p className="text-xs font-medium text-gray-500">Enhanced content will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 pb-16 text-xs text-gray-500 font-medium text-left">
                    Note: Prismo AI can make mistakes. Please verify important information.
                </div>
            </div>
        </div>
    );
}
