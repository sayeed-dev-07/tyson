'use client'

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlockRevealText } from '@/components/normal/BlockRevealText';
import { projectData } from '@/public/data/projectsData';
import { useFlipTransition } from '@/providers/utils/FlipTransitionProvider';

const Projects = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { startTransition } = useFlipTransition();
    const imgRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const handleCardClick = (e: React.MouseEvent, project: typeof projectData[number]) => {
        e.preventDefault();
        const imgEl = imgRefs.current.get(project.id);
        if (!imgEl) return;

        // Only pass the image rectangle for the flip transition
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
        // --- 1. INTRO ANIMATIONS ---
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

        // --- 2. GRID CARD SCROLL REVEAL ---
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

        // --- 3. RESPONSIVE HOVER LOGIC ---
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const cleanups: (() => void)[] = [];

            cards.forEach((card: any) => {
                const hoverBg = card.querySelector('.card-hover-bg');

                gsap.set(hoverBg, { xPercent: -100 });

                const onMouseEnter = () => {
                    gsap.to(hoverBg, {
                        xPercent: 0,
                        duration: 0.3,
                        ease: "cubic-bezier(0.7, 0, 0.3, 1)"
                    });
                };

                const onMouseLeave = () => {
                    gsap.to(hoverBg, {
                        xPercent: -100,
                        duration: 0.3,
                        ease: "cubic-bezier(0.7, 0, 0.3, 1)"
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

    }, { scope: containerRef });

    return (
        <section id='projects' ref={containerRef} className="w-full px-3 sm:px-8 font-primary py-24 md:py-32">

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
                            className="project-card group relative block w-full outline-none overflow-hidden p-3 sm:p-4 md:p-6 lg:p-8 bg-transparent"
                        >

                            <div
                                className="card-hover-bg absolute inset-0 origin-left z-0"
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
                            </div>

                            {/* Overlapping Labels (Removed refs since they won't animate) */}
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