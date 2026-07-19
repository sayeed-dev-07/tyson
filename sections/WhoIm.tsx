'use client'

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.config({
    force3D: true
})

const WhoIm = () => {
    const tallContainerRef = useRef<HTMLDivElement>(null);
    const topTextRef = useRef<HTMLHeadingElement>(null);
    const middleTextRef = useRef<HTMLHeadingElement>(null);
    const bottomTextRef = useRef<HTMLHeadingElement>(null);
    const mergedWrapperRef = useRef<HTMLDivElement>(null);
    const bioTextRef = useRef<HTMLDivElement>(null);

    const bioLines = ["Web Developer", "Engineer", "Gamer"];

    useGSAP(() => {
        gsap.set(topTextRef.current, { yPercent: -75, x: "-100vw" });
        gsap.set(middleTextRef.current, { yPercent: 0, x: "100vw" });
        gsap.set(bottomTextRef.current, { yPercent: 75, x: "-100vw" });
        gsap.set(bioTextRef.current, { opacity: 0, y: 50 });
        gsap.set('.bio-cover', { clipPath: "inset(0% 0% 0% 0%)" });

        const mm = gsap.matchMedia();

        mm.add(
            {
                isMobile: "(max-width: 767px)",
                isTablet: "(min-width: 768px) and (max-width: 1279px)",
                isDesktop: "(min-width: 1280px)",
            },
            (context) => {
                const { isMobile, isTablet } = context.conditions as {
                    isMobile: boolean;
                    isTablet: boolean;
                };

                // Bigger shrink target on small screens so final px size stays legible
                const shrinkScale = isMobile ? 0.35 : isTablet ? 0.22 : 0.30;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: tallContainerRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1,
                    }
                });

                tl.to([topTextRef.current, middleTextRef.current, bottomTextRef.current], {
                    x: 0,
                    duration: 1.5,
                    ease: "power2.out"
                }, "slideIn")
                    .to([topTextRef.current, bottomTextRef.current], {
                        yPercent: 0,
                        duration: 1,
                        ease: "power2.inOut"
                    }, "+=0.2")
                    .to(mergedWrapperRef.current, {
                        scale: shrinkScale,
                        y: "-25vh",
                        duration: 1.5,
                        ease: "power2.inOut"
                    }, "+=0.2")
                    .to(bioTextRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power2.out",
                        onStart: () => {
                            gsap.to('.bio-cover', {
                                clipPath: "inset(0% 0% 0% 100%)",
                                duration: 0.8,
                                stagger: 0.2,
                                ease: "power3.inOut",
                                overwrite: "auto"
                            });
                        },
                        onReverseComplete: () => {
                            gsap.to('.bio-cover', {
                                clipPath: "inset(0% 0% 0% 0%)",
                                duration: 0.4,
                                ease: "power2.inOut",
                                overwrite: "auto"
                            });
                        }
                    }, ">");


            }
        );
    }, { scope: tallContainerRef });

    return (
        <section
            ref={tallContainerRef}
            className="relative w-full h-[400vh]"
        >
            <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center font-primary ">

                <div
                    ref={mergedWrapperRef}
                    className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none font-secondary will-change-transform"
                >
                    <h1 ref={topTextRef} className="text-[clamp(2.5rem,18vw,20rem)] absolute text-[#FBA555]  font-black uppercase leading-none  m-0 p-0 will-change-transform whitespace-nowrap">
                        WHO I AM ?
                    </h1>
                    <h1 ref={middleTextRef} className="text-[clamp(2.5rem,18vw,20rem)] absolute text-[#FBA555]  font-black uppercase leading-none  m-0 p-0 will-change-transform whitespace-nowrap">
                        WHO I AM ?
                    </h1>
                    <h1 ref={bottomTextRef} className="absolute text-[clamp(2.5rem,18vw,20rem)] text-[#FBA555]  font-black uppercase leading-none  m-0 p-0 will-change-transform whitespace-nowrap">
                        WHO I AM ?
                    </h1>
                </div>

                <div
                    ref={bioTextRef}
                    className="absolute inset-0 top-[0%] sm:top-[10%] flex flex-col items-center justify-center gap-2 z-20 pointer-events-none will-change-transform"
                >
                    {bioLines.map((text, index) => (
                        <div key={index} className="relative w-max overflow-hidden px-2">
                            <h2 className=" font-bold uppercase leading-[0.9] font-primary text-[#f4f1de] m-0" style={{ fontSize: "clamp(2.5rem, 10vw, 9rem)" }}>
                                {text}
                            </h2>
                            <div
                                className="bio-cover absolute inset-0 bg-[#D2FF00] z-10"
                                aria-hidden="true"
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default WhoIm;