import About from '@/sections/About';
import Hero from '@/sections/Hero';
import CanvasSequence from '@/sections/VideoSection';
import React from 'react';

const page = () => {
  return (
    <>
      <Hero />

      <About />
        <CanvasSequence />
    </>
  );
};

export default page;