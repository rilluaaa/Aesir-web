import React from 'react';
import { DecisionCard, SectionTitle } from './Common';
import { contentData } from '../constants';

export const NextStepsSection = () => (
  <section className="px-6 py-20">
    <div className="mx-auto max-w-7xl">
      <SectionTitle
        eyebrow="Next Steps"
        title={contentData.decisions.title}
        subtitle={contentData.decisions.subtitle}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {contentData.decisions.cards.map((card, index) => (
          <DecisionCard key={card.title} {...card} index={index} />
        ))}
      </div>
    </div>
  </section>
);
