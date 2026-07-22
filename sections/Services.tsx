/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { BlockRevealText } from '@/components/normal/BlockRevealText';

gsap.config({ force3D: true })

const servicesData = [
    {
        title: "Portfolio Design",
        offset: "self-start md:ml-[5vw]",
        image: "https://i.pinimg.com/736x/c2/bb/b7/c2bbb72be1419daa6106af4883ffaf47.jpg"
    },
    {
        title: "Landing Page Design",
        offset: "self-end text-right md:mr-[8vw]",
        image: "https://i.pinimg.com/1200x/21/c7/cb/21c7cb15c9ce4dce2bf70ab983cd3de7.jpg"
    },
    {
        title: "Development",
        offset: "self-start md:ml-[25vw]",
        image: "https://i.pinimg.com/1200x/05/39/66/053966815cf6c612a98ccb7497fd1191.jpg"
    }
];

const howIWorkText = `
I'm not a founder, a CEO, or a strategist hiding behind a title. I'm just a creator. Someone who designs, builds, and thinks in equal measure, and uses that to walk brands through every stage of their growth, from the first idea on a blank page to the moment a finished site goes live. I'm not here to chase trends or pile on deliverables. I'm here to take what makes a brand itself and bring it into the digital world with the care it deserves. Work that lifts the brand it belongs to, not just decorates it.
`;

const ExpertisePage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const hoverImageRef = useRef<HTMLImageElement>(null);

    useGSAP(() => {
        if (!pageRef.current || !hoverImageRef.current) return;

        // Initialize GSAP matchMedia
        const mm = gsap.matchMedia();

        // Only run this GSAP logic on screens 768px and wider (md breakpoint)
        mm.add("(min-width: 768px)", () => {
            const imageEl = hoverImageRef.current;
            const items = gsap.utils.toArray<HTMLElement>('.service-title-wrapper');

            // Set the initial hidden state for the image safely within the matchMedia context
            gsap.set(imageEl, { scale: 0, autoAlpha: 0 });

            const onMouseMove = (e: MouseEvent) => {
                gsap.to(imageEl, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            };

            const onMouseEnter = (e: MouseEvent) => {
                const target = e.currentTarget as HTMLElement;
                const imgUrl = target.dataset.image; // Read the image URL from the DOM

                if (imgUrl && imageEl) {
                    imageEl.src = imgUrl; // Update image directly (skips React renders)
                }

                gsap.to(imageEl, { scale: 1, autoAlpha: 1, duration: 0.5 });
            };

            const onMouseLeave = () => {
                gsap.to(imageEl, { scale: 0, autoAlpha: 0, duration: 0.5 });
            };

            // Attach listeners natively
            pageRef.current?.addEventListener('mousemove', onMouseMove);
            items.forEach(item => {
                item.addEventListener('mouseenter', onMouseEnter);
                item.addEventListener('mouseleave', onMouseLeave);
            });

            // This cleanup function is automatically called by matchMedia when resizing below 768px
            return () => {
                pageRef.current?.removeEventListener('mousemove', onMouseMove);
                items.forEach(item => {
                    item.removeEventListener('mouseenter', onMouseEnter);
                    item.removeEventListener('mouseleave', onMouseLeave);
                });
            };
        });

    }, { scope: pageRef });

    return (
        <div ref={pageRef} className=" text-[#f4f1de] font-primary min-h-screen relative overflow-hidden px-4 md:px-12 lg:px-24">

            <img
                ref={hoverImageRef}
                src={servicesData[0].image} // Placeholder for first load
                alt="Service Preview"
                // Removed Tailwind transitions as GSAP controls the fading now. 
                // Kept `hidden md:block` as a safeguard so it doesn't flash on mobile before JS runs.
                className="hidden  md:block fixed top-0 left-0 aspect-square h-[20rem] object-contain z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform"
            />

            {/* --- Main Content Section --- */}
            <main className="flex flex-col md:flex-row flex-wrap gap-12 py-12 md:py-32 md:px-0 w-full">

                <BlockRevealText text='(Services)' textClassName='font-classic text-xs font-bold uppercase tracking-widest text-coral pt-3 md:sticky md:top-[10svh]' />

                <div className="flex flex-col gap-10 md:gap-16 flex-1 w-full">
                    {servicesData.map((service, index) => (
                        <div
                            key={index}
                            data-image={service.image} // Add data-image so GSAP can grab it dynamically
                            className={`service-title-wrapper w-fit px-2 md:px-0 ${service.offset}`}
                        // React onMouseEnter / onMouseLeave removed entirely; handled cleanly by GSAP matchMedia above
                        >
                            <BlockRevealText
                                text={service.title}
                                textClassName="font-primary font-black uppercase leading-[0.76] tracking-[-0.03em] text-[#f4f1de] transition-colors duration-300 hover:text-white text-[clamp(2.5rem,10vw,9rem)]"
                                containerClassName="will-change-transform"
                                blockColor="#D2FF00"
                            />
                        </div>
                    ))}
                </div>
            </main>

            {/* --- Description & How I Work --- */}
            <footer className="py-6 md:py-32 flex justify-end">
                <div className=" ml-auto w-full md:w-[60%] lg:w-[45%] flex flex-col gap-4 will-change-transform">
                    <BlockRevealText
                        text="HOW I WORK"
                        textClassName="font-black  font-primary text-4xl uppercase tracking-tight text-coral"
                        containerClassName="mb-4"
                        blockColor="#D2FF00"
                    />

                    <BlockRevealText text={howIWorkText} textClassName='font-classic  text-base md:text-lg leading-tight text-start text-[#f4f1de]/70' blockColor='#F4F1DE' />
                </div>
            </footer>
        </div>
    );
};

export default ExpertisePage;