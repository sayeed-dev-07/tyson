"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

const About = () => {
    const aboutRef = useRef<HTMLDivElement>(null);
    const revealTextRef = useRef<HTMLHeadingElement>(null);

    // We animate the wrapper divs rather than the Next.js Image directly to avoid prop conflicts
    const leftImageRef = useRef<HTMLDivElement>(null);
    const rightImageRef = useRef<HTMLDivElement>(null);

    const images = [
        {
            src: '/computer.png',
            alt: 'computer'
        },
        {
            src: '/idea.png',
            alt: 'idea'
        },
    ];

    useGSAP(() => {
        // 1. Text Reveal Animation (Keeps scrub)
        gsap.to(revealTextRef.current,
            {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: {
                    trigger: aboutRef.current,
                    start: "top 75%",
                    end: "bottom 75%",
                    scrub: 0.5,
                }
            }
        );

        // 2. Left Image - Scale & Rotate (NO SCRUB - Plays automatically when triggered)
        gsap.fromTo(leftImageRef.current,
            { scale: 0, rotation: -15 },
            {
                scale: 1,
                rotation: -5,
                duration: 1,
                ease: "back.out(1.5)", // Gives it a nice bouncy pop-in
                scrollTrigger: {
                    trigger: aboutRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // 3. Left Image - Vertical Parallax (Keeps scrub for scroll movement)
        gsap.fromTo(leftImageRef.current,
            { y: 50 },
            {
                y: -100,
                ease: "none",
                scrollTrigger: {
                    trigger: aboutRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                }
            }
        );

        // 4. Right Image - Scale & Rotate (NO SCRUB)
        gsap.fromTo(rightImageRef.current,
            { scale: 0, rotation: 15 },
            {
                scale: 1,
                rotation: 5,
                duration: 1,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: aboutRef.current,
                    start: "top 60%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // 5. Right Image - Fast Vertical Parallax (Keeps scrub, moves much faster)
        gsap.fromTo(rightImageRef.current,
            { y: 150 },
            {
                y: -150, // Larger negative value makes it travel faster upward
                ease: "none",
                scrollTrigger: {
                    trigger: aboutRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                }
            }
        );

    }, { scope: aboutRef });

    return (
        <section
            ref={aboutRef}
            className="min-h-screen flex items-center justify-center relative py-20 px-4 overflow-hidden"
        >
            {/* 
              Responsive Image Wrappers: 
              Using percentages for left/right to keep them closer to the text.
              Widths adjust from mobile (w-20) to tablet (w-32) to desktop (w-48).
            */}

            {/* Left Image - Higher up, left side */}
            <div
                ref={leftImageRef}
                className="absolute left-[5%] sm:left-[15%] lg:left-[15%] top-[25%] w-20 md:w-32 lg:w-48 z-0 pointer-events-none opacity-80"
            >
                <Image
                    src={images[0].src}
                    alt={images[0].alt}
                    width={200}
                    height={200}
                    className="w-full h-auto object-contain"
                />
            </div>

            {/* Right Image - Lower down, right side */}
            <div
                ref={rightImageRef}
                className="absolute  right-[5%] sm:right-[10%] xl:right-[15%] top-[65%] w-20 md:w-32 lg:w-48 z-0 pointer-events-none opacity-80"
            >
                <Image
                    src={images[1].src}
                    alt={images[1].alt}
                    width={200}
                    height={200}
                    className="w-full h-auto object-contain"
                />
            </div>

            {/* Text Container */}
            <div
                className="relative w-full max-w-[1200px] mx-auto text-center font-bold uppercase leading-[0.9] tracking-tighter z-10"
                style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
            >
                {/* The Base Text (Dark Grey) */}
                <h1 className="text-[#333333] font-primary m-0">
                    3 years<br />
                    crafting<br />
                    front-end<br />
                    experiences
                </h1>

                {/* The Reveal Text (Red) */}
                <h1
                    ref={revealTextRef}
                    className="text-[#ff4d4d] font-primary m-0 absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ willChange: 'clip-path', clipPath: "inset(0% 0% 100% 0%)" }}
                    aria-hidden="true"
                >
                    3 years<br />
                    crafting<br />
                    front-end<br />
                    experiences
                </h1>
            </div>
        </section>
    );
};

export default About;