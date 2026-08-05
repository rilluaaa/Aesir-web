import React, { useEffect, useState } from 'react';
import { SectionTitle } from './Common';
import { achievementCertificates } from '../achievementCertificates';
import CertificateCoverflow from './CertificateCoverflow';

const assetPath = (path) => /^https?:\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const AchievementsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeCertificate = achievementCertificates[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) => (
      current === 0 ? achievementCertificates.length - 1 : current - 1
    ));
  };

  const goToNext = () => {
    setActiveIndex((current) => (
      current === achievementCertificates.length - 1 ? 0 : current + 1
    ));
  };

  useEffect(() => {
    if (isPaused) return undefined;

    const rotation = window.setInterval(() => {
      setActiveIndex((current) => (
        current === achievementCertificates.length - 1 ? 0 : current + 1
      ));
    }, 3200);

    return () => window.clearInterval(rotation);
  }, [isPaused]);

  return (
    <section id="achievements" className="editorial-section px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionTitle
            eyebrow="Achievements"
            title="Certificates & Recognition"
            subtitle="A visual archive of AESIR certificates and achievement records."
            align="left"
          />

          <div className="flex flex-wrap items-center gap-3 lg:justify-self-end">
            <button
              type="button"
              onClick={goToPrevious}
              className="flex h-11 w-11 items-center justify-center border border-white/15 text-lg font-black text-white transition hover:border-cyan-200 hover:text-cyan-200"
              aria-label="Previous certificate"
            >
              &lt;
            </button>
            <div className="border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-black uppercase tracking-[0.28em] text-gray-400">
              {activeCertificate.number} // {achievementCertificates.length}
            </div>
            <button
              type="button"
              onClick={goToNext}
              className="flex h-11 w-11 items-center justify-center border border-white/15 text-lg font-black text-white transition hover:border-cyan-200 hover:text-cyan-200"
              aria-label="Next certificate"
            >
              &gt;
            </button>
            <a
              href={assetPath(activeCertificate.source)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-cyan-200"
            >
              Open Certificate
            </a>
          </div>
        </div>

        <div
          data-reveal
          className="overflow-hidden border border-white/10 bg-[#070707]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div className="relative overflow-hidden bg-[#070707] p-4 md:p-8">
            <div className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent" />
            <CertificateCoverflow
              certificates={achievementCertificates}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default AchievementsSection;
