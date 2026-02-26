"use client";

import React from 'react';
import { LayoutDashboard, FileText, History, Activity } from 'lucide-react';

const stats = [
    { name: 'Total Scans', value: '124', icon: Activity, color: 'text-blue-500' },
    { name: 'Scripts Extracted', value: '45', icon: FileText, color: 'text-purple-500' },
    { name: 'Active Sessions', value: '3', icon: LayoutDashboard, color: 'text-green-500' },
    { name: 'History Records', value: '890', icon: History, color: 'text-orange-500' },
];

export default function DashboardPage() {
    return (
        <div className="bg-white rounded-[10px] flex-1 p-8 overflow-y-auto h-full">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#101010]">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-2">Welcome back to PRISMO. Here's what's happening today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.name} className="p-6 bg-[#f9f9f9] rounded-[15px] border border-gray-100 hover:shadow-sm transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                <span className="text-2xl font-bold text-[#101010]">{stat.value}</span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600">{stat.name}</h3>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
