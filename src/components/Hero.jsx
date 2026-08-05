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
        <div data-reveal className="relative overflow-hidden border border-white/10 bg-[#050505] p-5 md:p-8 lg:min-h-[720px] lg:p-12">
          <div className="relative z-10 mb-10 flex items-center justify-between gap-5 border-b border-white/10 pb-5">
            <div className="flex items-center gap-6">
              <span className="nudot-meta">[ 00 ]</span>
              <span className="nudot-meta">2026</span>
            </div>
            <span className="nudot-meta text-right">NEURO Business Futures</span>
          </div>

          <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.75fr)_minmax(260px,0.75fr)] lg:gap-12">
            <div>
              <span className="nudot-pill mb-7">{contentData.hero.badge}</span>
              <h1 className="max-w-[800px] text-[2.2rem] font-black uppercase leading-[0.88] tracking-[-0.035em] sm:text-5xl md:text-[3.8rem] lg:text-[4.35rem] xl:text-[4.75rem]">
                {contentData.hero.headline}
              </h1>
            </div>

            <div className="relative flex flex-col justify-end overflow-hidden border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pb-1 lg:pl-8 lg:pt-24">
              <div data-parallax="0.16" className="pointer-events-none absolute -right-5 top-8 hidden select-none opacity-60 lg:block">
                <div className="hero-lettermark">NBF</div>
              </div>
              <p className="relative z-10 max-w-xl text-sm leading-relaxed text-gray-300 md:text-base lg:text-[1.05rem]">
                {contentData.hero.subheadline}
              </p>
              <div className="relative z-10 mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col">
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
          </div>
          <div className="keyword-cloud relative z-10 mt-10 border-t border-white/10 pt-5 lg:mt-12">
            {['Core-Site', 'Gen-AI Visual', 'Motion Flow', 'WebGL Realm', 'Interaction', 'Pixel Perfect', 'Logic Build', 'Fluid UI', 'Strategy', 'Design', 'Tech', 'Future'].map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
