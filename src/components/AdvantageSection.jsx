import React from 'react';
import { SectionTitle } from './Common';
import { contentData } from '../constants';

export const AdvantageSection = () => {
  const labImage = `${import.meta.env.BASE_URL}assets/images/advantage-neuro-lab.jpg?v=1`;

  return (
    <section id="approach" className="py-20 px-6 bg-dark-800/50">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title={contentData.advantage.title}
          subtitle={contentData.advantage.description}
        />

        <div className="mb-10 overflow-hidden rounded-xl border border-cyan-400/20 bg-dark-900/40 shadow-2xl shadow-blue-900/20">
          <img
            src={labImage}
            alt="Participant wearing an EEG cap while viewing product testing visuals in a research lab"
            className="h-72 w-full object-cover sm:h-96"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentData.advantage.items.map((item, idx) => (
            <div key={idx} className="bg-dark-700/30 border border-dark-700 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex-shrink-0 flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <p className="text-gray-300">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
