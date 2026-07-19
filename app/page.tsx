import About from '@/sections/About';
import Hero from '@/sections/Hero';
import Projects from '@/sections/Projects';
import CanvasSequence from '@/sections/VideoSection';
import WhoIm from '@/sections/WhoIm';
import React from 'react';

const page = () => {
  return (
    <>
      <Hero />

      <About />
      <WhoIm />
      <Projects />
      <CanvasSequence />

    </>
  );
};

export default page;