'use client'

import React from 'react';
import { BlockRevealText } from '@/components/normal/BlockRevealText'; // Adjust import path if needed

// Data structure based on your provided skills
const skillsData = [
    {
        title: "Languages",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="rgb(239, 81, 67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
        ),
        items: ["JavaScript (ES6+)", "Python", "TypeScript"]
    },
    {
        title: "FrontEnd",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="rgb(239, 81, 67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
        ),
        items: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS"]
    },
    {
        title: "Web Animation",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="rgb(239, 81, 67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
        ),
        items: ["CSS Animation", "GSAP", "Framer Motion", "ScrollTrigger", "SVG Animation"]
    },
    {
        title: "Tools",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="rgb(239, 81, 67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
        ),
        items: ["Git & Github", "Redux Toolkit", "TanStack Query", "Zustand"]
    },
    {
        title: "Concepts",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="rgb(239, 81, 67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
            </svg>
        ),
        items: ["OOP", "Data Structures & Algorithms", "Problem Solving"]
    }
];

const SkillsPage = () => {
    return (
        <section className="w-full min-h-screen  font-classic  py-24 md:py-32 px-3 sm:px-12 ">

            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

                {/* --- LEFT COLUMN: Titles (Matches "My Expertise" side) --- */}
                <div className="w-full lg:w-5/12 lg:sticky lg:top-32">

                    {/* Small Overline Text */}
                    <BlockRevealText
                        text="A CURATED SET OF TOOLS"
                        textClassName="font-bold text-[#f4f1de] text-sm md:text-base uppercase tracking-widest mb-6"
                        blockColor="#f4f1de"
                        containerClassName="mb-6"
                    />

                    {/* Massive Header broken into two blocks for impact */}
                    <div className="flex flex-col gap-2">
                        <BlockRevealText
                            text="My Expertise"
                            textClassName=" font-primary text-coral uppercase text-[18vw] md:text-[12vw] lg:text-[8vw] leading-[0.90]"
                            blockColor="#D2FF00"
                        />

                    </div>
                </div>

                {/* --- RIGHT COLUMN: Skills Grid (Matches the 2-column lists side) --- */}
                <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                    {skillsData.map((category, index) => (
                        <div key={index} className="flex flex-col w-full">

                            {/* Top Border line matching the reference */}
                            <div className="w-full h-[1px] bg-coral mb-6"></div>

                            {/* Circle Icon */}
                            <div className="w-8 h-8 rounded-full border border-coral flex items-center justify-center mb-6">
                                {category.icon}
                            </div>

                            {/* Category Title */}
                            <BlockRevealText
                                text={category.title}
                                textClassName="font-black text-coral text-2xl md:text-3xl lg:text-4xl tracking-tight leading-none mb-6"
                                blockColor="#D2FF00"
                            />

                            {/* Skill Items List */}
                            <div className="flex flex-col space-y-1.5">
                                {category.items.map((skill, skillIndex) => (
                                    <BlockRevealText
                                        key={skillIndex}
                                        text={skill}
                                        textClassName="font-medium text-base md:text-lg leading-tight text-[#f4f1de]"
                                        blockColor="#f4f1de"
                                    />
                                ))}
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default SkillsPage;