/* eslint-disable react-hooks/refs */
'use client'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ChevronUp } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useLenis } from 'lenis/react';

const ScrollToTop = () => {

    const buttonRef = useRef<HTMLDivElement>(null)
    const bgColorRef = useRef<HTMLDivElement>(null)
    const tl = useRef<GSAPTimeline | null>(null)
    
    // State to track if the user has scrolled past 200px
    const [isVisible, setIsVisible] = useState(false)

    // Listen to Lenis scroll events
    const lenis = useLenis((e) => {
        if (e.scroll > 200 && !isVisible) {
            setIsVisible(true)
        } else if (e.scroll <= 200 && isVisible) {
            setIsVisible(false)
        }
    }, [isVisible]) // Dependency array ensures we have the latest state

    const { contextSafe } = useGSAP(() => {
        if (!buttonRef.current || !bgColorRef.current) return
        tl.current = gsap.timeline({ paused: true })
        tl.current.to(bgColorRef.current, {
            x: 0,
            duration: 0.3, // Slightly increased duration for better visual pacing with expo.out
            ease: 'expo.out'
        })
    }, { scope: buttonRef })

    const mouseHoverIn = contextSafe(() => {
        if (!tl.current) return
        tl.current.play()
    })
    const mouseHoverOut = contextSafe(() => {
        if (!tl.current) return
        tl.current.reverse()
    })

    // Handler to scroll to top using Lenis
    const handleScrollToTop = () => {
        lenis?.scrollTo(0, {
            duration: 1.2, // Adjust duration if you want the scroll back up to be faster/slower
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Nice smooth easing
        })
    }

    return (
        <div 
            onClick={handleScrollToTop}
            onMouseEnter={mouseHoverIn} 
            onMouseLeave={mouseHoverOut} 
            ref={buttonRef} 
            // Added Tailwind transition, opacity, pointer-events, and translate-y for a smooth fade up
            className={`fixed sm:bottom-10 border cursor-pointer overflow-hidden sm:right-10 right-5 bottom-5 z-99 transition-all duration-300 ease-out ${
                isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
        >
            <div ref={bgColorRef} className='bg-foreground -translate-x-full absolute h-full w-full z-5'></div>
            <div className='relative text-coral flex flex-col items-center justify-center font-semibold lowercase px-3 py-1 -gap-y-2 text-xs font-classic z-10 leading-3.5'>
                <ChevronUp className='text-[8px]' />
                Scroll <br />
                to top
            </div>
        </div>
    );
};

export default ScrollToTop;