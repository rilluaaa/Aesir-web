import React from 'react';

const cardBase = "border border-white/10 bg-[#060606] backdrop-blur transition-all duration-300";
const publicAsset = (path) => /^https?:\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const projectViewer = (project) => {
  const params = new URLSearchParams({
    title: project.title,
    category: project.category,
    media: publicAsset(project.media),
    link: project.link
  });

  return `${import.meta.env.BASE_URL}project-viewer.html?${params.toString()}`;
};

export const SectionTitle = ({ eyebrow, title, subtitle, align = "center" }) => (
  <div data-reveal className={`${align === "left" ? "text-left" : "text-center mx-auto"} mb-12 max-w-5xl border-t border-white/10 pt-5`}>
    <div className={`${align === "left" ? "" : "mx-auto"} mb-5 flex max-w-4xl items-center justify-between gap-4`}>
      {eyebrow && (
        <p className="text-[10px] font-black uppercase tracking-[0.34em] text-cyan-300">
          [ {eyebrow} ]
        </p>
      )}
      <span className="hidden h-px flex-1 bg-white/10 sm:block" />
      <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/30">Index</span>
    </div>
    <h2 className="text-4xl font-black uppercase leading-[0.86] tracking-tight text-white md:text-6xl lg:text-7xl">{title}</h2>
    {subtitle && <p className={`${align === "left" ? "" : "mx-auto"} mt-5 max-w-3xl text-base leading-relaxed text-gray-400 md:text-lg`}>{subtitle}</p>}
  </div>
);

export const FeatureCard = ({ title, description, icon }) => (
  <div data-reveal className={`${cardBase} p-7`}>
    {icon && <div className="mb-10 text-5xl font-black uppercase text-white/10">{icon}</div>}
    <h3 className="mb-3 text-2xl font-black uppercase leading-none text-white">{title}</h3>
    <p className="leading-relaxed text-gray-300">{description}</p>
  </div>
);

export const AxisCard = ({ title, label, description, index }) => (
  <div data-reveal className={`${cardBase} relative overflow-hidden p-7`}>
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
    <div className="mb-8 flex items-center justify-between gap-4">
      <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">
        {label}
      </span>
      <span className="text-4xl font-bold text-white/10">0{index + 1}</span>
    </div>
    <h3 className="mb-4 text-3xl font-black uppercase leading-none text-white">{title}</h3>
    <p className="leading-relaxed text-gray-300">{description}</p>
  </div>
);

export const FormatCard = ({ label, title, description }) => (
  <div data-reveal className={`${cardBase} p-7`}>
    <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-cyan-300">{label}</p>
    <h3 className="mb-4 text-3xl font-black uppercase leading-none text-white">{title}</h3>
    <p className="leading-relaxed text-gray-300">{description}</p>
  </div>
);

export const ModuleCard = ({ module }) => (
  <div data-reveal className="border border-white/10 bg-[#080808] p-6">
    <div className="mb-4 flex items-start gap-4">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/20 text-sm font-black text-cyan-200">
        {module.number}
      </span>
      <h4 className="text-lg font-black uppercase leading-snug text-white">{module.title}</h4>
    </div>
    <div className="space-y-3 text-sm leading-relaxed text-gray-300">
      <p><span className="font-semibold text-cyan-200">Focus:</span> {module.focus}</p>
      <p><span className="font-semibold text-cyan-200">Application:</span> {module.application}</p>
    </div>
  </div>
);

export const HighlightCard = ({ title, description, index }) => (
  <div data-reveal className={`${cardBase} p-7`}>
    <span className="mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm font-black text-cyan-200">
      {index + 1}
    </span>
    <h3 className="mb-4 text-2xl font-black uppercase leading-none text-white">{title}</h3>
    <p className="leading-relaxed text-gray-300">{description}</p>
  </div>
);

export const ProjectCard = ({ project }) => (
  <div data-reveal className={`${cardBase} group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-[#0d0d0d]`}>
    {project.media && (
      <div className="aspect-[16/10] w-full overflow-hidden border-b border-white/10 bg-black">
        <img
          src={publicAsset(project.media)}
          alt={`${project.title} project media`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    )}
    <div className="flex flex-1 flex-col p-5">
    <div className="mb-5 flex items-center justify-between gap-4">
      <span className="w-fit rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
        {project.category}
      </span>
      {project.number && <span className="text-lg font-black text-white/20">{project.number}</span>}
    </div>
    <h3 className="mb-4 text-xl font-black uppercase leading-none text-white">{project.title}</h3>
    <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-400">{project.description}</p>
    <a
      href={project.media ? projectViewer(project) : project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:bg-cyan-200"
    >
      View Project
      <span aria-hidden="true">-&gt;</span>
    </a>
    </div>
  </div>
);

export const ImpactCard = ({ title, description }) => (
  <div data-reveal className={`${cardBase} p-7`}>
    <h3 className="mb-3 text-2xl font-black uppercase leading-none text-cyan-200">{title}</h3>
    <p className="leading-relaxed text-gray-300">{description}</p>
  </div>
);

export const PartnershipCard = ({ title }) => (
  <div data-reveal className={`${cardBase} p-6 text-center`}>
    <p className="text-sm font-black uppercase tracking-[0.16em] text-gray-100">{title}</p>
  </div>
);

export const DecisionCard = ({ title, question, index }) => (
  <div data-reveal className={`${cardBase} p-7`}>
    <p className="mb-4 text-[11px] font-black uppercase tracking-[0.28em] text-cyan-300">Decision 0{index + 1}</p>
    <h3 className="mb-4 text-2xl font-black uppercase leading-none text-white">{title}</h3>
    <p className="leading-relaxed text-gray-300">{question}</p>
  </div>
);

export const CTASection = ({ headline, subtext, buttonText }) => (
  <section className="px-6 py-20">
    <div className="mx-auto max-w-5xl overflow-hidden border border-white/15 bg-[#080808] p-8 text-center md:p-14">
      <h2 className="mx-auto max-w-4xl text-4xl font-black uppercase leading-[0.94] tracking-tight text-white md:text-6xl">{headline}</h2>
      <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-300">{subtext}</p>
      <button className="mt-8 rounded-full bg-white px-8 py-3 text-sm font-black uppercase tracking-[0.16em] text-black">
        {buttonText}
      </button>
    </div>
  </section>
);

export const Footer = ({ text }) => (
  <footer className="border-t border-white/10 bg-[#050505] px-6 py-10">
    <div className="mx-auto max-w-7xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">{text}</p>
    </div>
  </footer>
);
