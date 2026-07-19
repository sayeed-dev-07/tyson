'use client'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLenis } from 'lenis/react';
import type Lenis from 'lenis';
import HeroPreloader from '@/components/HeroPreloader';


gsap.config({
    force3D: true
})

const words: string[] = [
    'curious',
    'Wanderer',
    'thinker',
    'Exceptional',
];

const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();
    const lenisRef = useRef<Lenis | undefined>(undefined);
    const isScrollLockedRef = useRef(false);
    const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const hasPreloaderCompletedRef = useRef(false);
    const [showPreloader, setShowPreloader] = useState(true);

    const startHeroIntro = useCallback(() => {
        hasPreloaderCompletedRef.current = true;
        setShowPreloader(false);
        introTimelineRef.current?.play(0);
    }, []);

    useEffect(() => {
        lenisRef.current = lenis;

        if (isScrollLockedRef.current) {
            lenis?.stop();
        }
    }, [lenis]);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const calculateWordSize = () => {
            const firstWord = container.querySelector<HTMLElement>('.word');
            const credit = container.querySelector<HTMLElement>('.creator-credit');
            const stage = container.querySelector<HTMLElement>('.hero-copy');
            if (!firstWord) return;

            const stageWidth = stage?.clientWidth || container.clientWidth;
            const stageHeight = container.clientHeight;
            const styles = window.getComputedStyle(firstWord);
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) return;

            context.font = `${styles.fontWeight} 100px ${styles.fontFamily}`;

            const wordWidths = words.reduce<Record<string, number>>((widths, word) => {
                widths[word.toLowerCase()] = context.measureText(word.toUpperCase()).width;
                return widths;
            }, {});

            const widestWord = Object.values(wordWidths).reduce((widest, width) => {
                return Math.max(widest, width);
            }, 0);

            const lineHeight = 0.76;
            const widthFit = (stageWidth * 0.98 / widestWord) * 100;
            const heightFit = (stageHeight * 0.84 / (words.length * lineHeight));
            const preliminaryFontSize = Math.min(widthFit, heightFit);
            const creditFontSize = Math.max(6, Math.min(15, preliminaryFontSize * 0.11, stageWidth * 0.025));

            container.style.setProperty('--hero-credit-size', `${creditFontSize}px`);

            let creditWidth = 0;

            if (credit) {
                const creditStyles = window.getComputedStyle(credit);
                const creditContext = canvas.getContext('2d');

                if (creditContext) {
                    creditContext.font = `${creditStyles.fontWeight} ${creditFontSize}px ${creditStyles.fontFamily}`;
                    creditWidth = Math.max(
                        creditContext.measureText('Design and Develop').width,
                        creditContext.measureText('by Sayeed').width,
                    );
                }
            }

            const creditGap = Math.max(6, Math.min(18, stageWidth * 0.018));
            const thinkerOffset = Math.ceil(creditWidth + creditGap);
            const thinkerWidth = wordWidths.thinker || widestWord;
            const thinkerFit = ((stageWidth * 0.98) - thinkerOffset) / thinkerWidth * 100;
            const fontSize = Math.max(10, Math.min(widthFit, heightFit, thinkerFit));

            container.style.setProperty('--hero-word-size', `${fontSize}px`);
            container.style.setProperty('--hero-thinker-offset', `${thinkerOffset}px`);

            if (container.dataset.creatorShown === 'true') {
                const thinker = container.querySelector<HTMLElement>('.word-thinker');
                thinker?.style.setProperty('margin-left', `${thinkerOffset}px`);
            }
        };

        calculateWordSize();

        const resizeObserver = new ResizeObserver(calculateWordSize);
        resizeObserver.observe(container);
        window.addEventListener('resize', calculateWordSize);

        document.fonts?.ready.then(calculateWordSize);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', calculateWordSize);
        };
    }, []);

    useGSAP(() => {
        const html = document.documentElement;
        const body = document.body;
        const previousHtmlOverflow = html.style.overflow;
        const previousBodyOverflow = body.style.overflow;

        const lockScroll = () => {
            isScrollLockedRef.current = true;
            lenisRef.current?.stop();
            html.style.overflow = 'hidden';
            body.style.overflow = 'hidden';
        };

        const unlockScroll = () => {
            isScrollLockedRef.current = false;
            lenisRef.current?.start();
            html.style.overflow = previousHtmlOverflow;
            body.style.overflow = previousBodyOverflow;
        };

        lockScroll();

        const tl = gsap.timeline({
            paused: true,
            onComplete: unlockScroll,
        });

        introTimelineRef.current = tl;

        gsap.set('.word-wrapper', { height: 0 });

        gsap.set('.word', {
            scale: 0,
            opacity: 0,
            y: 60,
            xPercent: -55,
            transformOrigin: 'center center'
        });

        gsap.set('.creator-credit', {
            autoAlpha: 0,
            x: '-110%',
        });

        tl.to('.word-wrapper', {
            height: 'auto',
            duration: 1.5,
            stagger: 0.8,
            ease: 'power4.out',
        }, 0.3) // <-- Shifted forward by 0.3 seconds
            .to('.word', {
                scale: 1,
                opacity: 1,
                y: 0,
                // Removed delay: -0.3
                duration: 1.5,
                stagger: 0.8,
                ease: 'power4.out',
            }, 0) // <-- Starts at exactly 0.0 seconds

            .to('.word', {
                marginLeft: '0',
                xPercent: 0,
                duration: 1.6,
                ease: 'power4.out'
            }, ">")

            .to('.word-thinker', {
                marginLeft: () => getComputedStyle(containerRef.current!).getPropertyValue('--hero-thinker-offset'),
                duration: 0.9,
                ease: 'power4.out',
                onComplete: () => {
                    if (containerRef.current) {
                        containerRef.current.dataset.creatorShown = 'true';
                    }
                }
            }, '+=0.15')
            .to('.creator-credit', {
                autoAlpha: 1,
                x: 0,
                duration: 0.9,
                ease: 'power4.out'
            }, '<');

        if (hasPreloaderCompletedRef.current) {
            tl.play(0);
        }

        return () => {
            tl.kill();
            if (introTimelineRef.current === tl) {
                introTimelineRef.current = null;
            }
            unlockScroll();
        };

    }, { scope: containerRef, dependencies: [] });

    return (
        <div
            ref={containerRef}
            className="relative h-[100svh] w-full overflow-hidden p-3 [--hero-credit-size:clamp(0.45rem,1vw,0.95rem)] [--hero-thinker-offset:8vw] [--hero-word-size:clamp(3rem,min(11.5vw,22svh),18rem)]"
        >
            <div className="relative w-full h-full">
                <div
                    className="hero-copy absolute inset-0 bottom-[5svh] flex max-h-[90svh] w-full flex-col justify-end"
                >
                    {words.map((word, index) => (
                        <div
                            key={index}
                            className="word-wrapper relative w-full"
                        >
                            {word.toLowerCase() === 'thinker' && (
                                <p className="creator-credit invisible absolute left-0 bottom-0 z-10 -translate-y-1/2 whitespace-nowrap font-secondary text-[length:var(--hero-credit-size)] font-bold capitalize leading-[1.05] tracking-normal text-white">
                                    Design and Develop<br />
                                    by Sayeed
                                </p>
                            )}
                            <h1 className={`word m-0 ml-[50vw] w-max p-0 pb-1 font-primary text-[length:var(--hero-word-size)] font-black uppercase leading-[0.76] tracking-[-0.03em] text-[#F05641] ${word.toLowerCase() === 'thinker' ? 'word-thinker' : ''}`}>
                                {word}
                            </h1>
                        </div>
                    ))}
                </div>
            </div>
            {showPreloader && <HeroPreloader onComplete={startHeroIntro} />}
        </div>
    );
};

export default Hero;
