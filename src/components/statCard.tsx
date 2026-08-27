import React from 'react';
import { ArrowUpRight, LucideIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    arrowHref?: string;
    loading?: boolean;
    lastUsed?: string;
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    iconColor = 'text-foreground',
    iconBg = 'bg-foreground/5',
    arrowHref,
    loading = false,
    lastUsed = "2 hours ago",
}: StatCardProps) {
    return (
        <div className="p-4 md:p-6 bg-card rounded-[18px] border border-border hover:border-foreground/10 hover:shadow-sm transition-all duration-300 group">
            <div className="flex flex-col h-full">
                {/* Top Row: Icon and Link Arrow */}
                <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center transition-transform group-hover:scale-105 duration-300`}>
                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    {arrowHref && (
                        <Link 
                            href={arrowHref}
                            className="p-2 rounded-lg bg-foreground/5 text-muted hover:bg-foreground/10 hover:text-foreground transition-all duration-200"
                            title="View history"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                {/* Content: Title, Count, Placeholder */}
                <div className="mt-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs md:text-sm font-medium tracking-wide text-muted/80">
                            {title}
                        </h3>
                        <div className="font-mono text-3xl md:text-4xl font-semibold tracking-tight text-foreground mt-2">
                            {loading ? (
                                <div className="h-9 flex items-center">
                                    <Loader2 className="w-5 h-5 animate-spin text-muted/50" />
                                </div>
                            ) : (
                                value
                            )}
                        </div>
                    </div>
                    
                    <p className="text-xs text-muted/50 mt-3">
                        Last used {lastUsed}
                    </p>
                </div>
            </div>
        </div>
    );
}
