import { useRef } from 'react';
import { ReactLenis, type LenisRef } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<LenisRef>(null);


    useGSAP(() => {
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }
        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    return (
        <ReactLenis
            root
            ref={lenisRef}
            autoRaf={false}
            options={{ lerp: 0.1, duration: 1.2 }}
        >
            {children}
        </ReactLenis>
    );
}
