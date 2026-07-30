import React, { useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';
import { ArrowRight, Menu, X } from 'lucide-react';
import RoundCarousel from './RoundCarousel';

const videoStream = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';

const areas = [
  {
    id: 'society',
    title: 'Society 5.0',
    label: 'Human-Centric Cyber-Physical Frameworks',
    summary:
      'Designing inclusive smart-city frameworks that move beyond automated efficiency toward human-centered public infrastructure.',
    detail:
      'Originally introduced in Japan\'s Fifth Science and Technology Basic Plan, Society 5.0 positions a human-centric cyber-physical society as a strategic alternative on the world stage, aligned with South Korea\'s Digital New Deal, Singapore\'s Smart Nation, and equivalent European Union frameworks. This program area designs frameworks to reduce the public fiscal burdens of long-term elderly and disability care, while examining the convergence of the physical world with cyberspace to solve deep-seated societal issues. The focus is Asia\'s super-aging demographics, healthcare equity, spatial computing, decentralized data networks, edge computing, zero-barrier municipal spaces, active-aging gamified frameworks, and remote mental wellness ecosystems.'
  },
  {
    id: 'ax',
    title: 'AX',
    label: 'AI Transformation',
    summary:
      'Helping institutions shift from digital transformation to AI transformation through cognitive ergonomics and human-AI workflow design.',
    detail:
      'AX marks a critical pivot in national innovation policies. Governments are shifting from simply digitizing records to treating AI as foundational public infrastructure. AX remodels organizational structures, labor economic models, and workflows through autonomous systems. This research focuses on cognitive ergonomics in the AI-human co-working era, with neural-feedback models and micro-expression AI analytics used to quantify cognitive load, focus economies, and emotional burnout during AI interaction. The work blends deep data analytics with corporate behavioral modeling to design elite, scalable AX blueprints.'
  },
  {
    id: 'nbf',
    title: 'NEURO Business Futures',
    label: 'Immersive Neurodiversity & Inclusive Tech Markets',
    summary:
      'Commercializing immersive, inclusive technologies for neurodiversity, clinical learning, assistive markets, and future education.',
    detail:
      'This area leads research on how multi-sensory XR environments, combined with generative AI, can act as scalable, non-pharmacological diagnostic tools and therapeutic interventions for individuals with neurodivergent conditions such as Autism, Dyslexia, Dementia, and ADHD. The research maps cognitive spatial data, kinetic tracking, and eye-gaze variations to create hyper-personalized, gamified clinical learning protocols while investigating the market economics and supply-chain scalability of assistive technology. It builds on the legacy of Hong Kong\'s first AR positive psychology playbook and AESIR\'s Top 500 Global Tech Startup ranking, using validated data points, NGO networks, and hospital collaborations as an established testing sandbox.'
  }
];

const outputs = [
  { title: 'HKFYG Research', label: 'Convenor / Participatory Research' },
  { title: 'CatalystNow', label: 'Global Impact Network Output' },
  { title: 'Applied Program Design', label: 'XR, AI, HCI and Public Value' },
  { title: 'HKBU', label: 'Academic and Innovation Collaboration' },
  { title: 'ICT Award', label: 'Recognized Technology Achievement' }
];

const evidenceLinks = [
  { label: 'Evidence Source 01', href: 'https://share.google/aimode/UvKrFhmW1hJrX3uHA' },
  { label: 'Evidence Source 02', href: 'https://share.google/aimode/SJW2wvTeYrOyhjiqx' },
  {
    label: 'Immersive Neurodiversity & Inclusive Tech Markets',
    href: 'https://share.google/aimode/hnLnEuwUcngKOb2mq'
  }
];

const bannerText = [
  'Evidence-Based Immersive Intelligence',
  'AI AR VR Gaming',
  'Human-Computer Interaction',
  'Inclusive Digital Infrastructure',
  'APAC Smart Cities',
  'Clinical Empathy',
  'Market-Validated Social Technology'
];

const navLinks = [
  { href: '#founder-archive', label: 'PROJECTS' },
  { href: '#outputs', label: 'BLOG' },
  { href: '#areas', label: 'ABOUT' },
  { href: '#outputs', label: 'RESUME' }
];

const repeatedBanner = Array(4).fill(bannerText.join('  /  ')).join('  /  ');
const founderAsset = (fileName) => `${import.meta.env.BASE_URL}assets/founders/${fileName}`;

const founderImages = [
  { src: founderAsset('community-program.jpg'), alt: 'Founders with online counselling and virtual reality programme partners' },
  { src: founderAsset('hkict-awards.jpeg'), alt: 'Founders at the Hong Kong ICT Awards presentation ceremony' },
  { src: founderAsset('business-practicum.jpeg'), alt: 'Founders with business practicum participants' },
  { src: founderAsset('aesir-presentation.jpeg'), alt: 'AESIR presentation and award moment' },
  { src: founderAsset('founder-speaking.jpeg'), alt: 'Founder speaking at a training session' },
  { src: founderAsset('aesir-detail.jpg'), alt: 'AESIR founders archive photograph' },
  { src: founderAsset('founders-interview.jpg'), alt: 'Founders interview portrait' }
];

const HlsBackground = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let hls;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoStream;
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: false });
      hls.loadSource(videoStream);
      hls.attachMedia(video);
    }

    return () => {
      hls?.destroy();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover opacity-60"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
    />
  );
};

