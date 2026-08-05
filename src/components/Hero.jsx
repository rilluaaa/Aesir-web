import React from 'react';
import { contentData } from '../constants';

export const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="top" className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 md:pb-20 md:pt-18">
      <div className="archive-marquee absolute inset-x-0 top-0">
        <span>
          Human-centered business education · Future intelligence economy · Cognitive strategy · Responsible innovation · Commercializing future technologies · Human-centered business education · Future intelligence economy · Cognitive strategy · Responsible innovation · Commercializing future technologies ·
        </span>
      </div>
      
      <div className="relative z-10 mx-auto w-full max-w-[1180px] pt-10">
        <div data-reveal className="relative overflow-hidden border border-white/10 bg-[#050505] p-5 md:p-8 lg:min-h-[560px] lg:p-10">
          <div className="relative z-10 mb-10 flex flex-wrap items-center justify-between gap-5 border-b border-white/10 pb-5">
            <div className="flex items-center gap-6">
              <span className="nudot-meta">[ 00 ]</span>
              <span className="nudot-meta">2026</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-right">
              <span className="nudot-meta">NEURO Business Futures</span>
              <span className="nudot-meta text-white/35">Cognitive Strategy / Executive Transformation</span>
            </div>
          </div>

          <div data-parallax="0.2" className="absolute right-5 top-36 hidden select-none md:block">
            <div className="hero-lettermark">NBF</div>
          </div>
          <span className="nudot-pill relative z-10 mb-7">{contentData.hero.badge}</span>
          <h1 className="relative z-10 max-w-[1100px] text-[2.7rem] font-black uppercase leading-[0.86] tracking-[-0.035em] sm:text-5xl md:text-6xl lg:text-[5.8rem] xl:text-[6rem]">
            {contentData.hero.headline}
          </h1>
          <div className="relative z-10 mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
            <p className="max-w-3xl border-l border-white/20 pl-5 text-sm leading-relaxed text-gray-300 md:text-base">
              {contentData.hero.subheadline}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button
                onClick={() => scrollToSection('framework')}
                className="rounded-full bg-white px-8 py-3 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:bg-cyan-200"
              >
                {contentData.hero.cta1}
              </button>
              <button
                onClick={() => scrollToSection('programs')}
                className="rounded-full border border-white/25 px-8 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                {contentData.hero.cta2}
              </button>
            </div>
          </div>
          <div className="keyword-cloud relative z-10 mt-10">
            {['Core-Site', 'Gen-AI Visual', 'Motion Flow', 'WebGL Realm', 'Interaction', 'Pixel Perfect', 'Logic Build', 'Fluid UI', 'Strategy', 'Design', 'Tech', 'Future'].map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="archive-marquee reverse relative z-10 mt-10">
        <span>
          WEBDESIGN / UI-UX / MOTION / BRANDING / COGNITIVE STRATEGY / RESPONSIBLE INNOVATION / COMMERCIALIZATION / EXECUTIVE EDUCATION / WEBDESIGN / UI-UX / MOTION / BRANDING / COGNITIVE STRATEGY / RESPONSIBLE INNOVATION /
        </span>
      </div>
    </section>
  );
};
