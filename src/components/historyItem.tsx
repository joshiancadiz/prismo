"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export interface HistoryItemProps {
    id: string;
    action: string;
    output: string;
    date: string;
}

export default function HistoryItem({ id, action, output, date }: HistoryItemProps) {
    const router = useRouter();

    const handleRowClick = () => {
        router.push(`/dashboard/history/${id}`);
    };

    return (
        <tr 
            onClick={handleRowClick}
            className="hover:bg-white/[0.03] border-b border-white/5 last:border-0 transition-colors duration-200 group cursor-pointer outline-none focus:outline-none select-none"
        >
            <td className="px-6 py-4">
                <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                    {action}
                </span>
            </td>
            <td className="px-6 py-4">
                <p className="text-sm text-gray-400 line-clamp-1 group-hover:text-gray-200 transition-colors">
                    {output}
                </p>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-gray-500 font-mono group-hover:text-gray-300 transition-colors">
                    {date}
                </span>
            </td>
        </tr>
    );
}
