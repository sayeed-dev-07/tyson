'use client'
import { ProjectType } from '@/types/types';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BlockRevealText } from '../normal/BlockRevealText';

import { ArrowUpRight, ChevronLeft } from 'lucide-react';
import AnimatedHoverWrapper from './HoverWrapper';
import { gsap } from 'gsap';

const ProjectDetails = ({ data }: { data: ProjectType }) => {
    const router = useRouter();

    // Refs for the image and the 4 borders
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const topBorderRef = useRef<HTMLSpanElement>(null);
    const rightBorderRef = useRef<HTMLSpanElement>(null);
    const bottomBorderRef = useRef<HTMLSpanElement>(null);
    const leftBorderRef = useRef<HTMLSpanElement>(null);

    // CSS variables for dynamic project theming
    const customStyles = {
        '--theme-color': data.themeColor,
        '--text-color': data.textColor,
    } as React.CSSProperties;

    // Trigger the animation on component mount
    useEffect(() => {
        if (imageContainerRef.current) {
            const tl = gsap.timeline();

            // Set initial state: image hidden via inset (bottom is pulled all the way to the top) 
            // and borders start at 0 width/height
            gsap.set(imageContainerRef.current, {
                clipPath: 'inset(0% 0% 100% 0%)',
                webkitClipPath: 'inset(0% 0% 100% 0%)'
            });
            gsap.set([topBorderRef.current, bottomBorderRef.current], { width: 0 });
            gsap.set([rightBorderRef.current, leftBorderRef.current], { height: 0 });

            // 1. Animate to full straight visibility (top-to-bottom reveal)
            tl.to(imageContainerRef.current, {
                clipPath: 'inset(0% 0% 0% 0%)',
                webkitClipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.5,
                ease: 'power3.inOut',
                delay: 0.1
            })
                // 2. Animate Borders sequentially (Clockwise)
                // Top: Left to Right
                .to(topBorderRef.current, { width: '100%', duration: 0.25, ease: 'none' })
                // Right: Top to Bottom
                .to(rightBorderRef.current, { height: '100%', duration: 0.25, ease: 'none' })
                // Bottom: Right to Left
                .to(bottomBorderRef.current, { width: '100%', duration: 0.25, ease: 'none' })
                // Left: Bottom to Top
                .to(leftBorderRef.current, { height: '100%', duration: 0.25, ease: 'none' });
        }
    }, []);

    return (
        <div
            style={customStyles}
            className='min-h-screen px-4 sm:px-6  md:px-8 lg:px-12 xl:px-20 py-20 md:py-30 flex flex-col lg:flex-row gap-4 lg:gap-8'
        >
            {/* LEFT COLUMN: Project Info */}
            <div className="w-full lg:w-1/3 flex flex-col gap-10 mt-4">

                {/* Back Button */}
                <AnimatedHoverWrapper
                    onClick={() => router.back()}
                    className="border border-white/30 w-fit cursor-pointer"
                    fillClass="bg-white"
                    contentClass="px-4 py-2 flex font-secondary items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white group-hover:text-black transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to projects
                </AnimatedHoverWrapper>

                {/* Headers */}
                <div className="flex flex-col  gap-2">
                    <h1 className="text-4xl  font-primary md:text-5xl lg:text-5xl xl:text-6xl tracking-tight text-[#F05641]">
                        <BlockRevealText text={data.name} />
                    </h1>
                    <h2 className="text-2xl font-secondary  opacity-90 text-[#F4F1DE] ">
                        <BlockRevealText text={data.type} blockColor='#F4F1DE' />
                    </h2>
                </div>

                {/* Info Categories */}
                <div className="flex font-classic flex-col gap-3">
                    {/* Category Block */}
                    <div className="flex flex-col gap-3">
                        <span className="text-xs font-semibold uppercase tracking-widest text-[#F4F1DE] opacity-90">
                            <BlockRevealText text={'Category'} blockColor='#F4F1DE' />
                        </span>
                        <div className="flex flex-wrap gap-2">
                            <AnimatedHoverWrapper
                                className="border border-[color:var(--theme-color)] cursor-default"
                                fillClass="bg-[color:var(--theme-color)]"
                                contentClass="px-4 py-1.5 text-sm font-classic text-[color:var(--theme-color)] cursor-cell group-hover:text-[color:var(--text-color)]"
                            >
                                {data.projectType}
                            </AnimatedHoverWrapper>
                        </div>
                    </div>

                    {/* Tech / Role Tags Block */}
                    <div className="flex flex-col gap-3">
                        <span className="text-xs font-semibold uppercase tracking-widest text-[#F4F1DE] opacity-90">
                            <BlockRevealText text={'Role & Tech'} blockColor='#F4F1DE' />
                        </span>
                        <div className="flex flex-wrap gap-2 ">
                            {data.tech.map((techItem, index) => (
                                <AnimatedHoverWrapper
                                    key={index}
                                    className="border border-[color:var(--theme-color)] cursor-default"
                                    fillClass="bg-[color:var(--theme-color)]"
                                    contentClass="px-3 font-classic cursor-cell py-1 text-xs  sm:text-sm font-medium text-[color:var(--theme-color)] group-hover:text-[color:var(--text-color)]"
                                >
                                    {techItem}
                                </AnimatedHoverWrapper>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <Link href={data.live} target="_blank" rel="noreferrer" className="block w-full mt-4">
                    <AnimatedHoverWrapper
                        className="border border-[color:var(--theme-color)] w-full cursor-pointer"
                        fillClass="bg-[color:var(--theme-color)]"
                        contentClass="px-6 py-4 w-full flex justify-center items-center gap-3 text-sm uppercase tracking-widest font-bold text-[color:var(--theme-color)] font-secondary group-hover:text-[color:var(--text-color)] transition-colors"
                    >
                        Visit Site
                        <ArrowUpRight className="w-4 h-4" />
                    </AnimatedHoverWrapper>
                </Link>

            </div>

            {/* RIGHT COLUMN: Project Image */}
            <div className="w-full lg:w-2/3 flex items-start">
                <div className="relative w-full p-2 rounded-sm">

                    {/* Top Border (Anchored Left, Animates Width) */}
                    <span ref={topBorderRef} className="absolute top-0 left-0 h-[1px] bg-[color:var(--theme-color)]" />
                    {/* Right Border (Anchored Top, Animates Height) */}
                    <span ref={rightBorderRef} className="absolute top-0 right-0 w-[1px] bg-[color:var(--theme-color)]" />
                    {/* Bottom Border (Anchored Right, Animates Width) */}
                    <span ref={bottomBorderRef} className="absolute bottom-0 right-0 h-[1px] bg-[color:var(--theme-color)]" />
                    {/* Left Border (Anchored Bottom, Animates Height) */}
                    <span ref={leftBorderRef} className="absolute bottom-0 left-0 w-[1px] bg-[color:var(--theme-color)]" />

                    <div ref={imageContainerRef} className="relative w-full aspect-video overflow-hidden  bg-[#111]">
                        <Image
                            src={data.img}
                            alt={`${data.name} Project Preview`}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 66vw"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProjectDetails;