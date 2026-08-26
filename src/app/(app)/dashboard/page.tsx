"use client";

import React, { useEffect, useState } from 'react';
import { FileText, Wand2, Shuffle, Languages, Loader2, ChevronRight } from 'lucide-react';
import { getHistory } from '@/lib/supabase/getHistory';
import Link from 'next/link';
import StatCard from '@/components/statCard';

function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    if (isNaN(diffMs) || diffMs < 0) return 'just now';

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function DashboardPage({ params }: { params?: Promise<any> } = {}) {
    const [counts, setCounts] = useState({
        extract: 0,
        enhance: 0,
        paraphrase: 0,
        translate: 0
    });
    const [lastUsed, setLastUsed] = useState({
        extract: '',
        enhance: '',
        paraphrase: '',
        translate: ''
    });
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
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
                const latestRecords = {
                    extract: null as string | null,
                    enhance: null as string | null,
                    paraphrase: null as string | null,
                    translate: null as string | null,
                };
                history.forEach(record => {
                    if (record.action === 'extract') {
                        newCounts.extract++;
                        if (!latestRecords.extract || new Date(record.created_at) > new Date(latestRecords.extract)) {
                            latestRecords.extract = record.created_at;
                        }
                    } else if (record.action === 'enhance') {
                        newCounts.enhance++;
                        if (!latestRecords.enhance || new Date(record.created_at) > new Date(latestRecords.enhance)) {
                            latestRecords.enhance = record.created_at;
                        }
                    } else if (record.action === 'paraphrase') {
                        newCounts.paraphrase++;
                        if (!latestRecords.paraphrase || new Date(record.created_at) > new Date(latestRecords.paraphrase)) {
                            latestRecords.paraphrase = record.created_at;
                        }
                    } else if (record.action === 'translate') {
                        newCounts.translate++;
                        if (!latestRecords.translate || new Date(record.created_at) > new Date(latestRecords.translate)) {
                            latestRecords.translate = record.created_at;
                        }
                    }
                });
                setCounts(newCounts);
                setLastUsed({
                    extract: latestRecords.extract ? getRelativeTime(latestRecords.extract) : 'never',
                    enhance: latestRecords.enhance ? getRelativeTime(latestRecords.enhance) : 'never',
                    paraphrase: latestRecords.paraphrase ? getRelativeTime(latestRecords.paraphrase) : 'never',
                    translate: latestRecords.translate ? getRelativeTime(latestRecords.translate) : 'never'
                });
                setRecentActivities(history);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchCounts();
    }, []);

    const stats = [
        { name: 'Extracted Scripts', value: counts.extract.toString(), icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10', arrowHref: '/dashboard/history?filter=extract', lastUsed: lastUsed.extract },
        { name: 'Enhanced Texts', value: counts.enhance.toString(), icon: Wand2, color: 'text-purple-500', bg: 'bg-purple-500/10', arrowHref: '/dashboard/history?filter=enhance', lastUsed: lastUsed.enhance },
        { name: 'Paraphrased Texts', value: counts.paraphrase.toString(), icon: Shuffle, color: 'text-green-500', bg: 'bg-green-500/10', arrowHref: '/dashboard/history?filter=paraphrase', lastUsed: lastUsed.paraphrase },
        { name: 'Translated Texts', value: counts.translate.toString(), icon: Languages, color: 'text-orange-500', bg: 'bg-orange-500/10', arrowHref: '/dashboard/history?filter=translate', lastUsed: lastUsed.translate },
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
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
                        <p className="text-muted mt-2">Welcome back to Prismo AI. Here&apos;s what&apos;s happening today.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {stats.map((stat) => (
                        <StatCard
                            key={stat.name}
                            title={stat.name}
                            value={stat.value}
                            icon={stat.icon}
                            iconColor={stat.color}
                            iconBg={stat.bg}
                            arrowHref={stat.arrowHref}
                            loading={loading}
                            lastUsed={stat.lastUsed}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Left Column: Quick Actions */}
                    <div className="space-y-4 lg:col-span-1">
                        <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
                        <div className="flex flex-col gap-3">
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

                    {/* Right Column: Recent Activity Table */}
                    <div className="space-y-4 lg:col-span-2">
                        <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
                        <div className="bg-card border border-border rounded-[12px] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-foreground/5 border-b border-border text-[10px] font-bold uppercase tracking-widest text-muted">
                                            <th className="px-4 py-3">Action</th>
                                            <th className="px-4 py-3">Text</th>
                                            <th className="px-4 py-3 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {loading ? (
                                            [...Array(4)].map((_, i) => (
                                                <tr key={i} className="animate-pulse">
                                                    <td className="px-4 py-4">
                                                        <div className="h-4 w-16 bg-foreground/10 rounded" />
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="h-4 w-48 bg-foreground/10 rounded" />
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <div className="h-4 w-12 bg-foreground/10 rounded ml-auto" />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : recentActivities.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-8 text-center text-xs text-muted">
                                                    No recent activity
                                                </td>
                                            </tr>
                                        ) : (
                                            recentActivities.slice(0, 5).map((activity) => (
                                                <tr key={activity.id} className="hover:bg-foreground/[0.01] transition-colors">
                                                    <td className="px-4 py-3 text-xs font-semibold">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                            activity.action === 'extract' ? 'bg-blue-500/10 text-blue-500' :
                                                            activity.action === 'enhance' ? 'bg-purple-500/10 text-purple-500' :
                                                            activity.action === 'paraphrase' ? 'bg-green-500/10 text-green-500' :
                                                            'bg-orange-500/10 text-orange-500'
                                                        }`}>
                                                            {activity.action}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-foreground/80 max-w-[150px] sm:max-w-[250px] truncate">
                                                        {activity.processed_text || activity.original_text}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-muted text-right whitespace-nowrap">
                                                        {getRelativeTime(activity.created_at)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
