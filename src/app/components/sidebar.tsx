"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, LayoutDashboard, FileText, History, Sparkles, ChevronDown, ChevronRight, Languages } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Script Extractor', href: '/dashboard/script_extract', icon: FileText },
    {
        name: 'AI Tools',
        icon: Sparkles,
        isDropdown: true,
        children: [
            { name: 'Text Enhance', href: '/dashboard/ai_enhance', icon: Sparkles },
            { name: 'Paraphraser', href: '/dashboard/ai_paraphrase', icon: Sparkles },
            { name: 'Translate', href: '/dashboard/ai_translate', icon: Languages },
        ]
    },
    { name: 'History', href: '/dashboard/history', icon: History },
];

const Sidebar = () => {
    const pathname = usePathname();
    const [isAIToolsOpen, setIsAIToolsOpen] = React.useState(false);

    return (
        <aside className="fixed left-[10px] top-[10px] rounded-[10px] h-[calc(100vh-20px)] w-[18%] bg-[#ffffff] z-50 overflow-y-auto">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                    <h2 className="font-semibold text-[#101010]">PRISMO</h2>
                </div>
                <nav className="mt-10">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                {item.isDropdown ? (
                                    <>
                                        <button
                                            onClick={() => setIsAIToolsOpen(!isAIToolsOpen)}
                                            className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors cursor-pointer rounded-[5px] ${isAIToolsOpen || item.children?.some(child => pathname === child.href)
                                                ? 'bg-gray-100 text-[#101010]'
                                                : 'text-gray-600 hover:text-[#101010] hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className="w-5 h-5" />
                                                {item.name}
                                            </div>
                                            {isAIToolsOpen ? (
                                                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                                            )}
                                        </button>
                                        {isAIToolsOpen && (
                                            <ul className="mt-2 ml-4 space-y-1">
                                                {item.children?.map((child) => (
                                                    <li key={child.name}>
                                                        <Link
                                                            href={child.href}
                                                            className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-medium transition-colors cursor-pointer rounded-[5px] ${pathname === child.href
                                                                ? 'bg-[#101010] text-white'
                                                                : 'text-gray-500 hover:text-[#101010] hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href || '#'}
                                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${(pathname === item.href || (pathname === '/' && item.href === '/dashboard'))
                                            ? 'bg-[#101010] text-white rounded-[5px]'
                                            : 'text-gray-600 hover:text-[#101010] hover:bg-gray-50'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
