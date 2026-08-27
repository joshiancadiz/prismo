"use client";

import { mutate } from 'swr';
import React, { useState, useEffect } from 'react';
import { Wand2, Copy, Trash2, ArrowRight } from 'lucide-react';
import { saveHistory } from '@/lib/supabase/updateHistory';
import { createClient } from '@/utils/supabase/client';

export default function AIEnhancePage() {
    const [inputText, setInputText] = useState("");
    const [resultText, setResultText] = useState("");
    const [isEnhancing, setIsEnhancing] = useState(false);

    useEffect(() => {
        const saved = sessionStorage.getItem('prismo_draft_ai_enhance_input_text');
        if (saved) {
            setInputText(saved);
        }
        const savedResult = sessionStorage.getItem('prismo_draft_ai_enhance_result_text');
        if (savedResult) {
            setResultText(savedResult);
        }
    }, []);

    const handleEnhance = async () => {
        if (!inputText.trim()) return;

        setIsEnhancing(true);
        setResultText("");
        sessionStorage.removeItem('prismo_draft_ai_enhance_result_text');

        try {
            const response = await fetch('/api/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errMsg = `Error: ${data.error || 'Something went wrong.'}`;
                setResultText(errMsg);
                sessionStorage.setItem('prismo_draft_ai_enhance_result_text', errMsg);
                return;
            }

            setResultText(data.enhancedText);
            sessionStorage.setItem('prismo_draft_ai_enhance_result_text', data.enhancedText);

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
                mutate('history');
            }
        } catch (error) {
            const errMsg = "Error: Failed to connect to the enhancement service.";
            setResultText(errMsg);
            sessionStorage.setItem('prismo_draft_ai_enhance_result_text', errMsg);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleClear = () => {
        setInputText("");
        sessionStorage.removeItem('prismo_draft_ai_enhance_input_text');
        setResultText("");
        sessionStorage.removeItem('prismo_draft_ai_enhance_result_text');
    };

    const handleCopy = () => {
        if (resultText) {
            navigator.clipboard.writeText(resultText);
            // Could add a toast notification here
        }
    };

    return (
        <div className="flex-1 p-4 md:p-8 pb-16 md:pb-20 overflow-y-auto h-full text-foreground">
            <div className="max-w-7xl">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Enhance</h1>
                    </div>
                    <p className="text-muted">Transform and refine your content with our intelligent enhancement engine.</p>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 min-h-[300px] md:min-h-[500px]">
                    {/* Input Side */}
                    <div className="flex flex-col h-full min-h-[250px] md:min-h-0">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                Input Content
                                <span className="text-[10px] font-normal text-muted">Enter text to enhance</span>
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
                                onChange={(e) => {
                                    setInputText(e.target.value);
                                    sessionStorage.setItem('prismo_draft_ai_enhance_input_text', e.target.value);
                                }}
                                placeholder="Paste your script or content here..."
                                className="w-full h-full p-6 bg-card border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none text-foreground placeholder:text-muted/50"
                            />
                            <div className="absolute bottom-4 right-4">
                                <button
                                    onClick={handleEnhance}
                                    disabled={!inputText.trim() || isEnhancing}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all cursor-pointer ${!inputText.trim() || isEnhancing
                                        ? 'bg-foreground/5 text-muted cursor-not-allowed border border-border'
                                        : 'bg-foreground text-background hover:opacity-90 shadow-lg shadow-foreground/5 hover:scale-105 active:scale-95'
                                        }`}
                                >
                                    {isEnhancing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
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
                    <div className="flex flex-col h-full min-h-[250px] md:min-h-0">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                AI Result
                                <span className="text-[10px] font-normal text-muted">Refined output</span>
                            </label>
                            {resultText && (
                                <button
                                    onClick={handleCopy}
                                    className="text-muted hover:text-blue-400 transition-colors p-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                >
                                    <Copy className="w-3 h-3" /> Copy
                                </button>
                            )}
                        </div>
                        <div className="relative flex-1">
                            <div
                                className={`w-full h-full p-6 border border-dashed rounded-[20px] overflow-y-auto transition-all ${resultText
                                    ? 'bg-blue-500/5 border-blue-500/20 text-foreground'
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
                                        <p className="text-xs font-medium text-muted">Enhanced content will appear here</p>
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
