/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { BlockRevealText } from '@/components/normal/BlockRevealText';

const NotFoundPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const errorTextRef = useRef<HTMLDivElement>(null);
    const linkRef = useRef<HTMLAnchorElement>(null);

    useGSAP(() => {
        if (!pageRef.current || !errorTextRef.current || !linkRef.current) return;

        // --- 1. "404" Entrance Animation ---
        const characters = errorTextRef.current.querySelectorAll('.error-char');
        const tl = gsap.timeline();

        // Initial State
        gsap.set(characters, { y: 150, autoAlpha: 0, rotate: 10 });
        gsap.set(linkRef.current, { autoAlpha: 0, y: 20 });

        // Staggered slide up for characters
        tl.to(characters, {
            y: 0,
            autoAlpha: 1,
            rotate: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'back.out(1.5)',
        })
            // Fade in the link
            .to(linkRef.current, {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
            }, "-=0.4");


        // --- 2. Modern Magnetic Button Animation ---
        const btn = linkRef.current;

        const onMouseMove = (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            // Calculate distance from center of the button
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);

            // Move the button a fraction of the distance towards the mouse
            gsap.to(btn, {
                x: x * 0.3, // Strength of the magnetic pull (x-axis)
                y: y * 0.3, // Strength of the magnetic pull (y-axis)
                duration: 0.6,
                ease: 'power3.out',
                overwrite: "auto"
            });
        };

        const onMouseLeave = () => {
            // Snap back to original position with an elastic bounce
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.3)',
                overwrite: "auto"
            });
        };

        btn.addEventListener('mousemove', onMouseMove);
        btn.addEventListener('mouseleave', onMouseLeave);

        return () => {
            btn.removeEventListener('mousemove', onMouseMove);
            btn.removeEventListener('mouseleave', onMouseLeave);
        };

    }, { scope: pageRef });

    return (
        <div ref={pageRef} className="text-[#f4f1de] font-primary min-h-screen relative overflow-hidden px-4 md:px-12 lg:px-24 flex flex-col justify-center items-center">

            <main className="flex flex-col items-center justify-center gap-12 py-24 md:py-32 w-full max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw]">

                {/* --- Main 404 Text Section (Now Flex Row) --- */}
                <div
                    ref={errorTextRef}
                    className="flex justify-center items-center gap-4 md:gap-8 font-primary font-black uppercase text-center leading-[0.76] tracking-[-0.03em] text-[#f4f1de]"
                >
                    <span className="error-char text-[clamp(6rem,18vw,18rem)] will-change-transform">4</span>
                    <span className="error-char text-[clamp(6rem,18vw,18rem)] will-change-transform">0</span>
                    <span className="error-char text-[clamp(6rem,18vw,18rem)] will-change-transform">4</span>
                </div>

                {/* --- Description Paragraph --- */}
                <div className="flex justify-center w-full">
                    <BlockRevealText
                        text="This area of the digital space seems to be empty. Don't worry, even creators lose their way sometimes."
                        textClassName="font-classic text-lg md:text-xl lg:text-2xl leading-snug text-center text-[#f4f1de]/80"
                        containerClassName="max-w-[70vw] md:max-w-[40vw] lg:max-w-[30vw] flex justify-center text-center"
                        blockColor="#D2FF00"
                    />
                </div>

                {/* --- Back to Home Link (Magnetic GSAP Target) --- */}
                <Link
                    ref={linkRef}
                    href="/"
                    className="mt-4 px-10 py-5 font-classic text-xl font-medium tracking-tight bg-[#f4f1de] text-black rounded-full flex justify-center items-center gap-2 will-change-transform hover:bg-[#D2FF00] transition-colors duration-300"
                >
                    <span>Back to Home</span>
                    <span className="text-2xl mb-1">→</span>
                </Link>

            </main>

        </div>
    );
};

export default NotFoundPage;