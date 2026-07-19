'use client'

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import Link from 'next/link';
import { BlockRevealText } from '@/components/normal/BlockRevealText';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export interface ProjectType {
    id: string;
    name: string;
    type: string;
    tech: string[];
    live: string;
    img: string;
    themeColor: string;
    textColor: string
}

export const projectData: ProjectType[] = [
    {
        id: 'msr-portfolio',
        name: 'MSR Portfolio',
        type: 'Interactive Experience',
        tech: ['React', 'Next.js', 'GSAP', 'Lenis'],
        live: 'https://portfolio-gules-chi-w96bn9yl4m.vercel.app/',
        img: '/projectImg/msrImg.PNG',
        themeColor: '#D2FF00',
        textColor: '#0e0e0e'
    },
    {
        id: 'anisearch',
        name: 'AniSearch',
        type: 'Web Application',
        tech: ['React', 'Next.js', 'GSAP', 'Framer Motion', 'TanStack Query', 'Lenis', 'shadcn/ui', 'TypeScript'],
        live: 'https://anime-vault-nextjs-ts.vercel.app/',
        img: '/projectImg/anisearch.PNG',
        themeColor: '#F4F1DE',
        textColor: '#0e0e0e'
    },
    {
        id: 'sellora',
        name: 'Sellora',
        type: 'E-commerce Platform',
        tech: ['React', 'Next.js', 'GSAP', 'Framer Motion', 'TypeScript'],
        live: 'https://sellora-theta.vercel.app/',
        img: '/projectImg/sellora.PNG',
        themeColor: '#FBA555',
        textColor: '#0e0e0e'
    },
    {
        id: 'no-good-co',
        name: 'No Good Co.',
        type: 'Corporate Site',
        tech: ['React', 'Next.js', 'GSAP', 'TypeScript'],
        live: 'https://no-good-co.vercel.app/',
        img: '/projectImg/nogood.PNG',
        themeColor: '#F05641',
        textColor: '#f4f1de'
    }
];

const Projects = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // --- 1. INTRO ANIMATIONS (Unchanged) ---
        const introCovers = gsap.utils.toArray('.intro-cover');
        gsap.set(introCovers, { clipPath: 'inset(0% 0% 0% 0%)' });

        gsap.to(introCovers, {
            scrollTrigger: {
                trigger: ".projects-intro",
                start: "top 80%",
            },
            clipPath: "inset(0% 0% 0% 100%)",
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.inOut"
        });

        // --- 2. GRID CARD SCROLL REVEAL (Unchanged) ---
        const cards = gsap.utils.toArray('.project-card');

        cards.forEach((card: any) => {
            const imgCover = card.querySelector('.img-cover');
            gsap.set(imgCover, { clipPath: 'inset(0% 0% 0% 0%)' });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });

            tl.to(imgCover, {
                clipPath: "inset(0% 0% 100% 0%)",
                duration: 1.2,
                ease: "power3.inOut"
            })
        });

        // --- 3. RESPONSIVE HOVER LOGIC (The Fix) ---
        const mm = gsap.matchMedia();

        // Target (isMD): Screens >= 768px (Desktop hover behavior)
        mm.add("(min-width: 768px)", () => {
            cards.forEach((card: any) => {
                const hoverBg = card.querySelector('.card-hover-bg');

                // Initial State: Hidden to the left
                gsap.set(hoverBg, { xPercent: -100 });

                // Create Event Listeners for Hover
                const onMouseEnter = () => {
                    gsap.to(hoverBg, {
                        xPercent: 0,
                        duration: 0.3,
                        ease: "cubic-bezier(0.7, 0, 0.3, 1)" // Match original CSS ease
                    });
                };

                const onMouseLeave = () => {
                    gsap.to(hoverBg, {
                        xPercent: -100,
                        duration: 0.3,
                        ease: "cubic-bezier(0.7, 0, 0.3, 1)"
                    });
                };

                // Add Listeners
                card.addEventListener('mouseenter', onMouseEnter);
                card.addEventListener('mouseleave', onMouseLeave);

                // Cleanup function: GSAP matchMedia handles calling this on breakpoint change
                return () => {
                    card.removeEventListener('mouseenter', onMouseEnter);
                    card.removeEventListener('mouseleave', onMouseLeave);
                };
            });
        });

        // Target (isMobile): Screens < 768px (Always visible)
        mm.add("(max-width: 767px)", () => {
            cards.forEach((card: any) => {
                const hoverBg = card.querySelector('.card-hover-bg');
                // Force it to stay visible
                gsap.set(hoverBg, { xPercent: 0 });
            });
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full px-3 sm:px-8 font-primary py-24 md:py-32">

            {/* --- INTRO SECTION --- */}
            <div className="projects-intro mb-20">
                <BlockRevealText
                    text="SELECTED WORKS"
                    textClassName="font-black text-coral uppercase leading-[0.85] tracking-tighter text-[#f4f1de] text-[12vw] md:text-[8vw] lg:text-[7vw]"
                    containerClassName="mb-10 max-w-[200px] sm:max-w-none"
                    blockColor="#D2FF00"
                />
                <BlockRevealText
                    text="A curated selection of my recent front-end development, structural design, and interactive web experiences."
                    textClassName="text-[#f4f1de] font-classic text-sm md:text-lg lg:text-xl font-bold leading-tight"
                    containerClassName="max-w-[300px] sm:max-w-[400px]"
                    blockColor="#f4f1de"
                />
            </div>

            {/* --- GRID SECTION --- */}
            <div className="sm:px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
                    {projectData.map((project) => (
                        <Link
                            href={`/projects/${project.id}`}
                            key={project.id}
                            // Simplified classes: Removed CSS transitions/hover here
                            className="project-card group relative block w-full outline-none overflow-hidden p-3 sm:p-4 md:p-6 lg:p-8 bg-transparent"
                        >
                            {/* 
                                The Background Sweep (Moved logic to GSAP)
                                FIX: Added '.card-hover-bg' class. Removed '-translate-x-full', 
                                'transition-transform', 'duration-500', 'ease...', and 'group-hover:translate-x-0'
                            */}
                            <div
                                className="card-hover-bg absolute inset-0 origin-left z-0"
                                style={{ backgroundColor: project.themeColor }}
                            />

                            {/* Card Image */}
                            <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#111] z-10">
                                <div className="img-cover absolute inset-0 z-20 pointer-events-none" style={{ backgroundColor: project.themeColor }} />
                                <div className="absolute inset-0 bg-black/40 z-10 mix-blend-multiply pointer-events-none transition-opacity duration-500 group-hover:opacity-10" />
                                <Image
                                    src={project.img}
                                    alt={project.name}
                                    fill
                                    className="object-cover object-top opacity-90 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 group-hover:opacity-100"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>

                            {/* Overlapping Labels */}
                            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 flex flex-col items-end z-20 pointer-events-none">
                                {/* Title Block */}
                                <div className="relative overflow-hidden w-max " style={{ backgroundColor: project.themeColor }}>
                                    <h2 className="relative z-10 px-4 py-2 md:px-5 md:py-3 text-lg md:text-2xl lg:text-3xl font-black uppercase leading-none tracking-tighter m-0" style={{ color: project.textColor }}>
                                        {project.name}
                                    </h2>
                                </div>
                                {/* Type / Category Block */}
                                <div className="relative overflow-hidden w-max" style={{ backgroundColor: project.themeColor }}>
                                    <h3 className="relative z-10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold uppercase leading-none tracking-widest m-0" style={{ color: project.textColor }}>
                                        {project.type}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;