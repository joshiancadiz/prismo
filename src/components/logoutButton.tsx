"use client";

import React from 'react';
import { LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function LogoutButton() {
    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 font-semibold rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
        </button>
    );
}
