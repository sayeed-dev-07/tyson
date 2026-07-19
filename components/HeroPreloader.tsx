'use client'

import { useEffect, useState } from 'react';

type HeroPreloaderProps = {
    onComplete: () => void;
};

const HeroPreloader = ({ onComplete }: HeroPreloaderProps) => {
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        let exitTimer: number;
        let safetyTimer: number;
        let isMounted = true;

        const startExitSequence = () => {
            if (!isMounted) return;

            setIsLeaving(true);

            // Wait for the 500ms Tailwind fade-out transition to finish before unmounting
            exitTimer = window.setTimeout(() => {
                if (isMounted) onComplete();
            }, 500);
        };

        const handleLoad = async () => {
            // Wait for custom fonts to load (crucial for your GSAP text measuring)
            await document.fonts?.ready;

            // If the page is already fully loaded by the time this runs
            if (document.readyState === 'complete') {
                startExitSequence();
            } else {
                // Otherwise, wait for the window load event (images, iframes, etc.)
                window.addEventListener('load', startExitSequence);
            }
        };

        handleLoad();

        // Safety fallback: if a resource hangs on a slow network, don't trap the user forever.
        // Force the preloader to exit after 8 seconds.
        safetyTimer = window.setTimeout(() => {
            window.removeEventListener('load', startExitSequence);
            startExitSequence();
        }, 8000);

        return () => {
            isMounted = false;
            window.removeEventListener('load', startExitSequence);
            window.clearTimeout(exitTimer);
            window.clearTimeout(safetyTimer);
        };
    }, [onComplete]);

    return (
        <div
            className={`absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-500 ease-out ${isLeaving ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <div className="h-1 w-24 overflow-hidden bg-white/15">
                <div className="h-full w-full origin-left animate-[hero-preloader_0.9s_ease-in-out_infinite] bg-[#F05641]" />
            </div>
        </div>
    );
};

export default HeroPreloader;