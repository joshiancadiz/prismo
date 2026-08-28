"use client";

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import LogoutModal from './logoutModal';

export default function LogoutButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 font-semibold rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
            </button>

            <LogoutModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
}