const LiquidGlassCard = () => (
  <div data-reveal className="liquid-glass-card relative z-10 flex h-[200px] w-[200px] translate-y-[-50px] flex-col justify-between p-5">
    <p className="font-jakarta text-sm font-bold uppercase tracking-[0.24em] text-white/70">[ 2025 ]</p>
    <div>
      <h2 className="text-lg font-semibold leading-tight text-white">
        Led by <span className="font-serif-italic italic">Industry</span> Practitioners
      </h2>
      <p className="mt-3 text-[11px] leading-relaxed text-white/60">
        Practical innovators translating XR, AI, HCI, and public policy into measurable social infrastructure.
      </p>
    </div>
  </div>
);

export const ImmersiveIntelligenceSite = () => {
  const [activeArea, setActiveArea] = useState(areas[0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const selectedArea = useMemo(
    () => areas.find((area) => area.id === activeArea) || areas[0],
    [activeArea]
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <main id="top" className="relative min-h-screen overflow-hidden bg-[#070b0a] text-white">
      <section className="relative min-h-screen overflow-hidden px-5 pb-16 pt-6 sm:px-8 lg:px-12">
        <HlsBackground />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b0a] via-[#070b0a]/72 to-transparent" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a] via-[#070b0a]/35 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 left-1/4 hidden w-px bg-white/10 lg:block" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-white/10 lg:block" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 left-3/4 hidden w-px bg-white/10 lg:block" aria-hidden="true" />
        <svg className="pointer-events-none absolute left-1/2 top-16 h-64 w-[720px] -translate-x-1/2 opacity-70" viewBox="0 0 720 260" aria-hidden="true">
          <defs>
            <filter id="founderGlow" x="-20%" y="-80%" width="140%" height="260%">
              <feGaussianBlur stdDeviation="25" />
            </filter>
          </defs>
          <ellipse cx="360" cy="94" rx="285" ry="42" fill="#1f9f77" filter="url(#founderGlow)" opacity="0.58" />
          <ellipse cx="360" cy="102" rx="210" ry="24" fill="#5ed29c" filter="url(#founderGlow)" opacity="0.28" />
        </svg>

        <header className="absolute left-0 right-0 top-0 z-40 px-5 py-6 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
            <a href="#top" className="font-inter text-xl font-extrabold uppercase tracking-tight text-white">
              Founders
            </a>
            <nav className="hidden items-center gap-10 font-inter text-base font-medium text-white lg:flex">
              {navLinks.map((item) => (
                <a key={item.href} href={item.href} className="transition hover:text-[#5ed29c]">
                  {item.label}
                </a>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-full border border-white/15 p-3 text-white transition hover:border-[#5ed29c] hover:text-[#5ed29c] lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </header>

        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-[#070b0a]/98 px-5 py-6 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between">
              <a href="#top" onClick={closeMenu} className="font-inter text-xl font-extrabold uppercase tracking-tight text-white">
                Founders
              </a>
              <button
                type="button"
                onClick={closeMenu}
                className="rounded-full border border-white/15 p-3 text-white transition hover:border-[#5ed29c] hover:text-[#5ed29c]"
                aria-label="Close navigation menu"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="mt-20 flex flex-col gap-8 font-inter text-4xl font-extrabold uppercase tracking-tight text-white">
              {navLinks.map((item) => (
                <a key={item.href} href={item.href} onClick={closeMenu} className="transition hover:text-[#5ed29c]">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end pb-8 pt-40 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:gap-14 lg:pb-16">
          <div>
            <LiquidGlassCard />
            <p data-reveal className="font-jakarta text-[11px] font-bold uppercase tracking-[0.24em] text-[#5ed29c]">
              Forward Thinking Practitioners
            </p>
            <h1 data-reveal className="mt-5 max-w-5xl font-inter text-[40px] font-extrabold uppercase leading-[0.9] tracking-tight text-white sm:text-6xl lg:text-[72px]">
              Founders<span className="text-[#5ed29c]">.</span>
            </h1>
            <p data-reveal className="mt-6 max-w-xl font-inter text-sm leading-relaxed text-white/70">
              Ernest HS CHAN & Zero Yun Wa WONG are social entrepreneurs in AI, AR, VR, and gaming, bridging human neurodiversity and frontier technology through evidence-based immersive intelligence.
            </p>
            <div data-reveal className="mt-8 flex flex-wrap gap-3">
              <a href="#areas" className="inline-flex items-center gap-2 rounded-full bg-[#5ed29c] px-6 py-3 font-inter text-xs font-extrabold uppercase tracking-[0.16em] text-[#070b0a] transition hover:bg-white">
                Explore Interests
                <ArrowRight size={16} />
              </a>
              <a href="#founder-archive" className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 font-inter text-xs font-extrabold uppercase tracking-[0.16em] text-white transition hover:border-[#5ed29c] hover:text-[#5ed29c]">
                Founder Archive
              </a>
            </div>
          </div>

          <div data-reveal className="mt-12 hidden border-l border-white/10 pl-7 lg:block">
            <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.24em] text-[#5ed29c]">Led By</p>
            <p className="mt-4 font-inter text-2xl font-extrabold uppercase leading-tight text-white">
              Ernest HS CHAN<br />Zero Yun Wa WONG
            </p>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Practical innovators translating industrial-grade XR and AI architectures into inclusive digital infrastructure across APAC and global smart cities.
            </p>
          </div>
        </div>
      </section>

      <section id="founder-archive" className="relative bg-[#070b0a] px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.55fr_1.45fr]">
          <div data-reveal className="border-t border-white/10 pt-6">
            <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.24em] text-[#5ed29c]">Founder Archive</p>
            <h2 className="mt-5 font-inter text-4xl font-extrabold uppercase leading-[0.88] text-white md:text-6xl">
              Applied Work in Motion
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/65 md:text-base">
              A rotating visual record of award moments, public education, business programs, applied training, and AESIR founder milestones. Drag the carousel to explore the archive.
            </p>
          </div>
          <div data-reveal className="relative h-[430px] overflow-hidden border border-white/10 bg-white/[0.025] md:h-[560px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(94,210,156,0.18),transparent_34rem)]" aria-hidden="true" />
            <RoundCarousel
              images={founderImages}
              imageWidth={300}
              imageHeight={220}
              spacing={4}
              speed={4.2}
              tilt={-8}
              perspective={2600}
              cornerRadius={18}
              background="transparent"
            />
          </div>
        </div>
      </section>

      <div className="archive-marquee">
        <span>{repeatedBanner}</span>
      </div>
      <div className="archive-marquee reverse">
        <span>{repeatedBanner}</span>
      </div>

      <section className="relative bg-[#070b0a] px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div data-reveal className="border-t border-white/10 pt-6">
            <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.24em] text-[#5ed29c]">Operating Philosophy</p>
            <h2 className="mt-5 font-inter text-4xl font-extrabold uppercase leading-[0.9] md:text-6xl">
              Immersive Pragmatism
            </h2>
          </div>
          <div data-reveal className="border border-white/10 bg-white/[0.025] p-7 backdrop-blur md:p-9">
            <p className="text-xl leading-relaxed text-white md:text-2xl">
              We value "Immersive Pragmatism" - the ability to fuse pioneering, peer-reviewed scientific discovery with market-validated, high-impact societal deployment.
            </p>
            <p className="mt-6 text-base leading-relaxed text-white/65">
              For those who seek validated industrial execution, cross-sector governance experience, and real-world clinical empathy.
            </p>
          </div>
        </div>
      </section>

      <section id="areas" className="bg-[#070b0a] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="mb-12 max-w-4xl border-t border-white/10 pt-6">
            <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.24em] text-[#5ed29c]">Three Areas of Interest</p>
            <h2 className="mt-5 font-inter text-4xl font-extrabold uppercase leading-[0.9] md:text-6xl">
              Human-Centered Futures in Parallel
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {areas.map((area, index) => {
              const isActive = activeArea === area.id;

              return (
                <div
                  key={area.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveArea(area.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setActiveArea(area.id);
                    }
                  }}
                  className={`group min-h-[340px] cursor-pointer border p-6 text-left transition duration-300 hover:-translate-y-1 ${
                    isActive
                      ? 'border-[#5ed29c] bg-[#5ed29c] text-[#070b0a] shadow-[0_0_70px_rgba(94,210,156,0.16)]'
                      : 'border-white/10 bg-white/[0.025] text-white hover:border-[#5ed29c]/70'
                  }`}
                >
                  <div className="mb-12 flex items-center justify-between">
                    <span className={`font-inter text-4xl font-extrabold ${isActive ? 'text-[#070b0a]/20' : 'text-white/10'}`}>0{index + 1}</span>
                    <span className={`font-jakarta text-[10px] font-bold uppercase tracking-[0.22em] ${isActive ? 'text-[#070b0a]/55' : 'text-[#5ed29c]'}`}>
                      Click to Expand
                    </span>
                  </div>
                  <h3 className="font-inter text-3xl font-extrabold uppercase leading-none">{area.title}</h3>
                  <p className={`mt-3 font-jakarta text-xs font-bold uppercase tracking-[0.2em] ${isActive ? 'text-[#070b0a]/65' : 'text-white/45'}`}>
                    {area.label}
                  </p>
                  <p className={`mt-6 text-sm leading-relaxed ${isActive ? 'text-[#070b0a]/75' : 'text-white/60'}`}>
                    {area.summary}
                  </p>
                  {area.id === 'nbf' && (
                    <a
                      href="#/neuro"
                      onClick={(event) => event.stopPropagation()}
                      className={`mt-7 inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-inter text-[10px] font-extrabold uppercase tracking-[0.16em] transition ${
                        isActive
                          ? 'bg-[#070b0a] text-white hover:bg-white hover:text-[#070b0a]'
                          : 'bg-[#5ed29c] text-[#070b0a] hover:bg-white'
                      }`}
                    >
                      Go to NEURO Business Futures
                      <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          <article data-reveal className="mt-6 border border-white/10 bg-white/[0.025] p-7 backdrop-blur md:p-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.24em] text-[#5ed29c]">Selected Focus</p>
                <h3 className="mt-3 font-inter text-3xl font-extrabold uppercase leading-none text-white md:text-5xl">
                  {selectedArea.title}
                </h3>
              </div>
              <span className="rounded-full border border-[#5ed29c]/30 bg-[#5ed29c]/10 px-4 py-2 font-jakarta text-[10px] font-bold uppercase tracking-[0.18em] text-[#5ed29c]">
                {selectedArea.label}
              </span>
            </div>
            <p className="max-w-5xl text-base leading-relaxed text-white/65 md:text-lg">
              {selectedArea.detail}
            </p>
          </article>
        </div>
      </section>

      <section id="outputs" className="relative bg-[#070b0a] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="mb-12 max-w-4xl border-t border-white/10 pt-6">
            <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.24em] text-[#5ed29c]">Publications and Program Outputs</p>
            <h2 className="mt-5 font-inter text-4xl font-extrabold uppercase leading-[0.9] md:text-6xl">
              Evidence, Programs, Recognition
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {outputs.map((output) => (
              <div key={output.title} data-reveal className="border border-white/10 bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-[#5ed29c]/70">
                <h3 className="font-inter text-xl font-extrabold uppercase leading-none text-white">{output.title}</h3>
                <p className="mt-5 font-jakarta text-xs font-bold uppercase tracking-[0.2em] text-[#5ed29c]">{output.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div data-reveal className="border border-white/10 bg-white/[0.025] p-7">
              <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.24em] text-[#5ed29c]">Training Profile</p>
              <h3 className="mt-5 font-inter text-3xl font-extrabold uppercase leading-none text-white">HKPC AI Gamification</h3>
              <p className="mt-5 leading-relaxed text-white/65">
                Practical training profile focused on AI-enabled gamification, immersive learning design, and measurable adoption for public and enterprise contexts.
              </p>
            </div>

            <div data-reveal className="border border-white/10 bg-white/[0.025] p-7">
              <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.24em] text-[#5ed29c]">Reference Links</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {evidenceLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 font-inter text-[10px] font-extrabold uppercase tracking-[0.16em] text-white transition hover:border-[#5ed29c] hover:bg-[#5ed29c] hover:text-[#070b0a]"
                  >
                    {link.label} -&gt;
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#070b0a] px-4 py-20 sm:px-6">
        <div data-reveal className="mx-auto max-w-5xl border border-white/15 bg-white/[0.025] p-8 text-center md:p-14">
          <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.24em] text-[#5ed29c]">Connected Platform</p>
          <h2 className="mx-auto mt-5 max-w-4xl font-inter text-4xl font-extrabold uppercase leading-[0.94] tracking-tight text-white md:text-6xl">
            Connect Evidence-Based Immersive Intelligence to Executive Transformation.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/65">
            NEURO Business Futures translates these areas of practice into a premium executive education ecosystem for leaders shaping the future intelligence economy.
          </p>
        </div>
      </section>
    </main>
  );
};
