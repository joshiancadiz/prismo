"use client";

import React, { useState } from 'react';
import { Copy, Trash2, ArrowRight, Shuffle } from 'lucide-react';

const TONES = [
    { value: 'Calm', label: 'Calm', description: 'Gentle & reassuring' },
    { value: 'Bold', label: 'Bold', description: 'Confident & direct' },
    { value: 'Urgent', label: 'Urgent', description: 'High-stakes & action-driven' },
    { value: 'Formal', label: 'Formal', description: 'Polished & professional' },
    { value: 'Casual', label: 'Casual', description: 'Relaxed & conversational' },
    { value: 'Persuasive', label: 'Persuasive', description: 'Compelling & convincing' },
    { value: 'Friendly', label: 'Friendly', description: 'Warm & approachable' },
    { value: 'Professional', label: 'Professional', description: 'Authoritative & composed' },
];

export default function AIParaphrasePage() {
    const [inputText, setInputText] = useState("");
    const [resultText, setResultText] = useState("");
    const [isParaphrasing, setIsParaphrasing] = useState(false);
    const [selectedTone, setSelectedTone] = useState("Casual");

    const handleParaphrase = async () => {
        if (!inputText.trim()) return;

        setIsParaphrasing(true);
        setResultText("");

        try {
            const response = await fetch('/api/paraphrase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText, tone: selectedTone }),
            });

            const data = await response.json();

            if (!response.ok) {
                setResultText(`Error: ${data.error || 'Something went wrong.'}`);
                return;
            }

            setResultText(data.paraphrasedText);
        } catch {
            setResultText("Error: Failed to connect to the paraphrase service.");
        } finally {
            setIsParaphrasing(false);
        }
    };

    const handleClear = () => {
        setInputText("");
        setResultText("");
    };

    const handleCopy = () => {
        if (resultText) {
            navigator.clipboard.writeText(resultText);
        }
    };

    return (
        <div className="bg-white rounded-[10px] flex-1 p-8 overflow-y-auto h-full min-h-[calc(100vh-40px)]">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-[12px] bg-violet-500 flex items-center justify-center">
                            <Shuffle className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#101010]">Paraphraser</h1>
                    </div>
                    <p className="text-gray-500">Rewrite your content in any tone with AI-powered paraphrasing.</p>
                </div>

                {/* Tone Selector */}
                <div className="mb-6">
                    <label className="text-sm font-semibold text-[#101010] mb-3 flex items-center gap-2">
                        Tone
                        <span className="text-[10px] font-normal text-gray-400">Select the writing tone</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {TONES.map((tone) => (
                            <button
                                key={tone.value}
                                onClick={() => setSelectedTone(tone.value)}
                                title={tone.description}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                                    selectedTone === tone.value
                                        ? 'bg-[#101010] text-white border-[#101010] shadow-md scale-105'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50'
                                }`}
                            >
                                {tone.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Text Areas */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px]">
                    {/* Input Side */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <label className="text-sm font-semibold text-[#101010] flex items-center gap-2">
                                Input Content
                                <span className="text-[10px] font-normal text-gray-400">Enter text to paraphrase</span>
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
                                placeholder="Paste your text here..."
                                className="w-full h-full p-6 bg-[#f9f9f9] border border-gray-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all resize-none text-[#101010] placeholder:text-gray-400"
                            />
                            <div className="absolute bottom-4 right-4">
                                <button
                                    onClick={handleParaphrase}
                                    disabled={!inputText.trim() || isParaphrasing}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                                        !inputText.trim() || isParaphrasing
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-[#101010] text-white hover:bg-violet-600 shadow-lg shadow-violet-500/20 hover:scale-105 active:scale-95'
                                    }`}
                                >
                                    {isParaphrasing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Paraphrasing...
                                        </>
                                    ) : (
                                        <>
                                            Paraphrase <Shuffle className="w-4 h-4" />
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
                                <span className="text-[10px] font-normal text-gray-400">
                                    {selectedTone ? (
                                        <span className="text-violet-500 font-semibold">{selectedTone} tone</span>
                                    ) : 'Paraphrased output'}
                                </span>
                            </label>
                            {resultText && (
                                <button
                                    onClick={handleCopy}
                                    className="text-gray-400 hover:text-violet-500 transition-colors p-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                                >
                                    <Copy className="w-3 h-3" /> Copy
                                </button>
                            )}
                        </div>
                        <div className="relative flex-1">
                            <div
                                className={`w-full h-full p-6 border border-dashed rounded-[20px] overflow-y-auto transition-all ${
                                    resultText
                                        ? 'bg-gradient-to-br from-violet-50/50 to-purple-50/50 border-violet-100 text-[#101010]'
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
                                        <p className="text-xs font-medium">Paraphrased content will appear here</p>
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
