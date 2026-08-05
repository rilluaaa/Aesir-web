import React from 'react';
import { SectionTitle, FeatureCard } from './Common';
import { contentData } from '../constants';

export const AITechSection = () => (
  <section id="ai" className="py-20 px-6 bg-dark-800/50">
    <div className="max-w-7xl mx-auto">
      <SectionTitle 
        title={contentData.aiTech.title}
        subtitle={contentData.aiTech.description}
      />
      
      <p className="text-center text-lg text-cyan-300 mb-12 max-w-3xl mx-auto font-semibold">
        {contentData.aiTech.positioning}
      </p>
      
      {/* Career Pathways */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-center mb-8">Career Pathways</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contentData.aiTech.pathways.map((pathway, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-br from-blue-900/40 to-cyan-900/20 border border-cyan-400/30 rounded-lg p-4 text-center"
            >
              <p className="text-gray-200 font-medium">{pathway}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
