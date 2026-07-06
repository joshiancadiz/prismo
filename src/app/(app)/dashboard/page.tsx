"use client";

import React, { useEffect, useState } from 'react';
import { FileText, Wand2, Shuffle, Languages, Loader2, ChevronRight } from 'lucide-react';
import { getHistory } from '@/lib/supabase/getHistory';
import Link from 'next/link';

export default function DashboardPage({ params }: { params?: Promise<any> } = {}) {
    const [counts, setCounts] = useState({
        extract: 0,
        enhance: 0,
        paraphrase: 0,
        translate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCounts() {
            setLoading(true);
            try {
                const history = await getHistory();
                const newCounts = {
                    extract: 0,
                    enhance: 0,
                    paraphrase: 0,
                    translate: 0
                };
                history.forEach(record => {
                    if (record.action === 'extract') newCounts.extract++;
                    else if (record.action === 'enhance') newCounts.enhance++;
                    else if (record.action === 'paraphrase') newCounts.paraphrase++;
                    else if (record.action === 'translate') newCounts.translate++;
                });
                setCounts(newCounts);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchCounts();
    }, []);

    const stats = [
        { name: 'Extracted Scripts', value: counts.extract.toString(), icon: FileText, color: 'text-blue-500' },
        { name: 'Enhanced Texts', value: counts.enhance.toString(), icon: Wand2, color: 'text-purple-500' },
        { name: 'Paraphrased Texts', value: counts.paraphrase.toString(), icon: Shuffle, color: 'text-green-500' },
        { name: 'Translated Texts', value: counts.translate.toString(), icon: Languages, color: 'text-orange-500' },
    ];

    const quickActions = [
        { name: 'Extract New Script', href: '/dashboard/script_extract', icon: FileText, color: 'text-blue-500' },
        { name: 'Enhance Text', href: '/dashboard/ai_enhance', icon: Wand2, color: 'text-purple-500' },
        { name: 'Paraphrase Content', href: '/dashboard/ai_paraphrase', icon: Shuffle, color: 'text-green-500' },
        { name: 'Translate Text', href: '/dashboard/ai_translate', icon: Languages, color: 'text-orange-500' },
    ];

    return (
        <div className="flex-1 p-4 md:p-8 pb-16 md:pb-20 overflow-y-auto h-full">
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Overview</h1>
                        <p className="text-muted mt-2">Welcome back to Prismo AI. Here&apos;s what&apos;s happening today.</p>
                    </div>
                </div>
 
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {stats.map((stat) => (
                        <div key={stat.name} className="p-4 md:p-6 bg-card rounded-[15px] border border-border hover:border-foreground/10 hover:shadow-sm transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color} transition-transform group-hover:scale-110`} />
                                <span className="text-2xl font-bold text-foreground">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stat.value}
                                </span>
                            </div>
                            <h3 className="text-xs md:text-sm font-medium text-muted">{stat.name}</h3>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
                    <div className="flex flex-col gap-3 max-w-md">
                        {quickActions.map((action) => (
                            <Link 
                                key={action.name} 
                                href={action.href}
                                className="flex items-center justify-between p-4 bg-card border border-border rounded-[12px] hover:bg-foreground/5 hover:border-foreground/10 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors`}>
                                        <action.icon className={`w-5 h-5 ${action.color}`} />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{action.name}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
 
            </div>
        </div>
    );
}
