'use client';

import { useRef, useEffect } from 'react';
import { ReactLenis, useLenis, type LenisRef } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// 1. Create the scroll reset component
function ScrollRestoration() {
    const lenis = useLenis();

    useEffect(() => {
        if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        }
    }, [lenis]);

    return null;
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<LenisRef>(null);

    useGSAP(() => {
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }
        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    return (
        <ReactLenis
            root
            ref={lenisRef}
            autoRaf={false}
            options={{ lerp: 0.1, duration: 1.2 }}
        >
            {/* 2. Insert the reset component inside the Lenis context */}
            <ScrollRestoration />
            {children}
        </ReactLenis>
    );
}