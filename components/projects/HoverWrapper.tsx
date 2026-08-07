/* eslint-disable react-hooks/refs */
'use client'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react';

interface AnimatedHoverWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;    // Container styles (default background, padding, layout, etc.)
    fillClass?: string;    // Background color class for the sliding layer
    contentClass?: string; // Classes for the inner content (text color, layout)
}

const AnimatedHoverWrapper: React.FC<AnimatedHoverWrapperProps> = ({
    children,
    className = '',
    fillClass = 'bg-foreground', // Default slide-in color
    contentClass = '',
    onMouseEnter,
    onMouseLeave,
    ...props
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgColorRef = useRef<HTMLDivElement>(null);
    const tl = useRef<GSAPTimeline | null>(null);

    const { contextSafe } = useGSAP(() => {
        if (!containerRef.current || !bgColorRef.current) return;

        // Initialize GSAP matchMedia
        const mm = gsap.matchMedia();

        // Target screens md and up (>= 768px)
        mm.add("(min-width: 768px)", () => {
            tl.current = gsap.timeline({ paused: true });

            tl.current.to(bgColorRef.current, {
                x: 0,
                duration: 0.3,
                ease: 'expo.out'
            });

            // Cleanup when the window resizes below 768px
            return () => {
                tl.current = null;
            };
        });

    }, { scope: containerRef });

    // Safely combine our GSAP hover logic with any hover events passed via props
    const mouseHoverIn = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
        // tl.current will be null on mobile, so the optional chaining ignores the play() call
        tl.current?.play();
        if (onMouseEnter) onMouseEnter(e);
    });

    const mouseHoverOut = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
        tl.current?.reverse();
        if (onMouseLeave) onMouseLeave(e);
    });

    return (
        <div
            ref={containerRef}
            onMouseEnter={mouseHoverIn}
            onMouseLeave={mouseHoverOut}
            // 'group' is added here so inner text can react to hover state
            className={`relative overflow-hidden group ${className}`}
            {...props} // Passes down onClick, styles, aria-labels, etc.
        >
            {/* Sliding Background Layer */}
            <div
                ref={bgColorRef}
                className={`absolute inset-0 h-full w-full -translate-x-full z-0 ${fillClass}`}
            />

            {/* Content Layer */}
            <div className={`relative z-10 transition-colors duration-300 ${contentClass}`}>
                {children}
            </div>
        </div>
    );
};

export default AnimatedHoverWrapper;