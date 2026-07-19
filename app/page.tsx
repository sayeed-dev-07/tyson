import About from '@/sections/About';
import Hero from '@/sections/Hero';
import CanvasSequence from '@/sections/VideoSection';
import WhoIm from '@/sections/WhoIm';
import React from 'react';

const page = () => {
  return (
    <>
      <Hero />

      <About />
      <WhoIm />
      <CanvasSequence />

    </>
  );
};

export default page;