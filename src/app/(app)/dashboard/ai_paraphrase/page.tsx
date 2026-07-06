"use client";

import React, { useState } from 'react';
import { Copy, Trash2, ArrowRight, Shuffle } from 'lucide-react';
import { saveHistory } from '@/lib/supabase/updateHistory';
import { createClient } from '@/utils/supabase/client';

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

            // Save to history
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await saveHistory({
                    userId: user.id,
                    originalText: inputText,
                    processedText: data.paraphrasedText,
                    action: "paraphrase",
                });
            }
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
        <div className="flex-1 p-4 md:p-8 overflow-y-auto h-full text-foreground">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Paraphraser</h1>
                    </div>
                    <p className="text-muted">Rewrite your content in any tone with AI-powered paraphrasing.</p>
                </div>

                {/* Tone Selector */}
                <div className="mb-6">
                    <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        Tone
                        <span className="text-[10px] font-normal text-muted">Select the writing tone</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {TONES.map((tone) => (
                            <button
                                key={tone.value}
                                onClick={() => setSelectedTone(tone.value)}
                                title={tone.description}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border cursor-pointer ${selectedTone === tone.value
                                    ? 'bg-foreground text-background border-foreground shadow-md scale-105'
                                    : 'bg-card text-muted border-border hover:border-violet-500/50 hover:text-violet-400 hover:bg-foreground/5'
                                    }`}
                            >
                                {tone.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Text Areas */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 min-h-[300px] md:min-h-[500px]">
                    {/* Input Side */}
                    <div className="flex flex-col h-full min-h-[250px] md:min-h-0">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                Input Content
                                <span className="text-[10px] font-normal text-muted">Enter text to paraphrase</span>
                            </label>
                            <button
                                onClick={handleClear}
                                className="text-muted hover:text-red-400 transition-colors p-1 cursor-pointer"
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
                                className="w-full h-full p-6 bg-card border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all resize-none text-foreground placeholder:text-muted/50"
                            />
                            <div className="absolute bottom-4 right-4">
                                <button
                                    onClick={handleParaphrase}
                                    disabled={!inputText.trim() || isParaphrasing}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all cursor-pointer ${!inputText.trim() || isParaphrasing
                                        ? 'bg-foreground/5 text-muted cursor-not-allowed border border-border'
                                        : 'bg-foreground text-background hover:opacity-90 shadow-lg shadow-foreground/5 hover:scale-105 active:scale-95'
                                        }`}
                                >
                                    {isParaphrasing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
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
                    <div className="flex flex-col h-full min-h-[250px] md:min-h-0">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                AI Result
                                <span className="text-[10px] font-normal text-muted">
                                    {selectedTone ? (
                                        <span className="text-violet-400 font-semibold">{selectedTone} tone</span>
                                    ) : 'Paraphrased output'}
                                </span>
                            </label>
                            {resultText && (
                                <button
                                    onClick={handleCopy}
                                    className="text-muted hover:text-violet-400 transition-colors p-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                >
                                    <Copy className="w-3 h-3" /> Copy
                                </button>
                            )}
                        </div>
                        <div className="relative flex-1">
                            <div
                                className={`w-full h-full p-6 border border-dashed rounded-[20px] overflow-y-auto transition-all ${resultText
                                    ? 'bg-violet-500/5 border-violet-500/20 text-foreground'
                                    : 'bg-card border-border text-muted flex items-center justify-center'
                                    }`}
                            >
                                {resultText ? (
                                    <div className="whitespace-pre-wrap leading-relaxed animate-in fade-in duration-500">
                                        {resultText}
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4 shadow-sm border border-border">
                                            <ArrowRight className="w-6 h-6 text-muted/50" />
                                        </div>
                                        <p className="text-xs font-medium text-muted">Paraphrased content will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 pb-16 text-xs text-muted font-medium text-left">
                    Note: Prismo AI can make mistakes. Please verify important information.
                </div>
            </div>
        </div>
    );

}
