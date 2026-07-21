import ScrollToTop from '@/components/normal/ScrollToTop';
import About from '@/sections/About';
import ContactPage from '@/sections/Contact';
import Hero from '@/sections/Hero';
import Projects from '@/sections/Projects';
import ExpertisePage from '@/sections/Services';

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
      <ExpertisePage />
      <Projects />
      <SkillsPage />
      <ContactPage />
      <CanvasSequence />
      <ScrollToTop />

    </>
  );
};

export default page;