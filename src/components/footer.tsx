import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full py-6 px-6 mt-auto border-t border-border bg-card backdrop-blur-md">
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">

                {/* Copyright Section */}
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted font-light tracking-wider uppercase">
                            &copy; {new Date().getFullYear()}
                        </span>
                        <span className="text-sm text-foreground font-bold tracking-tight">
                            Prismo
                        </span>
                    </div>
                    <p className="text-[10px] text-muted/60 font-medium tracking-widest uppercase">
                        All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
