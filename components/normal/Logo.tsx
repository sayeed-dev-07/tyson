'use client'
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation'; // 1. Import usePathname

// Register both plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(SplitText, ScrollTrigger);
}

const AnimatedLogo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname(); // 2. Get the current route

    useGSAP(() => {
        // 3. Determine if we are on the root page
        const isHomePage = pathname === '/';

        // Prevent FOUC
        gsap.set(containerRef.current, { opacity: 1 });

        // Split the text
        const split = new SplitText('.logo-text', {
            type: 'chars',
            charsClass: 'logo-char block leading-none'
        });

        // Dynamically wrap each character
        split.chars.forEach((charEl) => {
            const colContainer = document.createElement('div');
            colContainer.className = 'flex flex-col ';

            const charMask = document.createElement('div');
            charMask.className = 'overflow-hidden pt-1 pb-1 px-1';

            const underlineMask = document.createElement('div');
            underlineMask.className = 'h-[4px] md:h-[4px] w-full overflow-hidden px-1';

            const underline = document.createElement('div');
            underline.className = 'logo-underline h-full w-full bg-[#F4F1DE] rounded-sm';

            if (charEl.parentNode) {
                charEl.parentNode.insertBefore(colContainer, charEl);
            }
            charMask.appendChild(charEl);
            underlineMask.appendChild(underline);
            colContainer.appendChild(charMask);
            colContainer.appendChild(underlineMask);
        });

        // Set initial animation states
        gsap.set('.logo-char', { yPercent: 130 });
        gsap.set('.logo-underline', { xPercent: -145 });

        // 4. Build Timeline conditionally
        const tl = gsap.timeline({
            // Only add scrollTrigger if we are on the home page
            ...(isHomePage && {
                scrollTrigger: {
                    start: () => window.innerHeight,
                    toggleActions: "play reverse play reverse",
                }
            }),
            defaults: { ease: 'back.out' },
            // Optional: Add a slight delay on other pages so the animation plays smoothly after page load
            delay: isHomePage ? 0 : 0.5
        });

        tl.to('.logo-char', {
            yPercent: 0,
            duration: 0.6,
            stagger: 0.1,
        })
            .to('.logo-underline', {
                xPercent: 0,
                duration: 0.4,
                stagger: 0.1,
            }, "<0.3");

        return () => {
            split.revert();
        };

        // 5. Add pathname to dependencies so it recalculates if the route changes
    }, { scope: containerRef, dependencies: [pathname] });

    return (
        <div
            ref={containerRef}
            className="flex items-center justify-center w-fit opacity-0"
        >
            <div className="logo-text flex gap-1 font-primary text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-widest text-[#F4F1DE]">
                tyson
            </div>
        </div>
    );
};

export default AnimatedLogo;