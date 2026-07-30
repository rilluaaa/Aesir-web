import React from 'react';
import { SectionTitle, ProcessStep } from './Common';
import { contentData } from '../constants';

export const HumanResponseSection = () => (
  <section className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
      <SectionTitle 
        title={contentData.humanResponse.title}
        subtitle={contentData.humanResponse.description}
      />
      
      {/* Process visualization */}
      <div className="grid md:grid-cols-5 gap-4 md:gap-2 mb-12">
        {contentData.humanResponse.steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <ProcessStep 
              number={idx + 1}
              label={step.label}
              description={step.description}
            />
            {idx < contentData.humanResponse.steps.length - 1 && (
              <div className="hidden md:block text-2xl text-gray-600 mt-8 mb-4">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);
