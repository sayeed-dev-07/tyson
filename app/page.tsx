import About from '@/sections/About';
import ContactPage from '@/sections/Contact';
import Hero from '@/sections/Hero';
import Projects from '@/sections/Projects';
import SkillsPage from '@/sections/Skills';
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
      <SkillsPage />
      <ContactPage />
      <CanvasSequence />

    </>
  );
};

export default page;