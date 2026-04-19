"use client";

import React, { useEffect, useState } from 'react';
import { getHistory, HistoryRecord } from '@/lib/supabase/getHistory';
import HistoryItem from '@/components/historyItem';

export default function HistoryTable() {
    const [records, setRecords] = useState<{ id: string; action: string; output: string; date: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            setLoading(true);
            try {
                const data = await getHistory();
                const mapped = data.map((record: HistoryRecord) => ({
                    id: record.id,
                    action: record.action.charAt(0).toUpperCase() + record.action.slice(1),
                    output: record.processed_text,
                    date: new Date(record.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    }) + ', ' + new Date(record.created_at).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                    }),
                }));
                setRecords(mapped);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="w-full bg-white/5 rounded-[15px] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="w-px whitespace-nowrap px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                            <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Output</th>
                            <th className="w-1/4 px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {[...Array(4)].map((_, i) => (
                            <tr key={i}>
                                <td className="px-6 py-4">
                                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="w-full bg-white/5 rounded-[15px] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                        <th className="w-px whitespace-nowrap px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Action
                        </th>
                        <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Output
                        </th>
                        <th className="w-1/4 px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {records.length > 0 ? (
                        records.map((record) => (
                            <HistoryItem
                                key={record.id}
                                id={record.id}
                                action={record.action}
                                output={record.output}
                                date={record.date}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="px-6 py-20 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-white font-medium">No history available</p>
                                    <p className="text-xs text-gray-400">Your recent activities will appear here</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
