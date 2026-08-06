'use client'

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';


gsap.config({
    force3D: true
});

interface BlockRevealTextProps {
    text: string;
    textClassName?: string;
    containerClassName?: string;
    blockColor?: string;
}

export const BlockRevealText: React.FC<BlockRevealTextProps> = ({
    text,
    textClassName = "",
    containerClassName = "",
    blockColor = "#D2FF00"
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        if (!textRef.current) return;

        // Initialize GSAP matchMedia
        const mm = gsap.matchMedia();

        // Run this logic only on screens 768px and wider (standard md breakpoint)
        mm.add("(min-width: 768px)", () => {
            // 1. Split the text into separate line elements using GSAP SplitText
            const split = new SplitText(textRef.current, { type: 'lines' });

            // 2. Prepare each line wrapper and inject the colored block
            if (split.lines) {
                split.lines.forEach((el) => {
                    // Assert the type to HTMLElement
                    const line = el as HTMLElement;

                    // Force the line div to only be as wide as the text inside it
                    line.style.width = 'fit-content';
                    line.style.position = 'relative';

                    // Create the block cover dynamically
                    const cover = document.createElement('div');
                    cover.className = 'block-cover-element absolute top-0 left-0 w-full h-full z-10';
                    cover.style.backgroundColor = blockColor;
                    cover.style.clipPath = 'inset(0% 0% 0% 0%)';

                    // Append the block directly inside the line
                    line.appendChild(cover);
                });
            }

            // 3. Animate the cover blocks
            const covers = gsap.utils.toArray('.block-cover-element', containerRef.current);

            gsap.to(covers, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                clipPath: "inset(0% 0% 0% 100%)", // Slide out to the right
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.inOut"
            });

            // 4. Cleanup when text changes or window resizes below 768px
            return () => {
                split.revert();
            };
        });

        // Cleanup the matchMedia instance on unmount
        return () => mm.revert();

    }, { scope: containerRef, dependencies: [text] });

    return (
        <div ref={containerRef} className={`relative w-fit ${containerClassName}`}>
            <h2 ref={textRef} className={` text-center ${textClassName}`}>
                {text}
            </h2>
        </div>
    );
};