'use client'
import LenisProvider from '@/providers/LenisProvider';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.config({
    force3D: true
})

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <LenisProvider>
            {/* The main wrapper must have the black background */}
            <div className="relative min-h-screen bg-black">

                {/* 1. Pure Code Noise Background */}
                <div className='pointer-events-none fixed inset-0 z-0 h-full w-full'>
                    <svg
                        className="absolute inset-0 h-full w-full opacity-[0.15] mix-blend-screen"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <filter id="noiseFilter">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.75"
                                numOctaves="3"
                                stitchTiles="stitch"
                            />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                    </svg>
                </div>

                {/* main content  */}
                <div className='relative z-20'>
                    {children}
                </div>

            </div>
        </LenisProvider>
    );
};

export default ClientLayout;