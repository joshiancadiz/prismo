"use client";

import React from 'react';
import { FileText, Download, ExternalLink, Trash2, Calendar, ShieldCheck, History } from 'lucide-react';

const historyRecords = [
    { id: '1', name: 'Analysis_Report_Q1.pdf', date: '2024-02-25', status: 'Completed', type: 'PDF' },
    { id: '2', name: 'User_Feedback_Summary.docx', date: '2024-02-24', status: 'Completed', type: 'DOCX' },
    { id: '3', name: 'Market_Trends_Research.txt', date: '2024-02-22', status: 'Failed', type: 'TXT' },
    { id: '4', name: 'Technical_Documentation_V2.pdf', date: '2024-02-20', status: 'Completed', type: 'PDF' },
    { id: '5', name: 'Project_Proposal_Draft.docx', date: '2024-02-18', status: 'Completed', type: 'DOCX' },
];

export default function HistoryPage({ params }: { params: Promise<{}> }) {
    return (
        <div className="bg-white rounded-[10px] flex-1 p-8 overflow-y-auto h-full">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#101010]">History</h1>
                    <p className="text-gray-500 mt-2">View and manage your previous script extractions and reports.</p>
                </div>

                <div className="bg-[#f9f9f9] rounded-[15px] border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">File Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {historyRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-white transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[#101010]">{record.name}</p>
                                                <p className="text-xs text-gray-400">{record.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            {record.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'Completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {record.status === 'Completed' && <ShieldCheck className="w-3 h-3 mr-1" />}
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-[#101010] hover:bg-gray-100 rounded-lg transition-colors" title="Open Link">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {historyRecords.length === 0 && (
                    <div className="text-center py-20 px-4 bg-[#f9f9f9] rounded-[15px] border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <History className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-[#101010]">No analysis history yet</h3>
                        <p className="text-gray-500 mt-1">Start by extracting your first script to see it here.</p>
                        <button className="mt-6 px-6 py-2 bg-[#101010] text-white text-sm font-medium rounded-[5px] hover:bg-gray-800 transition-colors">
                            Analyze New Script
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
