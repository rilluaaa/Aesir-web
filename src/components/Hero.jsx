import React from 'react';
import { contentData } from '../constants';
import VisualGrid from './VisualGrid';

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
        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside data-reveal className="bg-[#050505] p-4 md:p-5">
            <div className="mb-8 flex items-center justify-between">
              <span className="nudot-meta">[ 00 ]</span>
              <span className="nudot-meta">2026</span>
            </div>
            <div className="mb-8">
              <p className="nudot-meta mb-3">NEURO Business Futures</p>
              <p className="text-2xl font-black uppercase leading-none text-white">N B F</p>
            </div>
            <div className="space-y-3 border-y border-white/10 py-5">
              {['Digital / Motion / Interface', 'Cognitive Strategy', 'Executive Transformation', 'AI Built Around People'].map((item) => (
                <p key={item} className="nudot-meta">{item}</p>
              ))}
            </div>
            <button
              onClick={() => scrollToSection('achievements')}
              className="mt-8 w-full rounded-full border border-white/15 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:border-cyan-200 hover:text-cyan-200"
            >
              View Archive
            </button>
          </aside>

          <div className="bg-[#050505]">
            <div className="grid gap-px bg-white/10 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div data-reveal className="relative overflow-hidden bg-[#050505] p-5 md:p-7 lg:min-h-[560px]">
                <div data-parallax="0.2" className="absolute right-4 top-8 hidden select-none md:block">
                  <div className="hero-lettermark">NBF</div>
                </div>
                <span className="nudot-pill mb-6">{contentData.hero.badge}</span>
                <h1 className="relative z-10 max-w-4xl text-[2.7rem] font-black uppercase leading-[0.86] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.4rem]">
                  {contentData.hero.headline}
                </h1>
                <div className="relative z-10 mt-7 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_240px] lg:items-end">
                  <p className="max-w-2xl border-l border-white/20 pl-5 text-sm leading-relaxed text-gray-300 md:text-base">
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
                <div className="keyword-cloud relative z-10 mt-9">
                  {['Core-Site', 'Gen-AI Visual', 'Motion Flow', 'WebGL Realm', 'Interaction', 'Pixel Perfect', 'Logic Build', 'Fluid UI', 'Strategy', 'Design', 'Tech', 'Future'].map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </div>
              </div>
              
              <div data-reveal data-parallax="0.04" className="bg-[#050505] p-2">
                <div className="mb-2 flex items-center justify-between border border-white/10 px-4 py-3">
                  <span className="nudot-meta">COSMIC SERIES</span>
                  <span className="nudot-meta">01 // 05</span>
                </div>
                <VisualGrid />
              </div>
            </div>
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
