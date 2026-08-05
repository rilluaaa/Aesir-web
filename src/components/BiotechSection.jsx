import React from 'react';
import { SectionTitle } from './Common';
import { contentData } from '../constants';

export const BiotechSection = () => (
  <section className="py-20 px-6 bg-dark-800/50">
    <div className="max-w-7xl mx-auto">
      <SectionTitle 
        title={contentData.biotech.title}
        subtitle={contentData.biotech.description}
      />
      
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 mb-8">
        <p className="text-center text-lg text-cyan-300 font-semibold">
          {contentData.biotech.positioning}
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold mb-6 text-center">Future Leaders Will Need to Understand</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {contentData.biotech.futureLeaders.map((topic, idx) => (
            <div 
              key={idx}
              className="bg-dark-700/30 border border-dark-700 rounded-lg p-4 flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0"></div>
              <p className="text-gray-300">{topic}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
