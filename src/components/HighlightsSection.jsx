import React from 'react';
import { HighlightCard, SectionTitle } from './Common';
import { contentData } from '../constants';

export const HighlightsSection = () => (
  <section className="px-6 py-20">
    <div className="mx-auto max-w-7xl">
      <SectionTitle
        eyebrow="Executive Roadmap"
        title={contentData.highlights.title}
        subtitle={contentData.highlights.subtitle}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {contentData.highlights.cards.map((card, index) => (
          <HighlightCard key={card.title} {...card} index={index} />
        ))}
      </div>
    </div>
  </section>
);
