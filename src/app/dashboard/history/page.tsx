"use client";

import React from 'react';
import HistoryTable from '@/components/historyTable';

export default function HistoryPage() {
    return (
        <div className="flex-1 p-8 overflow-y-auto h-full text-foreground">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">History</h1>
                    <p className="text-muted mt-2">View and manage your previous script extractions and reports.</p>
                </div>

                <HistoryTable />
            </div>
        </div>
    );
}
