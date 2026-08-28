"use client";

import useSWR from 'swr';
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getHistoryById, HistoryRecord } from '@/lib/supabase/getHistory';
import { ArrowLeft, Calendar, Copy } from 'lucide-react';

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

     const { data: record, error, isLoading } = useSWR(
        id ? ['history', id] : null,
        () => getHistoryById(id)
    );

     const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (isLoading) {
        return (
            <div className="flex-1 p-4 md:p-8 text-foreground flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!record) {
        return (
            <div className="flex-1 p-4 md:p-8 text-foreground text-center">
                <p className="text-muted">Record not found.</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 md:p-8 overflow-y-auto h-full text-foreground">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-6">
                    <button
                        onClick={() => router.back()}
                        className="w-fit flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors group cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold capitalize mb-2">{record.action}</h1>
                            <div className="flex items-center gap-2 text-muted text-sm">
                                <Calendar className="w-4 h-4" />
                                {new Date(record.created_at).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                                {', '}
                                {new Date(record.created_at).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Original Text */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted">Original Input</label>
                            <button
                                onClick={() => handleCopy(record.original_text)}
                                className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                <Copy className="w-3 h-3" /> Copy
                            </button>
                        </div>
                        <div className="p-6 rounded-[20px] bg-card border border-border text-muted leading-relaxed whitespace-pre-wrap min-h-[100px]">
                            {record.original_text}
                        </div>
                    </div>

                    {/* Processed Text */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-blue-400">AI Result</label>
                            <button
                                onClick={() => handleCopy(record.processed_text)}
                                className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                <Copy className="w-3 h-3" /> Copy
                            </button>
                        </div>
                        <div className="p-6 rounded-[20px] bg-blue-500/[0.03] border border-blue-500/20 shadow-inner text-foreground leading-relaxed whitespace-pre-wrap min-h-[100px]">
                            {record.processed_text}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
