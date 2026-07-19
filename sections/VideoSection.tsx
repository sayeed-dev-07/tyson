/* eslint-disable @typescript-eslint/no-unsafe-function-type */
"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Make sure this is imported

// Register ScrollTrigger if you haven't globally
gsap.registerPlugin(ScrollTrigger);

export default function CanvasSequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const imagesRef = useRef<(ImageBitmap | null)[]>(new Array(130).fill(null));
    const seqRef = useRef({ frame: 0 });

    const TOTAL_FRAMES = 130;
    const INITIAL_BATCH = 20;

    const IMAGE_BASE_URL = "/frames/";

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 1920;
        canvas.height = 1080;

        // Prevent ScrollTrigger from recalculating pinning when the mobile address bar hides/shows
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
                imagesRef.current[index] = imageBitmap;
            } catch (error) {
                console.error(`Error loading frame ${index}:`, error);
            }
        };

        const render = () => {
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
                while (deadline.timeRemaining() > 0 && currentIndex < TOTAL_FRAMES) {
                    void loadFrame(currentIndex);
                    currentIndex++;
                }
                if (currentIndex < TOTAL_FRAMES) {
                    requestIdle(loadNextBatch);
                }
            };

            requestIdle(loadNextBatch);
        };

        const initSequence = async () => {
            const initialPromises = [];
            for (let i = 0; i < INITIAL_BATCH; i++) {
                initialPromises.push(loadFrame(i));
            }
            await Promise.all(initialPromises);

            render();

            ctxGsap.add(() => {
                gsap.to(seqRef.current, {
                    frame: TOTAL_FRAMES - 1,
                    snap: "frame",
                    ease: "none",
                    scrollTrigger: {
                        trigger: container,
                        pin: true,
                        scrub: 0.5,
                        start: "top top",
                        end: "+=400%",
                    },
                    onUpdate: render,
                });
            });

            loadRemainingFrames(INITIAL_BATCH);
        };

        initSequence();

        return () => {
            ctxGsap.revert();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            // Replaced h-dvh with h-screen (100vh)
            className="relative h-screen w-full max-w-full overflow-hidden bg-black"
            // Replaced 100svh with 100vh
            style={{ width: "100%", maxWidth: "100%", height: "100vh", position: "relative", overflow: "hidden", backgroundColor: "#000" }}
        >
            <canvas
                ref={canvasRef}
                // Replaced h-dvh with h-screen
                className="block h-screen w-full max-w-full object-cover"
                style={{ width: "100%", maxWidth: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
        </div>
    );
}