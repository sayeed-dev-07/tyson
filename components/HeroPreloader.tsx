'use client'

import { useEffect, useState } from 'react';

type HeroPreloaderProps = {
    onComplete: () => void;
};

const HeroPreloader = ({ onComplete }: HeroPreloaderProps) => {
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        let exitTimer: number;
        let isMounted = true;

        const startExitSequence = () => {
            if (!isMounted) return;

            setIsLeaving(true);

            // Wait for the 500ms Tailwind fade-out transition to finish before unmounting
            exitTimer = window.setTimeout(() => {
                if (isMounted) onComplete();
            }, 500);
        };

        const executePreloader = async () => {
            // Determine screen size (Tailwind 'md' breakpoint is 768px)
            // This safely runs only on the client because it's inside useEffect
            const isMdOrLarger = window.matchMedia('(min-width: 768px)').matches;
            const requiredWaitTime = isMdOrLarger ? 3000 : 5000;

            // Promise 1: The mandatory minimum wait time based on screen size
            const minimumWaitTime = new Promise(resolve => setTimeout(resolve, requiredWaitTime));

            // Promise 2: Wait for fonts and window assets to finish downloading
            const assetsLoaded = new Promise<void>((resolve) => {
                const checkLoad = async () => {
                    await document.fonts?.ready;
                    if (document.readyState === 'complete') {
                        resolve();
                    } else {
                        window.addEventListener('load', () => resolve(), { once: true });
                    }
                };

                checkLoad();

                // Safety fallback: If assets take way too long (e.g., hanging image), 
                // force the load promise to resolve after 10 seconds anyway.
                setTimeout(resolve, 10000);
            });

            // This tells the browser: Do not move to the next line until BOTH 
            // the dynamic timer is done AND the assets are loaded.
            await Promise.all([minimumWaitTime, assetsLoaded]);

            startExitSequence();
        };

        executePreloader();

        return () => {
            isMounted = false;
            window.clearTimeout(exitTimer);
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