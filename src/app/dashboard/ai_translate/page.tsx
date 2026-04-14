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
        <div className="bg-white rounded-[10px] flex-1 p-8 overflow-y-auto h-full min-h-[calc(100vh-40px)]">
            <div className="max-w-7xl mx-auto h-full flex flex-col">

                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-[12px] bg-indigo-500 flex items-center justify-center">
                            <Languages className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#101010]">AI Translate</h1>
                    </div>
                    <p className="text-gray-500">Translate your content into any language with AI-powered precision.</p>
                </div>

                {/* Language Selector Bar */}
                <div className="flex items-center gap-3 mb-6 p-4 bg-[#f9f9f9] border border-gray-100 rounded-[16px]">
                    {/* From Language */}
                    <div className="flex-1 relative">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 px-1">
                            From
                        </label>
                        <div className="relative">
                            <select
                                id="from-language"
                                value={fromLanguage}
                                onChange={(e) => setFromLanguage(e.target.value)}
                                className="w-full appearance-none bg-white border border-gray-200 rounded-[10px] px-4 py-2.5 pr-9 text-sm font-medium text-[#101010] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all cursor-pointer"
                            >
                                {FROM_LANGUAGES.map((lang) => (
                                    <option key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
                                    ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'border-gray-200 text-gray-500 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 active:scale-90'
                            }`}
                        >
                            <ArrowRightLeft className="w-4 h-4" />
                        </button>
                    </div>

                    {/* To Language */}
                    <div className="flex-1 relative">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 px-1">
                            To
                        </label>
                        <div className="relative">
                            <select
                                id="to-language"
                                value={toLanguage}
                                onChange={(e) => setToLanguage(e.target.value)}
                                className="w-full appearance-none bg-white border border-gray-200 rounded-[10px] px-4 py-2.5 pr-9 text-sm font-medium text-[#101010] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all cursor-pointer"
                            >
                                {LANGUAGES.map((lang) => (
                                    <option key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Text Areas */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[450px]">

                    {/* Input Side */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <label className="text-sm font-semibold text-[#101010] flex items-center gap-2">
                                Original Text
                                <span className="text-[10px] font-normal text-gray-400">Enter text to translate</span>
                            </label>
                            <button
                                onClick={handleClear}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
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
                                className="w-full h-full p-6 bg-[#f9f9f9] border border-gray-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none text-[#101010] placeholder:text-gray-400"
                            />
                            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                {inputText && (
                                    <span className="text-[10px] text-gray-400 mr-1">
                                        {inputText.length} chars
                                    </span>
                                )}
                                <button
                                    id="translate-button"
                                    onClick={handleTranslate}
                                    disabled={!inputText.trim() || isTranslating}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                                        !inputText.trim() || isTranslating
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-[#101010] text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95'
                                    }`}
                                >
                                    {isTranslating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                            <label className="text-sm font-semibold text-[#101010] flex items-center gap-2">
                                Translation
                                <span className="text-[10px] font-normal text-gray-400">
                                    {toLanguage}
                                </span>
                            </label>
                            {resultText && (
                                <button
                                    id="copy-translation-button"
                                    onClick={handleCopy}
                                    className="text-gray-400 hover:text-indigo-500 transition-colors p-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
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
                                        ? 'bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-indigo-100 text-[#101010]'
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
                                        <p className="text-xs font-medium">Translation will appear here</p>
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
