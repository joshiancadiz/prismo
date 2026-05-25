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
            className="hover:bg-foreground/[0.03] border-b border-border last:border-0 transition-colors duration-200 group cursor-pointer outline-none focus:outline-none select-none"
        >
            <td className="px-6 py-4">
                <span className="text-sm font-medium text-foreground group-hover:text-blue-400 transition-colors truncate">
                    {action}
                </span>
            </td>
            <td className="px-6 py-4">
                <p className="text-sm text-muted line-clamp-1 group-hover:text-foreground/80 transition-colors">
                    {output}
                </p>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-muted font-mono group-hover:text-foreground/70 transition-colors">
                    {date}
                </span>
            </td>
        </tr>
    );
}
