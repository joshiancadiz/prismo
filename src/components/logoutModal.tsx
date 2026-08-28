"use client";

import React, { useState, useEffect } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Close on escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleConfirmLogout = async () => {
        setIsLoading(true);
        try {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = '/login';
        } catch (error) {
            console.error('Error signing out:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
                onClick={isLoading ? undefined : onClose}
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-[360px] bg-card/95 border border-border/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center">
                {/* Visual Icon Header */}
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    <LogOut className="w-5 h-5" />
                </div>

                {/* Text Messages */}
                <h3 className="text-lg font-bold text-foreground mb-2">
                    Sign Out Confirm
                </h3>
                <p className="text-sm text-muted mb-6 max-w-[280px]">
                    Are you sure you want to sign out?
                </p>

                {/* Control Actions */}
                <div className="flex w-full gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground font-semibold rounded-xl transition-all border border-border disabled:opacity-50 cursor-pointer text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmLogout}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-500/10 hover:shadow-red-500/20 disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Signing out...</span>
                            </>
                        ) : (
                            <span>Sign Out</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
