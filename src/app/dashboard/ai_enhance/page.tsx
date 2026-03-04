"use client";

import React from 'react';
import { Sparkles, Wand2, Zap, Brain } from 'lucide-react';

const features = [
    { name: 'Content Summarization', description: 'Transform long videos into concise, actionable summaries.', icon: Zap, color: 'text-orange-500' },
    { name: 'Theme Analysis', description: 'Identify key topics and themes discussed throughout the video.', icon: Brain, color: 'text-blue-500' },
    { name: 'AI Re-scripting', description: 'Regenerate scripts optimized for different social platforms.', icon: Wand2, color: 'text-purple-500' },
];

export default function AIEnhancePage({ params }: { params: Promise<{}> }) {
    return (
        <div className="bg-white rounded-[10px] flex-1 p-8 overflow-y-auto h-full">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#101010]">AI Enhance</h1>
                    <p className="text-gray-500 mt-2">Elevate your content with advanced AI-driven analysis and re-purposing tools.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature) => (
                        <div key={feature.name} className="p-6 bg-[#f9f9f9] rounded-[15px] border border-gray-100 hover:shadow-sm transition-all group">
                            <div className="w-12 h-12 rounded-[12px] bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-lg font-semibold text-[#101010] mb-2">{feature.name}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                            <button className="mt-6 text-xs font-semibold text-[#101010] flex items-center gap-1 group-hover:gap-2 transition-all">
                                Explore Feature <Sparkles className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-[20px] border border-blue-100/50">
                    <div className="max-w-2xl">
                        <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" /> Coming Soon: Multi-modal Support
                        </h2>
                        <p className="text-blue-700/80 text-sm leading-relaxed mb-6">
                            We're working on advanced vision-based analysis to extract insights not just from what's said, but from what's shown on screen.
                        </p>
                        <div className="flex gap-3">
                            <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-wider border border-blue-200">Video Perception</span>
                            <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-wider border border-blue-200">Emotional Intelligence</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
