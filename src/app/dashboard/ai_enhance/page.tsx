"use client";

import React, { useState } from 'react';
import { Sparkles, Wand2, Copy, Trash2, ArrowRight } from 'lucide-react';

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
        <div className="bg-white rounded-[10px] flex-1 p-8 overflow-y-auto h-full min-h-[calc(100vh-40px)]">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-[12px] bg-blue-500 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#101010]">Text Enhance</h1>
                    </div>
                    <p className="text-gray-500">Transform and refine your content with our intelligent enhancement engine.</p>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px]">
                    {/* Input Side */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <label className="text-sm font-semibold text-[#101010] flex items-center gap-2">
                                Input Content
                                <span className="text-[10px] font-normal text-gray-400">Enter text to enhance</span>
                            </label>
                            <button
                                onClick={handleClear}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
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
                                className="w-full h-full p-6 bg-[#f9f9f9] border border-gray-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none text-[#101010] placeholder:text-gray-400"
                            />
                            <div className="absolute bottom-4 right-4">
                                <button
                                    onClick={handleEnhance}
                                    disabled={!inputText.trim() || isEnhancing}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all ${!inputText.trim() || isEnhancing
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-[#101010] text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95'
                                        }`}
                                >
                                    {isEnhancing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                            <label className="text-sm font-semibold text-[#101010] flex items-center gap-2">
                                AI Result
                                <span className="text-[10px] font-normal text-gray-400">Refined output</span>
                            </label>
                            {resultText && (
                                <button
                                    onClick={handleCopy}
                                    className="text-gray-400 hover:text-blue-500 transition-colors p-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                                >
                                    <Copy className="w-3 h-3" /> Copy
                                </button>
                            )}
                        </div>
                        <div className="relative flex-1">
                            <div
                                className={`w-full h-full p-6 border border-dashed rounded-[20px] overflow-y-auto transition-all ${resultText
                                        ? 'bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-blue-100 text-[#101010]'
                                        : 'bg-gray-50 border-gray-200 text-gray-400 flex items-center justify-center'
                                    }`}
                            >
                                {resultText ? (
                                    <div className="whitespace-pre-wrap leading-relaxed animate-in fade-in duration-500">
                                        {resultText}
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                                            <ArrowRight className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <p className="text-xs font-medium">Enhanced content will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
