import React from "react";
import { ProjectCard, SectionTitle } from "./Common";
import { contentData } from "../constants";

export const ProgramsSection = () => (
  <section
    id="programs"
    className="editorial-section px-6 py-20"
  >
    <div className="mx-auto max-w-7xl">
      <SectionTitle
        eyebrow="Applied Portfolio"
        title={contentData.programs.title}
        subtitle={contentData.programs.subtitle}
      />

      <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
        {contentData.programs.items.map((project) => (
          <ProjectCard
            key={`${project.number}-${project.title}-${project.media}`}
            project={project}
          />
        ))}
      </div>
    </div>
  </section>
);

export default ProgramsSection;
