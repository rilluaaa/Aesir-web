import React from 'react';
import { AxisCard, SectionTitle } from './Common';
import { contentData } from '../constants';

export const FrameworkSection = () => (
  <section id="framework" className="px-6 py-20">
    <div className="mx-auto max-w-7xl">
      <SectionTitle
        eyebrow="Framework"
        title={contentData.framework.title}
        subtitle={contentData.framework.subtitle}
      />

      <div className="relative">
        <div className="absolute left-1/2 top-10 hidden h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent lg:block" />
        <div className="grid gap-6 lg:grid-cols-3">
          {contentData.framework.axes.map((axis, index) => (
            <AxisCard key={axis.title} {...axis} index={index} />
          ))}
        </div>
      </div>
    </div>
  </section>
);
