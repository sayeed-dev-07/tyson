'use client'

import { useEffect, useState } from 'react';

type HeroPreloaderProps = {
    onComplete: () => void;
};

const HeroPreloader = ({ onComplete }: HeroPreloaderProps) => {
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        const holdTimer = window.setTimeout(() => {
            setIsLeaving(true);
        }, 1650);

        const exitTimer = window.setTimeout(() => {
            onComplete();
        }, 3100);

        return () => {
            window.clearTimeout(holdTimer);
            window.clearTimeout(exitTimer);
        };
    }, [onComplete]);

    return (
        <div
            className={`absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-500 ease-out ${isLeaving ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="h-1 w-24 overflow-hidden bg-white/15">
                <div className="h-full w-full origin-left animate-[hero-preloader_0.9s_ease-in-out_infinite] bg-[#F05641]" />
            </div>
        </div>
    );
};

export default HeroPreloader;
