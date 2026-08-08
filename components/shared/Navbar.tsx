'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLenis } from 'lenis/react';

const navItems = [
    { name: 'About', href: '#about', isExternal: false },
    { name: 'Projects', href: '#projects', isExternal: false },
    { name: 'Services', href: '#services', isExternal: false },
    { name: 'Skills', href: '#skills', isExternal: false },
    { name: 'Contact', href: '#contact', isExternal: false },
    { name: 'CV', href: 'https://drive.google.com/file/d/19kToysg0sKeS_LejaPQuhmuk_qf34bfO/view?usp=sharing', isExternal: true },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    // Initialize Lenis
    const lenis = useLenis();

    useGSAP(() => {
        gsap.set('.nav-hover-line', { xPercent: -101 });
        gsap.set('.nav-overlay', { xPercent: 100 });
        gsap.set('.close-char', { y: 15, opacity: 0 });
        gsap.set('.nav-block-cover', { clipPath: 'inset(0% 0% 0% 0%)' });

        timelineRef.current = gsap.timeline({ paused: true })
            .to('.nav-overlay', {
                xPercent: 0,
                duration: 0.8,
                ease: 'power4.inOut'
            })
            .to('.bar-top', { y: 9, rotate: 45, duration: 0.4, ease: 'back.inOut(1.5)' }, 0)
            .to('.bar-mid', { opacity: 0, x: -10, duration: 0.4, ease: 'power3.inOut' }, 0)
            .to('.bar-bot', { y: -9, rotate: -45, duration: 0.4, ease: 'back.inOut(1.5)' }, 0)
            .to('.menu-char', {
                y: -15,
                opacity: 0,
                duration: 0.4,
                stagger: 0.03,
                ease: 'power3.inOut'
            }, 0)
            .to('.close-char', {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.03,
                ease: 'power3.inOut'
            }, 0.1)
            .to('.nav-block-cover', {
                clipPath: "inset(0% 0% 0% 100%)",
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.inOut'
            }, "-=0.4");

    }, { scope: containerRef });

    useEffect(() => {
        if (isOpen) {
            timelineRef.current?.play();
        } else {
            timelineRef.current?.reverse();
        }
    }, [isOpen]);

    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
        gsap.to(e.currentTarget.querySelector('.nav-hover-line'), {
            xPercent: 0,
            duration: 0.4,
            ease: 'power3.out'
        });
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
        gsap.to(e.currentTarget.querySelector('.nav-hover-line'), {
            xPercent: -101,
            duration: 0.4,
            ease: 'power3.inOut'
        });
    };

    // Updated Click Handler with Lenis Smooth Scrolling
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isExternal: boolean) => {
        if (isExternal) {
            // If it's an external link (like CV), just close the menu and let the browser open it
            setIsOpen(false);
            return;
        }

        e.preventDefault();
        setIsOpen(false);

        // Wait for the menu reverse animation to finish before snapping to the section
        setTimeout(() => {
            if (lenis) {
                lenis.scrollTo(href, { force: true });
            } else {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }, 500); // 500ms delay matches nicely with the reverse block-cover animation
    };

    return (
        <div ref={containerRef}>

            {/* HAMBURGER BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-6 p-2 right-3 cursor-pointer lg:top-10 lg:right-10 z-[9999] flex flex-col items-center gap-2 group outline-none"
                aria-label="Toggle Menu"
            >
                <div className="relative w-8 h-[20px]">
                    <span className="bar-top absolute top-0 left-0 w-full h-[2px] bg-[#F4F1DE] rounded-sm" />
                    <span className="bar-mid absolute top-1/2 -translate-y-1/2 left-0 w-full h-[2px] bg-[#F05641] rounded-sm" />
                    <span className="bar-bot absolute bottom-0 left-0 w-full h-[2px] bg-[#F4F1DE] rounded-sm" />
                </div>

                <div className="relative w-[40px]  h-[15px]  text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4F1DE] group-hover:text-[#F05641] transition-colors duration-300">
                    <div className="absolute top-0 w-full flex justify-center">
                        {'Menu'.split('').map((char, i) => (
                            <span key={`menu-${i}`} className="menu-char inline-block">
                                {char}
                            </span>
                        ))}
                    </div>
                    <div className="absolute top-0 w-full flex justify-center">
                        {'Close'.split('').map((char, i) => (
                            <span key={`close-${i}`} className="close-char inline-block">
                                {char}
                            </span>
                        ))}
                    </div>
                </div>
            </button>

            {/* NAV OVERLAY SIDEBAR */}
            <nav className="nav-overlay fixed top-0 right-0 h-screen w-full md:w-2/4 xl:w-2/6 bg-[#111] z-[99] border-l border-[#F05641]/20 flex flex-col justify-end pb-24 will-change-transform font-primary">
                <div className="flex flex-col gap-2 px-12 lg:px-20">
                    {navItems.map((item, index) => (
                        <div key={index} className="overflow-hidden w-fit">
                            <Link
                                href={item.href}
                                // Pass the event, href, and external check to our new handler
                                onClick={(e) => handleLinkClick(e, item.href, item.isExternal)}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                target={item.isExternal ? "_blank" : undefined}
                                rel={item.isExternal ? "noopener noreferrer" : undefined}
                                className="nav-item group block relative text-[10vw] md:text-[6vw] md:leading-[5vw] leading-[6vw] font-bold tracking-tight text-[#F4F1DE] py-2"
                            >
                                <span className="relative z-10">{item.name}</span>

                                <div
                                    className="nav-block-cover absolute top-0 left-0 w-full h-full bg-[#D2FF00] z-20"
                                    style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                                />

                                <span className="nav-hover-line absolute bottom-0 left-0 w-full h-[3px] bg-[#F05641] z-[30]" />
                            </Link>
                        </div>
                    ))}
                </div>
            </nav>

        </div>
    );
};

export default Navbar;
