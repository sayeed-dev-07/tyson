/* eslint-disable @typescript-eslint/no-unsafe-function-type */
"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlockRevealText } from "@/components/normal/BlockRevealText";

gsap.config({
    force3D: true
});

export default function CanvasSequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Add state to trigger the text rendering
    const [showText, setShowText] = useState(false);

    const imagesRef = useRef<(ImageBitmap | null)[]>(new Array(130).fill(null));
    const seqRef = useRef({ frame: 0 });

    const TOTAL_FRAMES = 130;
    const INITIAL_BATCH = 20;

    const IMAGE_BASE_URL = "/frames/";

    useEffect(() => {
        // 1. ADDED: isMounted flag to prevent async race conditions on route change
        let isMounted = true;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        const overlay = overlayRef.current;

        if (!canvas || !container || !overlay) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 1920;
        canvas.height = 1080;

        ScrollTrigger.config({ ignoreMobileResize: true });

        const ctxGsap = gsap.context(() => { });

        const getFrameUrl = (index: number) => {
            const frameNumber = (index + 1).toString().padStart(4, "0");
            return `${IMAGE_BASE_URL}frame-${frameNumber}.webp`;
        };

        const loadFrame = async (index: number) => {
            try {
                const response = await fetch(getFrameUrl(index));
                const blob = await response.blob();
                const imageBitmap = await createImageBitmap(blob);
                if (isMounted) {
                    imagesRef.current[index] = imageBitmap;
                }
            } catch (error) {
                console.error(`Error loading frame ${index}:`, error);
            }
        };

        const render = () => {
            if (!isMounted) return;
            const currentFrameIndex = Math.round(seqRef.current.frame);
            const img = imagesRef.current[currentFrameIndex];

            if (img) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            }
        };

        const loadRemainingFrames = (startIndex: number) => {
            let currentIndex = startIndex;

            const requestIdle: typeof window.requestIdleCallback =
                window.requestIdleCallback?.bind(window) ??
                ((callback) => window.setTimeout(() => {
                    callback({
                        didTimeout: false,
                        timeRemaining: () => 50,
                    });
                }, 1));

            const loadNextBatch: IdleRequestCallback = (deadline) => {
                if (!isMounted) return; // Stop loading if page unmounts

                while (deadline.timeRemaining() > 0 && currentIndex < TOTAL_FRAMES) {
                    void loadFrame(currentIndex);
                    currentIndex++;
                }
                if (currentIndex < TOTAL_FRAMES && isMounted) {
                    requestIdle(loadNextBatch);
                }
            };

            if (isMounted) {
                requestIdle(loadNextBatch);
            }
        };

        const initSequence = async () => {
            const initialPromises = [];
            for (let i = 0; i < INITIAL_BATCH; i++) {
                initialPromises.push(loadFrame(i));
            }
            await Promise.all(initialPromises);

            if (!isMounted) return; // Abort GSAP setup if component unmounted during load

            render();

            ctxGsap.add(() => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: container,
                        pin: true,
                        scrub: 0.5,
                        start: "top top",
                        end: "+=400%",
                        onUpdate: (self) => {
                            setShowText(self.progress >= 0.8);
                        }
                    }
                });

                tl.to(seqRef.current, {
                    frame: TOTAL_FRAMES - 1,
                    snap: "frame",
                    ease: "none",
                    onUpdate: render,
                    duration: 1
                }, 0);

                tl.fromTo(overlay,
                    { autoAlpha: 0, y: 50 },
                    { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" },
                    0.8
                );
            });

            loadRemainingFrames(INITIAL_BATCH);
        };

        initSequence();

        return () => {
            isMounted = false; // Flag component as unmounted
            ctxGsap.revert();
        };
    }, []);

    return (
        // 2. ADDED: The Pin Protector div. React tracks this, GSAP pins the inner div.
        <div className="canvas-pin-protector w-full">
            <div
                ref={containerRef}
                className="relative h-screen w-full max-w-full overflow-hidden bg-black"
                style={{ width: "100%", maxWidth: "100%", height: "100vh", position: "relative", overflow: "hidden", backgroundColor: "#000" }}
            >
                <canvas
                    ref={canvasRef}
                    className="block h-screen w-full max-w-full object-cover"
                    style={{ width: "100%", maxWidth: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />

                <div
                    ref={overlayRef}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 text-white text-center invisible px-4"
                >
                    {showText && (
                        <>
                            <div className="flex flex-col items-center justify-center mb-8 gap-y-2">
                                <BlockRevealText
                                    text="thanks for"
                                    textClassName="text-5xl md:text-7xl font-primary uppercase text-coral text-center"
                                />
                                <BlockRevealText
                                    text="visiting"
                                    textClassName="text-5xl md:text-7xl font-primary uppercase text-coral text-center"
                                />
                            </div>

                            <div className="flex flex-col text-center items-center gap-y-3 mt-6">
                                <BlockRevealText
                                    blockColor="#f4f1de"
                                    text="coded by"
                                    textClassName="text-xs md:text-sm tracking-[0.4em] uppercase text-gray-400 font-classic font-light"
                                />
                                <BlockRevealText
                                    blockColor="#f4f1de"
                                    text="sayed shorif"
                                    textClassName="text-2xl md:text-3xl tracking-widest capitalize font-secondary text-orange-50"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}