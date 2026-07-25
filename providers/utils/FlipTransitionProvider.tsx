'use client'
import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

type TransitionData = {
    id: string;
    imgSrc: string;
    name: string;
    imgRect: DOMRect;
};

// Only targeting the image now
type Targets = { img: HTMLElement };

const FlipCtx = createContext<{
    startTransition: (data: TransitionData) => void;
    playTransition: (id: string, targets: Targets, onDone: () => void) => boolean;
} | null>(null);

export const useFlipTransition = () => {
    const ctx = useContext(FlipCtx);
    if (!ctx) throw new Error('useFlipTransition must be used inside FlipTransitionProvider');
    return ctx;
};

export function FlipTransitionProvider({ children }: { children: React.ReactNode }) {
    const dataRef = useRef<TransitionData | null>(null);
    const imgGhost = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<TransitionData | null>(null);

    const startTransition = useCallback((d: TransitionData) => {
        dataRef.current = d;
        setData(d);
    }, []);

    const playTransition = useCallback((id: string, targets: Targets, onDone: () => void) => {
        const d = dataRef.current;
        if (!d || d.id !== id) return false;

        // wait a frame so the ghost exists in the DOM
        requestAnimationFrame(() => {
            // 1. Safety check for the ref
            if (!imgGhost.current) {
                dataRef.current = null;
                setData(null);
                onDone();
                return;
            }

            const tl = gsap.timeline({
                onComplete: () => {
                    dataRef.current = null;
                    setData(null);
                    onDone();
                },
            });

            // 2. Store the tween in a variable
            const flipTween = Flip.fit(imgGhost.current, targets.img, {
                duration: 0.7,
                ease: 'power3.inOut',
                absolute: true,
                scale: true,
            });

            // 3. Add to timeline only if it's a valid Tween to satisfy TypeScript
            if (flipTween) {
                tl.add(flipTween as gsap.core.Tween);
            }
        });

        return true;
    }, []);

    return (
        <FlipCtx.Provider value={{ startTransition, playTransition }}>
            {children}
            {data && (
                <div
                    ref={imgGhost}
                    style={{
                        position: 'fixed', zIndex: 999, pointerEvents: 'none', overflow: 'hidden',
                        top: data.imgRect.top, left: data.imgRect.left,
                        width: data.imgRect.width, height: data.imgRect.height,
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.imgSrc} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}
        </FlipCtx.Provider>
    );
}