import React from 'react';
import { SectionTitle, ImpactCard } from './Common';
import { contentData } from '../constants';

export const ImpactSection = () => (
  <section id="impact" className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
      <SectionTitle eyebrow="Future Economy" title={contentData.impact.title} />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contentData.impact.cards.map((card, idx) => (
          <ImpactCard 
            key={idx}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  </section>
);
