import React from 'react';
import { SectionTitle, FeatureCard } from './Common';
import { contentData } from '../constants';

export const VisionSection = () => (
  <section id="vision" className="editorial-section border-y border-white/10 py-20 px-6">
    <div className="max-w-7xl mx-auto">
      <SectionTitle 
        eyebrow="Vision"
        title={contentData.vision.title}
        subtitle={contentData.vision.description}
      />

      <div className="grid md:grid-cols-3 gap-8">
        {contentData.vision.cards.map((card, idx) => (
          <FeatureCard 
            key={idx}
            title={card.title}
            description={card.description}
            icon={['HI', 'SI', 'RL'][idx]}
          />
        ))}
      </div>
    </div>
  </section>
);
