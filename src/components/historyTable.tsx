"use client";

import React, { useEffect, useState } from 'react';
import { getHistory, HistoryRecord } from '@/lib/supabase/getHistory';
import HistoryItem from '@/components/historyItem';
import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';

const FILTER_OPTIONS = ['All', 'Enhance', 'Paraphrase', 'Translate', 'Extract'];

export default function HistoryTable() {
    const [records, setRecords] = useState<{ id: string; action: string; output: string; date: string; rawDate: number }[]>([]);
    const [actionFilter, setActionFilter] = useState<string>('All');
    const [sortDesc, setSortDesc] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
                    rawDate: new Date(record.created_at).getTime(),
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

    const filteredAndSortedRecords = records
        .filter(record => actionFilter === 'All' || record.action === actionFilter)
        .sort((a, b) => sortDesc ? b.rawDate - a.rawDate : a.rawDate - b.rawDate);

    return (
        <div className="w-full bg-white/5 rounded-[15px] border border-white/10 shadow-2xl backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 border-b border-white/10 overflow-visible rounded-t-[15px]">
                    <tr className="overflow-visible">
                        <th className="w-px whitespace-nowrap px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest relative overflow-visible rounded-tl-[15px]">
                            <div className="relative">
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 hover:text-white transition-colors outline-none uppercase font-bold tracking-widest bg-transparent border-none p-0 cursor-pointer"
                                >
                                    Action: {actionFilter}
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-white' : 'text-gray-500'}`} />
                                </button>

                                {isDropdownOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-[60]" 
                                            onClick={() => setIsDropdownOpen(false)}
                                        />
                                        <div className="absolute left-0 mt-4 w-48 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl z-[70] py-1 flex flex-col overflow-hidden">
                                            {FILTER_OPTIONS.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        setActionFilter(option);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors border-none bg-transparent cursor-pointer ${actionFilter === option ? 'text-blue-400 bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                                >
                                                    {option === 'All' ? 'Action: All' : option}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </th>
                        <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Output
                        </th>
                        <th className="w-1/4 px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest rounded-tr-[15px]">
                            <button 
                                className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition-colors select-none w-max border-none bg-transparent outline-none p-0 uppercase tracking-widest font-bold group/date"
                                onClick={() => setSortDesc(!sortDesc)}
                            >
                                DATE
                                <ArrowDown className={`w-4 h-4 transition-transform duration-300 ${sortDesc ? 'rotate-0' : 'rotate-180'} group-hover/date:text-white`} />
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {filteredAndSortedRecords.length > 0 ? (
                        filteredAndSortedRecords.map((record) => (
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
