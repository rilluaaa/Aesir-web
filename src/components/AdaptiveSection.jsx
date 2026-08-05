import React from 'react';
import { SectionTitle } from './Common';
import { contentData } from '../constants';

export const AdaptiveSection = () => (
  <section className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
      <SectionTitle 
        title={contentData.adaptive.title}
        subtitle={contentData.adaptive.description}
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contentData.adaptive.aspects.map((aspect, idx) => (
          <div 
            key={idx}
            className="bg-dark-800/50 border border-dark-700 rounded-xl p-8 text-center"
          >
            <div className="text-4xl mb-3">{['📊', '⚡', '🎯', '🌟'][idx]}</div>
            <h3 className="font-bold text-lg mb-2">{aspect.title}</h3>
            <p className="text-gray-400 text-sm">{aspect.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
