"use client";

import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                    {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                </div>
                <div>
                    <p className="text-sm font-medium text-white">Dark Mode</p>
                    <p className="text-xs text-gray-500">Currently in dark mode interface</p>
                </div>
            </div>
            
            <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    isDarkMode ? 'bg-indigo-600' : 'bg-gray-700'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
}
