import React from 'react';
import { PartnershipCard, SectionTitle } from './Common';
import { contentData } from '../constants';

export const PartnershipsSection = () => (
  <section id="partnerships" className="editorial-section border-y border-white/10 py-20 px-6">
    <div className="max-w-7xl mx-auto">
      <SectionTitle 
        title={contentData.partnerships.title}
        subtitle={contentData.partnerships.description}
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contentData.partnerships.cards.map((partnership) => (
          <PartnershipCard key={partnership} title={partnership} />
        ))}
      </div>
    </div>
  </section>
);
