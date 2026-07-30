import React from 'react';
import { FormatCard, SectionTitle } from './Common';
import { contentData } from '../constants';

export const ProgramFormatSection = () => {
  const labImage = `${import.meta.env.BASE_URL}assets/images/advantage-neuro-lab.jpg?v=1`;

  return (
    <section className="editorial-section border-y border-white/10 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionTitle align="left" eyebrow="Program Format" title={contentData.format.title} />
            <div className="overflow-hidden border border-white/10 bg-black">
              <img
                src={labImage}
                alt="Executive participant wearing an EEG cap while viewing product testing visuals in a research lab"
                className="h-72 w-full object-cover md:h-96"
              />
            </div>
          </div>

          <div className="grid gap-5">
            {contentData.format.cards.map((card) => (
              <FormatCard key={card.label} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
