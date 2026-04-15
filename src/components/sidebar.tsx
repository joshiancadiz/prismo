"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
    LayoutDashboard, 
    FileText, 
    History, 
    Sparkles, 
    ChevronDown, 
    ChevronRight, 
    Languages,
    PanelLeftClose,
    PanelLeft
} from 'lucide-react';

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
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <aside className={`${isCollapsed ? 'w-[80px]' : 'w-64'} bg-[#08090D] h-screen transition-all duration-300 border-r border-white/5 flex flex-col z-50 overflow-hidden shadow-xl`}>
            <div className="p-6 flex items-end justify-between overflow-hidden">
                {!isCollapsed && (
                    <div className="flex items-end gap-3 whitespace-nowrap overflow-hidden">
                        <Image
                            src="/prismo-logo.svg"
                            alt="Prismo Logo"
                            width={24}
                            height={24}
                            className="w-6 h-6 shrink-0"
                        />
                        <h2 className="font-semibold text-white text-xl leading-none">Prismo AI</h2>
                    </div>
                )}
                {isCollapsed && (
                    <Image
                        src="/prismo-logo.svg"
                        alt="Prismo Logo"
                        width={24}
                        height={24}
                        className="w-6 h-6 shrink-0"
                    />
                )}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-auto"
                >
                    {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                </button>
            </div>
            
            <nav className="mt-6 flex-1 px-4 overflow-hidden">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            {item.isDropdown ? (
                                <>
                                    <button
                                        onClick={() => !isCollapsed && setIsAIToolsOpen(!isAIToolsOpen)}
                                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 text-sm font-medium transition-all cursor-pointer rounded-lg ${isAIToolsOpen || item.children?.some(child => pathname === child.href)
                                            ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                        title={isCollapsed ? item.name : undefined}
                                    >
                                        <div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
                                            <item.icon className={`w-5 h-5 shrink-0 ${isAIToolsOpen || item.children?.some(child => pathname === child.href) ? 'text-indigo-400' : ''}`} />
                                            {!isCollapsed && <span className="truncate">{item.name}</span>}
                                        </div>
                                        {!isCollapsed && (
                                            isAIToolsOpen ? (
                                                <ChevronDown className="w-4 h-4 transition-transform duration-200 shrink-0" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 transition-transform duration-200 shrink-0" />
                                            )
                                        )}
                                    </button>
                                    {isAIToolsOpen && !isCollapsed && (
                                        <ul className="mt-2 ml-4 space-y-1 relative before:absolute before:left-[-1px] before:top-0 before:bottom-0 before:w-[1px] before:bg-white/10 overflow-hidden">
                                            {item.children?.map((child) => (
                                                <li key={child.name}>
                                                    <Link
                                                        href={child.href}
                                                        className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-medium transition-all cursor-pointer rounded-lg whitespace-nowrap overflow-hidden ${pathname === child.href
                                                            ? 'text-white bg-white/10'
                                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                                            }`}
                                                    >
                                                        <span className="truncate">{child.name}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.href || '#'}
                                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium transition-all cursor-pointer rounded-lg whitespace-nowrap overflow-hidden ${(pathname === item.href || (pathname === '/' && item.href === '/dashboard'))
                                        ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    <item.icon className={`w-5 h-5 shrink-0 ${(pathname === item.href || (pathname === '/' && item.href === '/dashboard')) ? 'text-indigo-400' : ''}`} />
                                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
