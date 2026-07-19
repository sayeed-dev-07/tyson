/* eslint-disable @typescript-eslint/no-unsafe-function-type */
"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";


export default function CanvasSequence() {
    // Refs to access the DOM elements directly
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Store variables in refs so they persist across renders without triggering React re-renders
    const imagesRef = useRef<(ImageBitmap | null)[]>(new Array(130).fill(null));
    const seqRef = useRef({ frame: 0 });

    const TOTAL_FRAMES = 130;
    const INITIAL_BATCH = 20;

    // Because it's in the Next.js 'public' folder, we start with a forward slash
    const IMAGE_BASE_URL = "/frames/";

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set internal canvas resolution to match your images
        canvas.width = 1920;
        canvas.height = 1080;

        // GSAP Context makes cleanup super easy in React (especially important for React 18 Strict Mode)
        const ctxGsap = gsap.context(() => { });

        // 1. Helper function to generate URL
        const getFrameUrl = (index: number) => {
            const frameNumber = (index + 1).toString().padStart(4, "0");
            return `${IMAGE_BASE_URL}frame-${frameNumber}.webp`;
        };

        // 2. Fetch and decode a single frame
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

        // 3. Render function
        const render = () => {
            const currentFrameIndex = Math.round(seqRef.current.frame);
            const img = imagesRef.current[currentFrameIndex];

            if (img) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            }
        };

        // 4. Background queue using requestIdleCallback
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

        // 5. Main Initialization sequence
        const initSequence = async () => {
            // Load initial batch
            const initialPromises = [];
            for (let i = 0; i < INITIAL_BATCH; i++) {
                initialPromises.push(loadFrame(i));
            }
            await Promise.all(initialPromises);

            // Render first frame immediately so the user sees it
            render();

            // Setup GSAP inside the context for safe cleanup
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
                        end: "+=400%", // Makes the scroll area 4x the viewport height
                    },
                    onUpdate: render,
                });
            });

            // Load the rest of the 110 frames in the background
            loadRemainingFrames(INITIAL_BATCH);
        };

        initSequence();

        // Cleanup function: Reverts the GSAP animations when the component unmounts
        return () => {
            ctxGsap.revert();
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div
            ref={containerRef}
            className="relative h-dvh w-full max-w-full overflow-hidden bg-black"
            style={{ width: "100%", maxWidth: "100%", height: "100dvh", position: "relative", overflow: "hidden", backgroundColor: "#000" }} // Inline fallback if not using Tailwind
        >
            <canvas
                ref={canvasRef}
                className="block h-dvh w-full max-w-full object-cover"
                style={{ width: "100%", maxWidth: "100%", height: "100%", objectFit: "cover", display: "block" }} // Inline fallback
            />
        </div>
    );
}
