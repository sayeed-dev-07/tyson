'use client'

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BlockRevealText } from '@/components/normal/BlockRevealText';
import { projectData } from '@/public/data/projectsData';
import { useFlipTransition } from '@/providers/utils/FlipTransitionProvider';

const Projects = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { startTransition } = useFlipTransition();
    const imgRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const cursorRef = useRef<HTMLDivElement>(null);

    const handleCardClick = (e: React.MouseEvent, project: typeof projectData[number]) => {
        e.preventDefault();
        const imgEl = imgRefs.current.get(project.id);
        if (!imgEl) return;

        startTransition({
            id: String(project.id),
            imgSrc: project.img,
            name: project.name,
            imgRect: imgEl.getBoundingClientRect(),
        });

        requestAnimationFrame(() => {
            router.push(`/projects/${project.id}`);
        });
    };

    useGSAP(() => {
        const cursor = cursorRef.current;

        // --- 1. INTRO ANIMATIONS ---
        const introCovers = gsap.utils.toArray<HTMLElement>('.intro-cover');
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

        // --- 2. GRID CARD SCROLL REVEAL ---
        const cards = gsap.utils.toArray<HTMLElement>('.project-card');

        cards.forEach((card) => {
            const imgCover = card.querySelector('.img-cover');
            if (!imgCover) return;
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

        // --- 3. RESPONSIVE HOVER LOGIC ---
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const cleanups: (() => void)[] = [];

            if (cursor) {
                // Set initial state
                gsap.set(cursor, {
                    autoAlpha: 0,
                    scale: 0,
                    xPercent: -50,
                    yPercent: -50,
                    transformOrigin: "center center"
                });

                // Set up snappy tracking
                const xTo = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3" });
                const yTo = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3" });

                const onMouseMove = (e: MouseEvent) => {
                    xTo(e.clientX);
                    yTo(e.clientY);
                };

                // FIX: Bind mousemove to 'window' instead of 'containerRef'
                // This ensures the cursor never gets stuck on the edge if tracking drops
                window.addEventListener('mousemove', onMouseMove);
                cleanups.push(() => window.removeEventListener('mousemove', onMouseMove));

                const onCursorEnter = (e: MouseEvent) => {
                    const target = e.currentTarget as HTMLElement;

                    cursor.style.setProperty('--cursor-bg', target.dataset.themeColor ?? '#D2FF00');
                    cursor.style.setProperty('--cursor-fg', target.dataset.textColor ?? '#0e0e0e');

                    // Instantly snap to position so it doesn't fly in from the left
                    xTo(e.clientX);
                    yTo(e.clientY);

                    gsap.to(cursor, {
                        scale: 1,
                        autoAlpha: 1,
                        duration: 0.4,
                        ease: "back.out(1.5)", // Added a slight pop effect
                        overwrite: "auto"
                    });
                };

                const onCursorLeave = () => {
                    gsap.to(cursor, {
                        scale: 0,
                        autoAlpha: 0,
                        duration: 0.3,
                        ease: "power3.inOut",
                        overwrite: "auto"
                    });
                };

                const onCursorDown = () => {
                    gsap.to(cursor, {
                        scale: 0.85,
                        duration: 0.15,
                        ease: "power2.out",
                        yoyo: true,
                        repeat: 1,
                        overwrite: "auto"
                    });
                };

                cards.forEach((card) => {
                    card.addEventListener('mouseenter', onCursorEnter);
                    card.addEventListener('mouseleave', onCursorLeave);
                    card.addEventListener('mousedown', onCursorDown);

                    cleanups.push(() => {
                        card.removeEventListener('mouseenter', onCursorEnter);
                        card.removeEventListener('mouseleave', onCursorLeave);
                        card.removeEventListener('mousedown', onCursorDown);
                    });
                });
            }

            cards.forEach((card) => {
                const hoverBg = card.querySelector('.card-hover-bg');
                if (!hoverBg) return;

                gsap.set(hoverBg, { xPercent: -100 });

                const onMouseEnter = () => {
                    gsap.to(hoverBg, {
                        xPercent: 0,
                        duration: 0.3,
                        ease: "power3.inOut",
                        overwrite: "auto"
                    });
                };

                const onMouseLeave = () => {
                    gsap.to(hoverBg, {
                        xPercent: -100,
                        duration: 0.3,
                        ease: "power3.inOut",
                        overwrite: "auto"
                    });
                };

                card.addEventListener('mouseenter', onMouseEnter);
                card.addEventListener('mouseleave', onMouseLeave);

                cleanups.push(() => {
                    card.removeEventListener('mouseenter', onMouseEnter);
                    card.removeEventListener('mouseleave', onMouseLeave);
                });
            });

            return () => {
                cleanups.forEach(cleanup => cleanup());
            };
        });

        return () => mm.revert();

    }, { scope: containerRef });

    return (
        <section id='projects' ref={containerRef} className="w-full px-3 sm:px-8 font-primary py-24 md:py-32">
            <div
                ref={cursorRef}
                className="project-hover-cursor pointer-events-none fixed left-0 top-0 z-[9998] hidden h-24 w-24 items-center justify-center rounded-full border border-[#f4f1de]/30 bg-[var(--cursor-bg,#D2FF00)] text-[var(--cursor-fg,#0e0e0e)] opacity-0 invisible shadow-[0_18px_50px_rgba(0,0,0,0.35)] will-change-transform md:flex"
                aria-hidden="true"
            >
                <span className="text-center text-[0.68rem] font-black uppercase leading-[0.82] tracking-normal">
                    View<br />More
                </span>
            </div>

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
                            onClick={(e) => handleCardClick(e, project)}
                            href={`/projects/${project.id}`}
                            key={project.id}
                            data-theme-color={project.themeColor}
                            data-text-color={project.textColor}
                            aria-label={`View more about ${project.name}`}
                            className="project-card group relative block w-full cursor-pointer outline-none overflow-hidden p-3 sm:p-4 md:cursor-none md:p-6 lg:p-8 bg-transparent"
                        >

                            <div
                                className="card-hover-bg absolute inset-0 origin-left z-0 -translate-x-full"
                                style={{ backgroundColor: project.themeColor }}
                            />

                            {/* Card Image */}
                            <div
                                ref={(el) => { if (el) imgRefs.current.set(String(project.id), el); }}
                                className="relative w-full aspect-[16/10] overflow-hidden bg-[#111] z-10"
                            >
                                <div className="img-cover absolute inset-0 z-20 pointer-events-none" style={{ backgroundColor: project.themeColor }} />

                                <Image
                                    src={project.img}
                                    alt={project.name}
                                    fill
                                    className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 "
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />

                                <div
                                    className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[#0e0e0e]/10 shadow-[0_10px_25px_rgba(0,0,0,0.2)] md:hidden"
                                    style={{ backgroundColor: project.themeColor, color: project.textColor }}
                                    aria-hidden="true"
                                >
                                    <ArrowUpRight size={22} strokeWidth={2.5} />
                                </div>
                            </div>

                            {/* Overlapping Labels */}
                            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 flex flex-col items-end z-20 pointer-events-none">
                                <div
                                    className="relative overflow-hidden w-max"
                                    style={{ backgroundColor: project.themeColor }}
                                >
                                    <h2 className="relative z-10 px-4 py-2 md:px-5 md:py-3 text-lg md:text-2xl lg:text-3xl font-black uppercase leading-none tracking-tighter m-0" style={{ color: project.textColor }}>
                                        {project.name}
                                    </h2>
                                </div>
                                <div
                                    className="relative overflow-hidden w-max"
                                    style={{ backgroundColor: project.themeColor }}
                                >
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