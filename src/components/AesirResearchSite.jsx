import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Menu,
  Search,
  X,
} from "lucide-react";
import { aesirProjects } from "../projectPortfolio";
import "./AesirResearchSite.css";

const contactUrl = "https://aesir.hk/#contactus";
const videoStream =
  "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";
const asset = (path) =>
  /^https?:\/\//.test(path)
    ? path
    : `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const researchAreas = [
  {
    id: "society",
    title: "Society 5.0",
    subtitle: "Human-Centric Cyber-Physical Frameworks",
    summary:
      "Designing public infrastructure that uses advanced technology to expand human agency, access, and quality of life.",
    context:
      "Society 5.0 reframes smart-city development around human wellbeing rather than automated efficiency alone. The work responds to Asia's super-ageing population, unequal access to care, and the need for inclusive municipal services.",
    focus:
      "Spatial computing, edge and decentralised data networks, active-ageing systems, zero-barrier public spaces, and remote mental-wellness ecosystems.",
    application:
      "Frameworks that reduce long-term elderly and disability-care burdens while helping cities move from Industry 4.0 efficiency to human-centred inclusion.",
    tags: ["Smart Cities", "Active Ageing", "Public Infrastructure"],
  },
  {
    id: "ax",
    title: "AX",
    subtitle: "AI Transformation",
    summary:
      "Redesigning institutions, workflows, and human performance for an era in which AI becomes foundational infrastructure.",
    context:
      "AX goes beyond digitising records. It changes how organisations allocate attention, make decisions, organise labour, and coordinate autonomous systems with people.",
    focus:
      "Cognitive ergonomics, neural-feedback models, micro-expression analytics, cognitive-load measurement, focus economies, and emotional burnout during AI interaction.",
    application:
      "Evidence-led transformation blueprints that combine deep data analytics with behavioural modelling for scalable, responsible human-AI collaboration.",
    tags: ["Cognitive Ergonomics", "Human-AI Work", "Behavioural Analytics"],
  },
  {
    id: "neuro",
    title: "NEURO Business Futures",
    subtitle: "Immersive Neurodiversity & Inclusive Tech Markets",
    summary:
      "Developing scalable immersive systems for neurodivergent learning, assessment, wellbeing, and inclusive technology markets.",
    context:
      "Multi-sensory XR and generative AI can create non-pharmacological pathways for people with Autism, Dyslexia, Dementia, ADHD, and other neurodivergent conditions.",
    focus:
      "Cognitive spatial data, kinetic tracking, eye-gaze variation, personalised gamified protocols, assistive-technology economics, and clinical learning environments.",
    application:
      "Research grounded in AESIR's AR positive-psychology playbook, NGO and hospital networks, validated field data, and an established clinical-grade testing sandbox.",
    tags: ["Neurodiversity", "Clinical Learning", "Assistive Technology"],
  },
];

const outputs = [
  {
    title: "HKFYG Research",
    description: "Convenor and participatory research experience connecting young people, practitioners, and applied social inquiry.",
  },
  {
    title: "CatalystNow",
    description: "Global impact-network participation linking local deployment knowledge with wider systems-change practice.",
  },
  {
    title: "HKBU Collaboration",
    description: "Academic and innovation collaboration supporting knowledge exchange, experimentation, and applied learning.",
  },
  {
    title: "Applied Program Design",
    description: "XR, AI, HCI, and public-value programs shaped for adoption beyond the laboratory.",
  },
];

const methodSteps = [
  ["Research", "Frame a human problem with scientific, market, and policy context."],
  ["Prototype", "Turn evidence into testable XR, AI, and interaction architectures."],
  ["Field Validation", "Work with real users, institutions, practitioners, and communities."],
  ["Public Value", "Measure adoption, inclusion, wellbeing, and commercial scalability."],
];

const newPhotos = [
  {
    src: "assets/aesir/founder-panel.webp",
    alt: "Ernest HS CHAN speaking during a public panel discussion",
    label: "Public dialogue",
  },
  {
    src: "assets/aesir/ai-for-all.webp",
    alt: "AESIR and programme partners at the AI for All Inclusive Programme",
    label: "Inclusive AI deployment",
  },
  {
    src: "assets/aesir/hkict-2021.webp",
    alt: "Ernest HS CHAN and participants at the 2021 Hong Kong ICT Awards ceremony",
    label: "Technology ecosystem",
  },
  {
    src: "assets/aesir/business-practicum.webp",
    alt: "Business practicum participants and cross-sector partners",
    label: "Cross-sector practice",
  },
];

const archivePhotos = [
  ["assets/founders/community-program.jpg", "Community counselling and virtual reality programme partners"],
  ["assets/founders/hkict-awards.jpeg", "AESIR archive photograph at a technology event"],
  ["assets/founders/business-practicum.jpeg", "Business practicum participants"],
  ["assets/founders/aesir-presentation.jpeg", "AESIR presentation moment"],
  ["assets/founders/founder-speaking.jpeg", "Founder speaking at an applied training session"],
  ["assets/founders/aesir-detail.jpg", "AESIR founders archive photograph"],
  ["assets/founders/founders-interview.jpg", "AESIR founders interview portrait"],
];

const navItems = [
  ["Research", "research"],
  ["Method", "method"],
  ["Evidence", "evidence"],
  ["Projects", "projects"],
  ["Leadership", "leadership"],
];

const projectViewer = (project) => {
  const params = new URLSearchParams({
    title: project.title,
    category: project.category,
    media: asset(project.media),
    link: project.link,
  });

  return `${asset("project-viewer.html")}?${params.toString()}`;
};

const scrollToSection = (id) => {
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

  if (id === "top") {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
};

function useEntryMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const elements = Array.from(document.querySelectorAll(".hero-section [data-enter]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-entered");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function Header() {
  const [open, setOpen] = useState(false);

  const navigate = (id) => {
    scrollToSection(id);
    setOpen(false);
  };

  return (
    <header className="aesir-header">
      <div className="aesir-header__inner">
        <button className="brand-button" onClick={() => navigate("top")} aria-label="Back to top">
          <img src={asset("assets/aesir/aesir-wordmark.webp")} alt="AESIR" />
        </button>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, id]) => (
            <button key={id} onClick={() => navigate(id)}>{label}</button>
          ))}
        </nav>

        <a className="header-contact" href={contactUrl} target="_blank" rel="noreferrer">
          Contact <ArrowUpRight size={16} aria-hidden="true" />
        </a>

        <button
          className="menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        {open && (
          <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
            {navItems.map(([label, id]) => (
              <button key={id} onClick={() => navigate(id)}>
                {label}<ArrowRight size={17} aria-hidden="true" />
              </button>
            ))}
            <a href={contactUrl} target="_blank" rel="noreferrer">
              Contact AESIR<ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="hero-section">
      <div className="hero-copy" data-enter>
        <h1>Evidence-based immersive intelligence for a more inclusive future.</h1>
        <p>
          AESIR bridges human neurodiversity and frontier technology, translating industrial-grade XR,
          AI, and HCI research into measurable public value across APAC and global smart cities.
        </p>
        <div className="hero-actions">
          <button className="primary-action" onClick={() => scrollToSection("research")}>
            Explore the research <ArrowDown size={18} aria-hidden="true" />
          </button>
          <a className="text-action" href={contactUrl} target="_blank" rel="noreferrer">
            Contact AESIR <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>

      <figure className="hero-image" data-enter>
        <img
          src={asset("assets/aesir/founder-panel.webp")}
          alt="Ernest HS CHAN speaking during an industry panel"
        />
        <figcaption>
          <span>Applied knowledge in public</span>
          <span>Research · Industry · Policy</span>
        </figcaption>
      </figure>

      <div className="proof-ribbon" aria-label="AESIR credentials">
        <span>Global award-winning social technology</span>
        <span>Top 500 global tech startup</span>
        <span>XR · AI · HCI · Public policy</span>
        <span>APAC field deployment</span>
      </div>
    </section>
  );
}

function Thesis() {
  return (
    <section className="thesis-section section-shell" data-enter>
      <div className="thesis-heading">
        <h2>Immersive Pragmatism</h2>
        <p>Research earns its value when it survives contact with the real world.</p>
      </div>
      <blockquote>
        We fuse pioneering, peer-reviewed scientific discovery with market-validated, high-impact
        societal deployment.
      </blockquote>
      <p className="thesis-body">
        Built by practical innovators behind a globally recognised social-technology startup, AESIR's
        footprint connects rigorous data science, human-computer interaction, public policy, and
        industrial execution. Our fellows do not merely theorise technology; they build, test, and
        translate it into inclusive digital infrastructure and measurable socioeconomic wellbeing.
      </p>
    </section>
  );
}

function ResearchAreas() {
  const [activeId, setActiveId] = useState(researchAreas[0].id);
  const activeArea = researchAreas.find((area) => area.id === activeId) ?? researchAreas[0];

  const onTabKeyDown = (event, index) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + researchAreas.length) % researchAreas.length;
    setActiveId(researchAreas[nextIndex].id);
    document.getElementById(`research-tab-${nextIndex}`)?.focus();
  };

  return (
    <section id="research" className="research-section section-shell">
      <div className="section-intro" data-enter>
        <h2>Three areas shaping human-centred technology.</h2>
        <p>
          Each area connects a structural challenge with a research agenda and a pathway to field deployment.
        </p>
      </div>

      <div className="research-tabs" role="tablist" aria-label="AESIR research areas" data-enter>
        {researchAreas.map((area, index) => {
          const selected = area.id === activeId;
          return (
            <button
              id={`research-tab-${index}`}
              key={area.id}
              role="tab"
              aria-selected={selected}
              aria-controls="research-panel"
              tabIndex={selected ? 0 : -1}
              className={selected ? "is-active" : ""}
              onClick={() => setActiveId(area.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              <strong>{area.title}</strong>
              <span>{area.subtitle}</span>
            </button>
          );
        })}
      </div>

      <article
        id="research-panel"
        role="tabpanel"
        aria-labelledby={`research-tab-${researchAreas.findIndex((area) => area.id === activeId)}`}
        className="research-panel"
        key={activeArea.id}
      >
        <div className="research-panel__lead">
          <h3>{activeArea.title}</h3>
          <p>{activeArea.summary}</p>
          <div className="research-tags">
            {activeArea.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
        <dl className="research-panel__detail">
          <div>
            <dt>Context</dt>
            <dd>{activeArea.context}</dd>
          </div>
          <div>
            <dt>Research focus</dt>
            <dd>{activeArea.focus}</dd>
          </div>
          <div>
            <dt>Applied direction</dt>
            <dd>{activeArea.application}</dd>
          </div>
        </dl>
      </article>
    </section>
  );
}

function Method() {
  return (
    <section id="method" className="method-section">
      <div className="section-shell" data-enter>
        <div className="method-heading">
          <h2>From evidence to public value.</h2>
          <p>
            AESIR treats research, engineering, validation, and adoption as one continuous practice.
          </p>
        </div>
        <ol className="method-flow">
          {methodSteps.map(([title, description], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Evidence() {
  return (
    <section id="evidence" className="evidence-section section-shell">
      <div className="section-intro" data-enter>
        <h2>Programs, networks, and applied outputs.</h2>
        <p>
          A growing body of participatory research, cross-sector collaboration, and deployment-led learning.
        </p>
      </div>

      <div className="output-list" data-enter>
        {outputs.map((output) => (
          <article key={output.title}>
            <h3>{output.title}</h3>
            <p>{output.description}</p>
          </article>
        ))}
      </div>

      <div className="evidence-statement" data-enter>
        <p>
          For partners seeking validated industrial execution, cross-sector governance experience,
          and real-world clinical empathy.
        </p>
        <a href={contactUrl} target="_blank" rel="noreferrer">
          Start a conversation <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

function ResearchFilm() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEnabled(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled || !videoRef.current) return undefined;
    const video = videoRef.current;
    let hls;
    let cancelled = false;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoStream;
    } else {
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled || !Hls.isSupported()) return;
        hls = new Hls({ enableWorker: true, startLevel: 1 });
        hls.loadSource(videoStream);
        hls.attachMedia(video);
      });
    }

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [enabled]);

  return (
    <figure ref={containerRef} className="research-film" data-enter>
      <video
        ref={videoRef}
        controls
        muted
        playsInline
        preload="none"
        poster={asset("assets/aesir/ernest-reading.webp")}
        aria-label="AESIR applied immersive intelligence film"
      />
      <figcaption>
        <strong>Applied work in motion</strong>
        <span>AESIR programs, public education, and immersive deployment.</span>
      </figcaption>
    </figure>
  );
}

function ProjectLibrary() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(aesirProjects.map((project) => project.category)))],
    [],
  );
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return aesirProjects.filter((project) => {
      const categoryMatches = category === "All" || project.category === category;
      const queryMatches = !normalizedQuery || `${project.title} ${project.category}`.toLowerCase().includes(normalizedQuery);
      return categoryMatches && queryMatches;
    });
  }, [category, query]);

  const visibleProjects = expanded ? filteredProjects : filteredProjects.slice(0, 12);

  useEffect(() => setExpanded(false), [category, query]);

  return (
    <section id="projects" className="projects-section section-shell">
      <div className="projects-heading" data-enter>
        <div>
          <h2>Field deployments.</h2>
          <p>
            The complete AESIR archive: 106 projects across immersive learning, simulation,
            digital health, motion technology, and public infrastructure.
          </p>
        </div>
        <div className="project-search">
          <Search size={18} aria-hidden="true" />
          <label className="sr-only" htmlFor="project-search">Search projects</label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the archive"
          />
        </div>
      </div>

      <div className="category-filter" aria-label="Filter projects by category" data-enter>
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "is-active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="project-count" aria-live="polite">
        Showing {visibleProjects.length} of {filteredProjects.length} projects
      </p>

      {visibleProjects.length > 0 ? (
        <div className="project-grid">
          {visibleProjects.map((project) => (
            <a
              key={`${project.number}-${project.title}-${project.media}`}
              className="project-card"
              href={projectViewer(project)}
              target="_blank"
              rel="noreferrer"
            >
              <div className="project-card__media">
                <img
                  src={asset(project.media)}
                  alt={`${project.title} project media`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="project-card__content">
                <span>{project.category}</span>
                <h3>{project.title}</h3>
                <div>View project <ArrowUpRight size={16} aria-hidden="true" /></div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="project-empty">No projects match this search. Try another title or category.</div>
      )}

      {filteredProjects.length > 12 && (
        <button className="archive-toggle" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "Show selected projects" : `Show all ${filteredProjects.length} projects`}
          <ChevronDown className={expanded ? "is-rotated" : ""} size={18} aria-hidden="true" />
        </button>
      )}
    </section>
  );
}

function Leadership() {
  return (
    <section id="leadership" className="leadership-section">
      <div className="section-shell">
        <div className="leadership-intro" data-enter>
          <div>
            <h2>Built by practitioners.</h2>
            <p>
              Ernest HS CHAN and Zero Yun Wa WONG are social entrepreneurs working across AI, AR,
              VR, gaming, inclusive education, public innovation, and human-centred technology.
            </p>
          </div>
          <div className="founder-names">
            <p><strong>Ernest HS CHAN</strong><span>Co-Founder</span></p>
            <p><strong>Zero Yun Wa WONG</strong><span>Co-Founder</span></p>
          </div>
        </div>

        <div className="leadership-feature" data-enter>
          <img
            src={asset("assets/aesir/ernest-reading.webp")}
            alt="AESIR Co-Founder Ernest HS CHAN reading an augmented-reality positive psychology playbook"
            loading="lazy"
          />
          <div>
            <h3>Clinical empathy, industrial execution.</h3>
            <p>
              AESIR's research practice grows from years of building with schools, NGOs, hospitals,
              businesses, and public institutions. That field experience turns inclusion from an
              abstract principle into a design and deployment requirement.
            </p>
          </div>
        </div>

        <div className="photo-grid" data-enter>
          {newPhotos.map((photo) => (
            <figure key={photo.src}>
              <img src={asset(photo.src)} alt={photo.alt} loading="lazy" decoding="async" />
              <figcaption>{photo.label}</figcaption>
            </figure>
          ))}
        </div>

        <div className="archive-heading" data-enter>
          <h3>AESIR field archive</h3>
          <p>A visual record of public education, business programs, training, and founder milestones.</p>
        </div>
        <div className="archive-strip" data-enter>
          {archivePhotos.map(([src, alt]) => (
            <img key={src} src={asset(src)} alt={alt} loading="lazy" decoding="async" />
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section">
      <div className="section-shell contact-layout" data-enter>
        <h2>Build the next evidence-led deployment with AESIR.</h2>
        <div>
          <p>
            Connect with AESIR about research collaboration, applied innovation, institutional
            programs, or technology deployment.
          </p>
          <a href={contactUrl} target="_blank" rel="noreferrer">
            Contact AESIR <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function AesirResearchSite() {
  useEntryMotion();

  useEffect(() => {
    window.history.scrollRestoration = "manual";

    const resolveLegacyHash = () => {
      if (window.location.hash.startsWith("#/founders")) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#leadership`);
        window.requestAnimationFrame(() => scrollToSection("leadership"));
      } else if (window.location.hash.startsWith("#/neuro")) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#top`);
        window.scrollTo({ top: 0 });
      }
    };

    resolveLegacyHash();
    if (!window.location.hash) window.scrollTo({ top: 0 });
    window.addEventListener("hashchange", resolveLegacyHash);

    return () => window.removeEventListener("hashchange", resolveLegacyHash);
  }, []);

  return (
    <div className="aesir-site">
      <Header />
      <main>
        <Hero />
        <Thesis />
        <ResearchAreas />
        <Method />
        <Evidence />
        <div className="film-shell section-shell"><ResearchFilm /></div>
        <ProjectLibrary />
        <Leadership />
        <Contact />
      </main>
      <footer className="aesir-footer">
        <img src={asset("assets/aesir/aesir-wordmark.webp")} alt="AESIR" />
        <p>Evidence-based immersive intelligence.</p>
        <p>© {new Date().getFullYear()} AESIR</p>
      </footer>
    </div>
  );
}
