"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-[180px] h-[38px] bg-foreground/5 animate-pulse rounded-lg" />;
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-foreground/5 rounded-lg">
                    {isDark ? (
                        <Moon className="w-5 h-5 text-indigo-400" />
                    ) : (
                        <Sun className="w-5 h-5 text-yellow-500" />
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-foreground">
                        {isDark ? 'Dark Mode' : 'Light Mode'}
                    </p>
                    <p className="text-xs text-muted">
                        {isDark ? 'Currently in dark interface' : 'Currently in light interface'}
                    </p>
                </div>
            </div>
            
            <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    isDark ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
                aria-label="Toggle theme"
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
}
