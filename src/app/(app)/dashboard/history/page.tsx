"use client";

import React, { Suspense } from 'react';
import HistoryTable from '@/components/historyTable';

export default function HistoryPage() {
    return (
        <div className="flex-1 p-4 md:p-8 pb-16 md:pb-20 overflow-y-auto h-full text-foreground">
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">History</h1>
                    <p className="text-muted mt-2">View and manage your previous script extractions and reports.</p>
                </div>

                <Suspense fallback={
                    <div className="w-full bg-card rounded-[15px] border border-border p-8 text-center text-muted">
                        Loading history...
                    </div>
                }>
                    <HistoryTable />
                </Suspense>
            </div>
        </div>
    );
}
