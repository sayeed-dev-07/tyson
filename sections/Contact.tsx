'use client'
import { BlockRevealText } from '@/components/normal/BlockRevealText';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import React, { useRef } from 'react';



// Define props interface for ContactLink
interface ContactLinkProps {
    label: string;
    value: string;
    href: string;
}

// Sub-component for individual contact links to handle timeline state
const ContactLink: React.FC<ContactLinkProps> = ({ label, value, href }) => {
    // Add HTMLDivElement types to refs
    const line1Ref = useRef<HTMLDivElement>(null);
    const line2Ref = useRef<HTMLDivElement>(null);
    // Type the animation state ref as a boolean
    const isAnimating = useRef<boolean>(false);

    const handleHover = () => {
        // Prevent animation spamming if it's currently running
        if (isAnimating.current) return;
        isAnimating.current = true;

        const tl = gsap.timeline({
            onComplete: () => {
                // Instantly reset lines behind the scenes to allow repeatable hovers
                if (line1Ref.current && line2Ref.current) {
                    gsap.set(line1Ref.current, { x: '0%' });
                    gsap.set(line2Ref.current, { x: '-101%' });
                }
                isAnimating.current = false;
            }
        });

        // ANIMATION UPDATE: 
        // line1 starts at exactly 0 seconds.
        // line2 starts at 0.15 seconds. This 0.15s delay creates the visible gap!
        if (line1Ref.current && line2Ref.current) {
            tl.to(line1Ref.current, { x: '101%', duration: 0.8, ease: 'power3.out' }, 0)
                .fromTo(line2Ref.current, { x: '-101%' }, { x: '0%', duration: 0.8, ease: 'power3.out' }, 0.15);
        }
    };

    return (
        <a
            href={href}
            className="flex flex-col items-start gap-2 group cursor-pointer  w-auto"
            onMouseEnter={handleHover}
            target="_blank"
            rel="noopener noreferrer"
        >
            {/* Label */}
            <div className="flex items-center gap-1 text-orange-400 font-bold tracking-widest text-sm uppercase wrap-break-word">
                <span className="w-2 h-2 bg-orange-400 block"></span>
                {label}
            </div>

            {/* Value and Animated Underline */}
            <div className="text-xl wrap-break-word md:text-3xl w-fit font-bold text-orange-50 pb-1 font-classic relative">
                {value}

                {/* Overflow hidden container bounding the animated lines */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] overflow-hidden">
                    <div
                        ref={line1Ref}
                        className="absolute top-0 left-0 w-full h-full bg-orange-50"
                    />
                    <div
                        ref={line2Ref}
                        className="absolute top-0 left-0 w-full h-full bg-orange-50 -translate-x-[101%]"
                    />
                </div>
            </div>
        </a>
    );
};

const Contact: React.FC = () => {
    // Add HTMLDivElement type to the container ref
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Specify HTMLElement array type for gsap.utils.toArray
        const textElements = gsap.utils.toArray<HTMLElement>('.slide-text');

        // Define starting positions: Left, Right, Middle (0)
        const startPositions: number[] = [-300, 300, 0];

        textElements.forEach((el, index) => {
            gsap.fromTo(el,
                {
                    x: startPositions[index],
                    opacity: 0
                },
                {
                    scrollTrigger: {
                        trigger: container.current,
                        start: 'top 85%', // Starts animation when container top is 75% down viewport
                        toggleActions: 'play none none reverse',
                    },
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                    delay: index * 0.15 // Slight stagger effect
                }
            );
        });
    }, { scope: container });

    return (
        <div ref={container} className='py-10 px-4 sm:px-12 min-h-screen flex flex-col justify-center '>

            {/* Heading Section */}
            <div className='flex flex-col uppercase items-center gap-y-4 leading-[0.9] font-primary text-coral' style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}>
                <div className="slide-text w-full flex justify-center"><BlockRevealText text={`Let's`} /></div>
                <div className="slide-text w-full flex justify-center"><BlockRevealText text={`Connect`} /></div>
                <div className="slide-text w-full flex justify-center"><BlockRevealText text={`Together`} /></div>
            </div>

            {/* Links Section */}
            <div className='flex flex-wrap   mt-32 gap-4 sm:gap-6 md:gap-8 lg:gap-12 w-full '>
                <ContactLink
                    label="GITHUB"
                    value="sayeed-dev-07"
                    href="https://github.com/sayeed-dev-07"
                />
                <ContactLink
                    label="EMAIL ME"
                    value="expsayeedshorif@gmail.com"
                    href="mailto:expsayeedshorif@gmail.com"
                />
                <ContactLink
                    label="CALL ME"
                    value="+88 01727482794"
                    href="tel:+8801727482794"
                />
            </div>

        </div>
    );
};

export default Contact;