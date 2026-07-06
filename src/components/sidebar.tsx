"use client";

import React, { useEffect } from 'react';
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
    PanelLeft,
    Settings,
    Menu,
    X
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Script Extractor', href: '/dashboard/script_extract', icon: FileText },
    {
        name: 'AI Tools',
        icon: Sparkles,
        isDropdown: true,
        children: [
            { name: 'Enhance', href: '/dashboard/ai_enhance', icon: Sparkles },
            { name: 'Paraphraser', href: '/dashboard/ai_paraphrase', icon: Sparkles },
            { name: 'Translate', href: '/dashboard/ai_translate', icon: Languages },
        ]
    },
    { name: 'History', href: '/dashboard/history', icon: History },
];

const secondaryItems = [
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const Sidebar = () => {
    const pathname = usePathname();
    const [isAIToolsOpen, setIsAIToolsOpen] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    // Close mobile drawer on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile drawer is open
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileOpen]);

    const sidebarContent = (
        <>
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
                        <h2 className="font-semibold text-foreground text-xl leading-none">Prismo AI</h2>
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
                {/* Desktop: collapse toggle | Mobile: close button */}
                <button
                    onClick={() => {
                        // On mobile, close the drawer
                        if (window.innerWidth < 768) {
                            setIsMobileOpen(false);
                        } else {
                            setIsCollapsed(!isCollapsed);
                        }
                    }}
                    className="p-1 hover:bg-foreground/5 rounded-md text-muted hover:text-foreground transition-colors cursor-pointer shrink-0 ml-auto"
                >
                    <span className="hidden md:block">
                        {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                    </span>
                    <span className="block md:hidden">
                        <X className="w-5 h-5" />
                    </span>
                </button>
            </div>

            <nav className="mt-6 flex-1 px-4 overflow-hidden flex flex-col justify-between pb-4">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            {item.isDropdown ? (
                                <>
                                    <button
                                        onClick={() => !isCollapsed && setIsAIToolsOpen(!isAIToolsOpen)}
                                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 text-sm font-medium transition-all cursor-pointer rounded-lg ${isAIToolsOpen || item.children?.some(child => pathname === child.href)
                                            ? 'bg-foreground/10 text-foreground shadow-sm ring-1 ring-foreground/10'
                                            : 'text-muted hover:text-foreground hover:bg-foreground/5'
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
                                        <ul className="mt-2 ml-4 space-y-1 relative before:absolute before:left-[-1px] before:top-0 before:bottom-0 before:w-[1px] before:bg-foreground/10 overflow-hidden">
                                            {item.children?.map((child) => (
                                                <li key={child.name}>
                                                    <Link
                                                        href={child.href}
                                                        className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-medium transition-all cursor-pointer rounded-lg whitespace-nowrap overflow-hidden ${pathname === child.href
                                                            ? 'text-foreground bg-foreground/10'
                                                            : 'text-muted hover:text-foreground hover:bg-foreground/5'
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
                                        ? 'bg-foreground/10 text-foreground shadow-sm ring-1 ring-foreground/10'
                                        : 'text-muted hover:text-foreground hover:bg-foreground/5'
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

                <div className="space-y-4">
                    <div className="mx-2 h-[1px] bg-border" />
                    <ul className="space-y-2">
                        {secondaryItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href || '#'}
                                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium transition-all cursor-pointer rounded-lg whitespace-nowrap overflow-hidden ${pathname === item.href
                                        ? 'bg-foreground/10 text-foreground shadow-sm ring-1 ring-foreground/10'
                                        : 'text-muted hover:text-foreground hover:bg-foreground/5'
                                        }`}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    <item.icon className={`w-5 h-5 shrink-0 ${pathname === item.href ? 'text-indigo-400' : ''}`} />
                                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </>
    );

    return (
        <>
            {/* Mobile: Top Bar with Hamburger */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 hover:bg-foreground/5 rounded-lg text-foreground transition-colors cursor-pointer"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <Image
                        src="/prismo-logo.svg"
                        alt="Prismo Logo"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                    />
                    <span className="font-semibold text-foreground text-sm">Prismo AI</span>
                </div>
            </div>

            {/* Mobile: Overlay */}
            {isMobileOpen && (
                <div
                    className="md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile: Drawer */}
            <aside
                className={`md:hidden fixed top-0 left-0 h-screen w-72 bg-background border-r border-border flex flex-col z-[70] shadow-2xl transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* On mobile, never show collapsed state */}
                {sidebarContent}
            </aside>

            {/* Desktop: Standard Sidebar */}
            <aside className={`hidden md:flex ${isCollapsed ? 'w-[80px]' : 'w-64'} bg-background h-screen transition-[width] duration-300 border-r border-border flex-col z-50 overflow-hidden shadow-xl`}>
                {sidebarContent}
            </aside>
        </>
    );
};

export default Sidebar;
