import React from 'react';
import { ModuleCard, SectionTitle } from './Common';
import { contentData } from '../constants';

export const CurriculumSection = () => (
  <section id="curriculum" className="px-6 py-20">
    <div className="mx-auto max-w-7xl">
      <SectionTitle
        eyebrow="Curriculum"
        title={contentData.curriculum.title}
        subtitle={contentData.curriculum.subtitle}
      />

      <div className="space-y-8">
        {contentData.curriculum.phases.map((phase, phaseIndex) => (
          <div key={phase.title} className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="lg:border-r lg:border-white/15 lg:pr-6">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-cyan-300">
                Phase {phaseIndex + 1}
              </p>
              <h3 className="text-3xl font-black uppercase leading-none text-white">{phase.title}</h3>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {phase.modules.map((module) => (
                <ModuleCard key={module.number} module={module} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
