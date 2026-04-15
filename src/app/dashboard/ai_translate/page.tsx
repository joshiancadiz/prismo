"use client";

import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Copy, Trash2, ArrowRight, ChevronDown } from 'lucide-react';

const LANGUAGES = [
    { value: 'Filipino/Tagalog', label: '🇵🇭 Filipino / Tagalog' },
    { value: 'English', label: '🇺🇸 English' },
    { value: 'Spanish', label: '🇪🇸 Spanish' },
    { value: 'French', label: '🇫🇷 French' },
    { value: 'Japanese', label: '🇯🇵 Japanese' },
    { value: 'Chinese', label: '🇨🇳 Chinese' },
    { value: 'Korean', label: '🇰🇷 Korean' },
    { value: 'Arabic', label: '🇸🇦 Arabic' },
];

const FROM_LANGUAGES = [
    { value: 'auto', label: '🔍 Auto Detect' },
    ...LANGUAGES,
];

export default function AITranslatePage() {
    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [fromLanguage, setFromLanguage] = useState('auto');
    const [toLanguage, setToLanguage] = useState('English');
    const [copied, setCopied] = useState(false);

    const handleTranslate = async () => {
        if (!inputText.trim()) return;

        setIsTranslating(true);
        setResultText('');

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText, fromLanguage, toLanguage }),
            });

            const data = await response.json();

            if (!response.ok) {
                setResultText(`Error: ${data.error || 'Something went wrong.'}`);
                return;
            }

            setResultText(data.translatedText);
        } catch {
            setResultText('Error: Failed to connect to the translation service.');
        } finally {
            setIsTranslating(false);
        }
    };

    const handleClear = () => {
        setInputText('');
        setResultText('');
    };

    const handleCopy = () => {
        if (resultText) {
            navigator.clipboard.writeText(resultText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSwapLanguages = () => {
        if (fromLanguage === 'auto') return;
        const prev = fromLanguage;
        setFromLanguage(toLanguage);
        setToLanguage(prev);
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto h-full min-h-[calc(100vh-40px)] text-white">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
 
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-[12px] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Languages className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">AI Translate</h1>
                    </div>
                    <p className="text-gray-400">Translate your content into any language with AI-powered precision.</p>
                </div>
 
                {/* Language Selector Bar */}
                <div className="flex items-center gap-3 mb-6 p-4 bg-white/5 border border-white/5 rounded-[16px]">
                    {/* From Language */}
                    <div className="flex-1 relative">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 px-1">
                            From
                        </label>
                        <div className="relative">
                            <select
                                id="from-language"
                                value={fromLanguage}
                                onChange={(e) => setFromLanguage(e.target.value)}
                                className="w-full appearance-none bg-white/5 border border-white/10 rounded-[10px] px-4 py-2.5 pr-9 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all cursor-pointer"
                            >
                                {FROM_LANGUAGES.map((lang) => (
                                    <option key={lang.value} value={lang.value} className="bg-[#1a1c24] text-white">
                                        {lang.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
 
                    {/* Swap Button */}
                    <div className="flex flex-col items-center justify-end pb-0.5">
                        <div className="h-4" /> {/* spacer for label */}
                        <button
                            onClick={handleSwapLanguages}
                            disabled={fromLanguage === 'auto'}
                            title={fromLanguage === 'auto' ? 'Cannot swap while Auto Detect is selected' : 'Swap languages'}
                            className={`p-2 rounded-full border transition-all ${
                                fromLanguage === 'auto'
                                    ? 'border-white/5 text-gray-700 cursor-not-allowed'
                                    : 'border-white/10 text-gray-400 hover:bg-white/5 hover:border-indigo-500/50 hover:text-indigo-400 active:scale-90 cursor-pointer'
                            }`}
                        >
                            <ArrowRightLeft className="w-4 h-4" />
                        </button>
                    </div>
 
                    {/* To Language */}
                    <div className="flex-1 relative">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 px-1">
                            To
                        </label>
                        <div className="relative">
                            <select
                                id="to-language"
                                value={toLanguage}
                                onChange={(e) => setToLanguage(e.target.value)}
                                className="w-full appearance-none bg-white/5 border border-white/10 rounded-[10px] px-4 py-2.5 pr-9 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all cursor-pointer"
                            >
                                {LANGUAGES.map((lang) => (
                                    <option key={lang.value} value={lang.value} className="bg-[#1a1c24] text-white">
                                        {lang.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                </div>
 
                {/* Text Areas */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[450px]">
 
                    {/* Input Side */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <label className="text-sm font-semibold text-white flex items-center gap-2">
                                Original Text
                                <span className="text-[10px] font-normal text-gray-500">Enter text to translate</span>
                            </label>
                            <button
                                onClick={handleClear}
                                className="text-gray-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                                title="Clear"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="relative flex-1 group">
                            <textarea
                                id="translate-input"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Paste or type your text here..."
                                className="w-full h-full p-6 bg-white/5 border border-white/5 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none text-white placeholder:text-gray-600"
                            />
                            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                {inputText && (
                                    <span className="text-[10px] text-gray-500 mr-1 font-mono">
                                        {inputText.length} chars
                                    </span>
                                )}
                                <button
                                    id="translate-button"
                                    onClick={handleTranslate}
                                    disabled={!inputText.trim() || isTranslating}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all cursor-pointer ${
                                        !inputText.trim() || isTranslating
                                            ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                                            : 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/5 hover:scale-105 active:scale-95'
                                    }`}
                                >
                                    {isTranslating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            Translating...
                                        </>
                                    ) : (
                                        <>
                                            Translate <Languages className="w-4 h-4" />
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
                                Translation
                                <span className="text-[10px] font-normal text-gray-500">
                                    {toLanguage}
                                </span>
                            </label>
                            {resultText && (
                                <button
                                    id="copy-translation-button"
                                    onClick={handleCopy}
                                    className="text-gray-400 hover:text-indigo-400 transition-colors p-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                >
                                    <Copy className="w-3 h-3" />
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            )}
                        </div>
                        <div className="relative flex-1">
                            <div
                                className={`w-full h-full p-6 border border-dashed rounded-[20px] overflow-y-auto transition-all ${
                                    resultText
                                        ? 'bg-indigo-500/5 border-indigo-500/20 text-white'
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
                                        <p className="text-xs font-medium text-gray-500">Translation will appear here</p>
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
