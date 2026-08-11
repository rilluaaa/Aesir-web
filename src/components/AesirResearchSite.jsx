import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Search,
} from "lucide-react";
import {
  HERO_SOURCE_QUALITY,
  calculateHeroObjectPositionY,
  getHeroPlaybackState,
  isConstrainedNetwork,
  isHeroScrubCapable,
  mapPointerToGazeTime,
  selectHeroSourceQuality,
  selectHeroVideoSource,
  supportsHighResolutionDecoding,
} from "../heroVideo.js";
import {
  attachAndWarmHeroVideo,
  createHeroBootReadiness,
  createHeroVideoResourceLoader,
  decodeImageUrl,
  getHeroScrubDelay,
  getNextHeroScrubTime,
  getHeroBootRevealMode,
  isAbortError,
  prepareHeroCriticalAssets,
  resolveHeroDownloadSource,
  revealAesirApp,
  waitForStableLayout,
} from "../heroBoot.js";
import { installPredictiveMediaScheduler } from "../mediaScheduler.js";
import { aesirProjects } from "../projectPortfolio";
import "./AesirResearchSite.css";

const contactUrl = "https://aesir.hk/#contactus";
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
    stages: [
      {
        id: "description",
        label: "Description",
        title: "Technology organised around human wellbeing.",
        body: [
          "Society 5.0 describes a human-centred cyber-physical society in which data, intelligent systems, and the built environment work together to improve daily life. Rather than treating automation as the final goal, it asks whether technology expands participation, dignity, independence, and access to essential services.",
          "For AESIR, this is especially relevant to Asia's super-ageing population, unequal access to care, and the rising public cost of long-term elderly and disability support. The research connects smart-city strategy with the lived realities of older adults, neurodivergent communities, caregivers, and people who are often excluded by conventional digital infrastructure.",
        ],
      },
      {
        id: "focus",
        label: "Research Focus",
        title: "Moving smart cities beyond automated efficiency.",
        body: [
          "AESIR studies how cities can progress from Industry 4.0 efficiency towards public systems that are measurable, inclusive, and responsive to different human capabilities. The work examines how spatial computing can make services understandable in place, how edge computing can support timely interaction, and how decentralised data models can reduce dependence on a single point of control.",
          "The research also explores active-ageing frameworks, zero-barrier municipal environments, remote mental-wellness support, and public-learning systems that turn complex health or sustainability knowledge into practical action. The central question is not only whether a system works, but who can use it, what burden it removes, and how it contributes to long-term public value.",
        ],
      },
      {
        id: "application",
        label: "Applied Direction",
        title: "Turning civic frameworks into public experiences.",
        body: [
          "AESIR translates this agenda into programmes that can be tested with real communities and institutions. Smart Sports applies gerontechnology and movement-based interaction to preventive exercise for older adults, while mixed-reality AED and CPR training gives learners a safe, repeatable environment for practising emergency decisions before a real incident occurs.",
          "Interactive environmental learning projects extend the same principle into citizen science and public education. Together, these deployments create an applied foundation for evaluating participation, comprehension, accessibility, and adoption—evidence that can inform more inclusive healthcare, community services, and smart-city infrastructure.",
        ],
      },
    ],
    tags: ["Smart Cities", "Active Ageing", "Public Infrastructure"],
    cases: [
      {
        title: "Smart Sports for active ageing",
        description:
          "AESIR has applied gerontechnology and sports training to preventive exercise for older adults. The work turns movement into an approachable, repeatable experience designed around participation rather than clinical intimidation.",
      },
      {
        title: "Mixed-reality emergency training",
        description:
          "A HoloLens AED and CPR simulation created with VTC lets learners practise when and how to use an automated external defibrillator inside a safe, repeatable scenario before facing a real emergency.",
      },
      {
        title: "Public learning through place and data",
        description:
          "Tree Portal uses a citizen-science approach to make urban-tree knowledge accessible, while environmental web games translate university research on ocean protection, water filtration, and sustainability into public learning tools.",
      },
    ],
  },
  {
    id: "ax",
    title: "AX",
    subtitle: "AI Transformation",
    summary:
      "Redesigning institutions, workflows, and human performance for an era in which AI becomes foundational infrastructure.",
    stages: [
      {
        id: "description",
        label: "Description",
        title: "AI transformation is organisational, not merely digital.",
        body: [
          "AX marks the shift from digitising existing records and services to treating AI as a foundational layer of organisational and public infrastructure. It changes how decisions are prepared, how work is distributed, how knowledge moves through a team, and how autonomous systems coordinate with human judgement.",
          "This transition creates opportunities for faster analysis and more adaptive services, but it also changes attention, responsibility, and the experience of work. AESIR approaches AX as a human-systems challenge: transformation succeeds only when technical capability, governance, cognitive wellbeing, and operational behaviour are designed together.",
        ],
      },
      {
        id: "focus",
        label: "Research Focus",
        title: "Designing for the AI–human co-working era.",
        body: [
          "AESIR's research centres on cognitive ergonomics: how people understand, supervise, and sustain attention while working with intelligent systems. Neural-feedback concepts, micro-expression analytics, movement data, and behavioural signals can help reveal cognitive load, loss of focus, uncertainty, or emotional fatigue that conventional productivity measures fail to capture.",
          "The aim is to develop evidence-led models for feedback timing, task allocation, explainability, and human oversight. By connecting interaction data with organisational behaviour, the research asks how AI can support performance without creating hidden burnout, deskilling, or decision processes that people can no longer interpret or challenge.",
        ],
      },
      {
        id: "application",
        label: "Applied Direction",
        title: "Building practical test beds for responsible AX.",
        body: [
          "AESIR's portfolio provides real interfaces through which these questions can be tested. Camera-based sports and exercise systems use pose, hand, skeleton, and depth tracking to interpret movement without physical controllers, creating immediate examples of how AI feedback must remain accurate, legible, and motivating.",
          "Applied AI systems extend the research into recognition, communication, and automated response. These deployments support the development of scalable AX blueprints in which performance data, user experience, escalation rules, and meaningful human control are considered from the beginning.",
        ],
      },
    ],
    tags: ["Cognitive Ergonomics", "Human-AI Work", "Behavioural Analytics"],
    cases: [
      {
        title: "Camera-based movement intelligence",
        description:
          "Web-based sports and exercise prototypes use pose, skeleton, hand, and depth tracking to interpret movement without physical controllers. These systems explore how AI feedback can stay immediate, legible, and motivating.",
      },
      {
        title: "AI-assisted language learning",
        description:
          "VocabGO combines camera object recognition with AR labelling, while the archive also spans Cantonese speech training and language-learning assistants—an applied foundation for studying attention, feedback, and cognitive load.",
      },
      {
        title: "Conversational service interfaces",
        description:
          "AESIR has prototyped automated social-media conversations across common messaging channels, examining how organisations can respond faster while keeping tone, escalation, and human oversight visible.",
      },
    ],
  },
  {
    id: "neuro",
    title: "NEURO Business Futures",
    subtitle: "Immersive Neurodiversity & Inclusive Tech Markets",
    summary:
      "Developing scalable immersive systems for neurodivergent learning, assessment, wellbeing, and inclusive technology markets.",
    stages: [
      {
        id: "description",
        label: "Description",
        title: "Inclusive technology built around cognitive difference.",
        body: [
          "NEURO Business Futures investigates how immersive environments and generative AI can support neurodivergent learning, communication, assessment, and wellbeing. Multi-sensory VR can present information through space, movement, sound, and guided interaction, creating non-pharmacological pathways that adapt to different ways of processing the world.",
          "The programme considers Autism, Dyslexia, Dementia, ADHD, and related cognitive conditions without reducing people to a diagnosis. Its purpose is to connect clinical empathy with technology design, then examine how assistive systems can move from isolated prototypes into trustworthy services, sustainable markets, and accessible learning or care environments.",
        ],
      },
      {
        id: "focus",
        label: "Research Focus",
        title: "Turning interaction patterns into personalised support.",
        body: [
          "AESIR studies cognitive spatial data, kinetic movement, eye-gaze variation, attention patterns, and responses to multi-sensory feedback. These signals can help researchers and practitioners understand how an individual navigates a task, where cognitive friction appears, and which form of guidance supports participation without adding unnecessary pressure.",
          "The research combines these observations with personalised gamified protocols, practitioner review, and the design of repeatable clinical-learning environments. It also examines the economics and delivery systems behind assistive technology, because an intervention has limited public value if it cannot be maintained, adopted by practitioners, or scaled across schools, NGOs, clinics, and families.",
        ],
      },
      {
        id: "application",
        label: "Applied Direction",
        title: "Extending a validated base of immersive inclusion.",
        body: [
          "Happy Kingdom, Hong Kong's AR positive-psychology playbook, supports children's emotional literacy through stories, play, and guided practice. My Living Diary was co-designed with an autism counsellor, speech therapist, and occupational therapist to help children rehearse everyday vocabulary, communication, and independent-living situations.",
          "AESIR's VR speech centre adds repeatable public-speaking and social-interaction rehearsal with audio review for practitioners. Together with established NGO, education, and care networks, these projects form a practical testing base for more personalised immersive protocols and for studying how inclusive technology can achieve clinical relevance, user trust, and sustainable deployment.",
        ],
      },
    ],
    tags: ["Neurodiversity", "Clinical Learning", "Assistive Technology"],
    cases: [
      {
        title: "Happy Kingdom AR Playbook",
        description:
          "Hong Kong's AR positive-psychology playbook was developed to support children's emotional literacy through guided stories, play, and at-home practice. The programme was recognised as a funded social-innovation venture.",
      },
      {
        title: "My Living Diary",
        description:
          "Co-designed with an autism counsellor, speech therapist, and occupational therapist, this AR life-education package helps children practise everyday vocabulary, communication, and independent-living situations.",
      },
      {
        title: "VR speech and social rehearsal",
        description:
          "A Unity-based VR speech centre simulates public-speaking and social-interaction situations for children with autism, with audio recording that gives practitioners a repeatable way to review participation and progress.",
      },
    ],
  },
];

const outputs = [
  {
    title: "Social innovation ventures",
    description: "Happy Kingdom and Smart Sports moved inclusive learning and active-ageing concepts into funded, public-facing programmes rather than stopping at presentation-stage prototypes.",
  },
  {
    title: "Health and rehabilitation",
    description: "Work ranges from mixed-reality AED rehearsal and asthma-care support to elderly fall-prevention games, VR mental-wellness programmes, and assistive learning tools.",
  },
  {
    title: "Education and public knowledge",
    description: "Projects with universities and education partners translate research into AR comics, sustainability games, language resources, heritage experiences, and interactive classroom platforms.",
  },
  {
    title: "Cross-sector deployment",
    description: "AESIR has built experiences for NGOs, schools, universities, public bodies, healthcare teams, and commercial partners—testing the same technology under very different user and governance conditions.",
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
    width: 1600,
    height: 1200,
  },
  {
    src: "assets/aesir/ai-for-all.webp",
    alt: "AESIR and programme partners at the AI for All Inclusive Programme",
    label: '"AI for All" Inclusive Programme',
    width: 1600,
    height: 1200,
  },
  {
    src: "assets/aesir/hkict-2021.webp",
    alt: "Ernest HS CHAN and participants at the 2021 Hong Kong ICT Awards ceremony",
    label: "Hong Kong ICT Awards",
    width: 800,
    height: 600,
  },
  {
    src: "assets/aesir/business-practicum.webp",
    alt: "Business practicum participants and cross-sector partners",
    label: "Cross-sector practice",
    width: 800,
    height: 600,
  },
];

const archivePhotos = [
  ["assets/founders/ernest-elon-musk-hong-kong.jpeg", "Ernest HS CHAN with Elon Musk between the China and Hong Kong flags", 960, 697],
  ["assets/founders/community-program.jpg", "Community counselling and virtual reality programme partners", 640, 398],
  ["assets/founders/aesir-presentation.jpeg", "AESIR presentation moment", 596, 335],
  ["assets/founders/founder-speaking.jpeg", "Founder speaking at an applied training session", 617, 324],
  ["assets/founders/founders-crates-photo.jpeg", "AESIR founders presenting a Happy Kingdom book at a social innovation space", 1066, 1600],
  ["assets/founders/founders-interview.jpg", "AESIR founders interview portrait", 800, 535],
  ["assets/founders/dbs-nus-awards-2016.jpeg", "AESIR at the DBS-NUS Social Venture Challenge Asia Awards Ceremony 2016", 960, 587],
  ["assets/founders/happy-kingdom-with-guest.jpeg", "Ernest presenting the Happy Kingdom book with a guest", 960, 720],
  ["assets/founders/lion-rock-daily-coverage.jpeg", "Lion Rock Daily coverage of youth employment research", 1149, 1062],
  ["assets/founders/founders-staircase-photo.jpeg", "AESIR founders with the Happy Kingdom book on a staircase", 1600, 1055],
];

const navItems = [
  ["Research", "research"],
  ["Method", "method"],
  ["Deployment", "evidence"],
  ["Projects", "projects"],
  ["Leadership", "leadership"],
];

const projectViewer = (project) => {
  const params = new URLSearchParams({
    title: project.title,
    category: project.category,
    description: project.description,
    media: asset(project.media),
  });

  if (project.link) params.set("link", project.link);

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

const getConnection = () => navigator.connection
  || navigator.mozConnection
  || navigator.webkitConnection;

let highResolutionDecodingPromise;
const getHighResolutionDecodingSupport = () => {
  if (!highResolutionDecodingPromise) {
    highResolutionDecodingPromise = supportsHighResolutionDecoding(navigator.mediaCapabilities);
  }
  return highResolutionDecodingPromise;
};

const getInitialHeroMode = () => {
  if (typeof window === "undefined") {
    return {
      scrubCapable: false,
      reducedMotion: true,
      videoSource: null,
    };
  }

  const scrubCapable = isHeroScrubCapable({
    viewportWidth: window.innerWidth,
    anyHover: window.matchMedia("(any-hover: hover)").matches,
    anyFinePointer: window.matchMedia("(any-pointer: fine)").matches,
  });

  const connection = getConnection();
  const sourceEnvironment = {
    scrubCapable,
    constrainedNetwork: isConstrainedNetwork({
      saveData: connection?.saveData,
      effectiveType: connection?.effectiveType,
    }),
    renderedWidth: window.innerWidth,
    renderedHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory,
  };
  const initialQuality = selectHeroSourceQuality({
    ...sourceEnvironment,
    supports1440p: null,
  });

  return {
    scrubCapable,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    videoSource: initialQuality === HERO_SOURCE_QUALITY.standard
      ? selectHeroVideoSource({ quality: initialQuality, scrubCapable })
      : null,
  };
};

function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplayed(text);
      setDone(true);
      return undefined;
    }

    setDisplayed("");
    setDone(false);
    let intervalId;
    const timeoutId = window.setTimeout(() => {
      let index = 0;
      intervalId = window.setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          window.clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [speed, startDelay, text]);

  return { displayed, done };
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => (
    typeof window !== "undefined" && window.matchMedia(query).matches
  ));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatch = () => setMatches(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, [query]);

  return matches;
}

function BackgroundVideo() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const resourceLoaderRef = useRef(null);
  const activeResourceRef = useRef(null);
  const criticalAssetsPromiseRef = useRef(null);
  const heroWarmupRef = useRef(null);
  const bootRevealStartedRef = useRef(false);
  const latestPointerProgressRef = useRef(0.5);
  const syncScrubTargetRef = useRef(null);
  const revealBootRef = useRef(null);
  const [heroMode, setHeroMode] = useState(getInitialHeroMode);
  const [focalPositionY, setFocalPositionY] = useState(50);
  const [readySource, setReadySource] = useState(null);
  const [scrubReadySource, setScrubReadySource] = useState(null);
  const [heroInRange, setHeroInRange] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(() => (
    typeof document === "undefined" || document.visibilityState !== "hidden"
  ));
  const [appReady, setAppReady] = useState(() => (
    typeof document !== "undefined"
    && document.documentElement.classList.contains("aesir-app-ready")
  ));
  const { scrubCapable, reducedMotion, videoSource } = heroMode;
  const posterUrl = asset(scrubCapable
    ? "assets/aesir/cognitive-hero-poster.webp"
    : "assets/aesir/cognitive-hero-mobile-poster.webp");
  const wordmarkUrl = asset("assets/aesir/aesir-wordmark.webp");

  revealBootRef.current = async ({ fallback = false, layoutStable = false, mode = "poster" } = {}) => {
    if (bootRevealStartedRef.current) return;
    bootRevealStartedRef.current = true;
    setAppReady(true);

    if (!layoutStable) {
      await waitForStableLayout().catch(() => undefined);
    }

    if (fallback) document.documentElement.classList.add("aesir-app-fallback");
    revealAesirApp({ mode });
    window.clearTimeout(window.__AESIR_BOOT_WATCHDOG__);
    window.clearTimeout(window.__AESIR_BOOT_HARD_FALLBACK__);
  };

  useEffect(() => {
    const loader = createHeroVideoResourceLoader();
    resourceLoaderRef.current = loader;

    return () => {
      loader.dispose();
      if (resourceLoaderRef.current === loader) resourceLoaderRef.current = null;
      activeResourceRef.current = null;
      heroWarmupRef.current = null;
    };
  }, []);

  useEffect(() => {
    const criticalController = new AbortController();
    const fontReady = document.fonts?.load
      ? Promise.all([
        document.fonts.load('400 1em "Inter"'),
        document.fonts.load('500 1em "Inter"'),
      ])
      : Promise.resolve();
    const criticalAssetsPromise = prepareHeroCriticalAssets({
      fontReady,
      posterUrl,
      criticalImageUrls: [wordmarkUrl],
      signal: criticalController.signal,
    }).catch((error) => ({ error }));
    criticalAssetsPromiseRef.current = criticalAssetsPromise;

    const revealCriticalPoster = async () => {
      const criticalAssets = await criticalAssetsPromise;
      if (criticalController.signal.aborted || criticalAssets?.error) return;
      if (scrubCapable && !reducedMotion) return;

      setAppReady(true);
      await waitForStableLayout({ signal: criticalController.signal });
      const readiness = createHeroBootReadiness({
        mounted: true,
        fontsReady: criticalAssets.fontsReady,
        criticalImagesReady: criticalAssets.criticalImagesReady,
        posterReady: criticalAssets.posterReady,
        layoutStable: true,
      });
      const revealMode = getHeroBootRevealMode({
        readiness,
        timedOut: false,
        posterReady: criticalAssets.posterReady,
      });
      if (revealMode === "poster") {
        await revealBootRef.current?.({ layoutStable: true, mode: revealMode });
      }
    };

    const revealPosterFallback = async () => {
      let posterReady = false;
      try {
        await decodeImageUrl({ url: posterUrl });
        posterReady = true;
      } catch {
        // The hard fallback in index.html still prevents a permanent white page.
      }
      const revealMode = getHeroBootRevealMode({
        readiness: createHeroBootReadiness(),
        timedOut: true,
        posterReady,
      });
      if (revealMode === "poster") {
        await revealBootRef.current?.({ fallback: true, mode: revealMode });
      }
    };
    const onBootTimeout = () => {
      if (scrubCapable && !reducedMotion) {
        window.setTimeout(() => {
          if (!bootRevealStartedRef.current) {
            window.clearTimeout(window.__AESIR_BOOT_HARD_FALLBACK__);
          }
        }, 0);
        return;
      }
      void revealPosterFallback();
    };

    window.addEventListener("aesir:boot-timeout", onBootTimeout);
    if (window.__AESIR_BOOT_TIMED_OUT__) onBootTimeout();
    void revealCriticalPoster();

    return () => {
      window.removeEventListener("aesir:boot-timeout", onBootTimeout);
      criticalController.abort();
      if (criticalAssetsPromiseRef.current === criticalAssetsPromise) {
        criticalAssetsPromiseRef.current = null;
      }
    };
  }, [posterUrl, reducedMotion, scrubCapable, wordmarkUrl]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver !== "function") return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setHeroInRange(entry.isIntersecting);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", updateVisibility);
    updateVisibility();
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const hoverQuery = window.matchMedia("(any-hover: hover)");
    const pointerQuery = window.matchMedia("(any-pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = getConnection();
    let updateTimer = 0;
    let updateSequence = 0;
    let disposed = false;

    const addMediaListener = (query, listener) => {
      if (typeof query.addEventListener === "function") query.addEventListener("change", listener);
      else query.addListener(listener);
    };

    const removeMediaListener = (query, listener) => {
      if (typeof query.removeEventListener === "function") query.removeEventListener("change", listener);
      else query.removeListener(listener);
    };

    const updateMode = async () => {
      const sequence = ++updateSequence;
      const videoRect = containerRef.current?.getBoundingClientRect();
      const nextScrubCapable = isHeroScrubCapable({
        viewportWidth: window.innerWidth,
        anyHover: hoverQuery.matches,
        anyFinePointer: pointerQuery.matches,
      });
      const sourceEnvironment = {
        scrubCapable: nextScrubCapable,
        constrainedNetwork: isConstrainedNetwork({
          saveData: connection?.saveData,
          effectiveType: connection?.effectiveType,
        }),
        renderedWidth: videoRect?.width || window.innerWidth,
        renderedHeight: videoRect?.height || window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
      };
      const highResolutionCandidate = selectHeroSourceQuality({
        ...sourceEnvironment,
        supports1440p: null,
      });
      const supports1440p = highResolutionCandidate === HERO_SOURCE_QUALITY.high
        ? await getHighResolutionDecodingSupport()
        : null;

      if (disposed || sequence !== updateSequence) return;

      const sourceQuality = selectHeroSourceQuality({
        ...sourceEnvironment,
        supports1440p,
      });
      const nextMode = {
        scrubCapable: nextScrubCapable,
        reducedMotion: reducedMotionQuery.matches,
        videoSource: selectHeroVideoSource({
          quality: sourceQuality,
          scrubCapable: nextScrubCapable,
        }),
      };

      setHeroMode((currentMode) => (
        currentMode.scrubCapable === nextMode.scrubCapable
        && currentMode.reducedMotion === nextMode.reducedMotion
        && currentMode.videoSource === nextMode.videoSource
          ? currentMode
          : nextMode
      ));
    };

    const scheduleUpdate = () => {
      window.clearTimeout(updateTimer);
      updateTimer = window.setTimeout(() => {
        void updateMode();
      }, 120);
    };

    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("orientationchange", scheduleUpdate, { passive: true });
    addMediaListener(hoverQuery, scheduleUpdate);
    addMediaListener(pointerQuery, scheduleUpdate);
    addMediaListener(reducedMotionQuery, scheduleUpdate);
    connection?.addEventListener?.("change", scheduleUpdate);
    void updateMode();

    return () => {
      disposed = true;
      updateSequence += 1;
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
      removeMediaListener(hoverQuery, scheduleUpdate);
      removeMediaListener(pointerQuery, scheduleUpdate);
      removeMediaListener(reducedMotionQuery, scheduleUpdate);
      connection?.removeEventListener?.("change", scheduleUpdate);
      window.clearTimeout(updateTimer);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const loader = resourceLoaderRef.current;
    const finalVideoSource = resolveHeroDownloadSource({
      sourceResolved: Boolean(videoSource),
      videoSource,
    });
    if (!video || !loader || !finalVideoSource) return undefined;
    if (
      activeResourceRef.current?.source === finalVideoSource
      && readySource === finalVideoSource
      && video.src
    ) return undefined;

    const preparationController = new AbortController();
    let resource = null;

    const prepareSelectedSource = async () => {
      try {
        resource = await loader.load(asset(finalVideoSource));
        if (preparationController.signal.aborted) throw new DOMException("Cancelled", "AbortError");

        setReadySource(null);
        setScrubReadySource(null);
        const warmup = await attachAndWarmHeroVideo({
          video,
          sourceUrl: resource.mediaUrl,
          scrubCapable,
          reducedMotion,
          signal: preparationController.signal,
        });
        resource.activate();
        activeResourceRef.current = {
          source: finalVideoSource,
          mediaUrl: resource.mediaUrl,
          resource,
        };
        heroWarmupRef.current = { source: finalVideoSource, warmup };
        video.dataset.warmupCompleteAt = performance.now().toFixed(1);
        setReadySource(finalVideoSource);
        window.dispatchEvent(new CustomEvent("aesir:hero-ready", {
          detail: { source: finalVideoSource, warmup },
        }));
      } catch (error) {
        if (activeResourceRef.current?.resource !== resource) resource?.release();
        if (!isAbortError(error)) {
          const criticalAssets = await criticalAssetsPromiseRef.current;
          if (criticalAssets && !bootRevealStartedRef.current && !criticalAssets.error) {
            await revealBootRef.current?.({ fallback: true, mode: "poster" });
          }
        }
      }
    };

    void prepareSelectedSource();

    return () => {
      preparationController.abort();
      loader.cancelPending();
      if (activeResourceRef.current?.resource !== resource) resource?.release();
    };
  }, [reducedMotion, scrubCapable, videoSource]);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return undefined;

    const updateFocalPosition = () => {
      const rect = container.getBoundingClientRect();
      const nextPosition = calculateHeroObjectPositionY({
        containerWidth: rect.width,
        containerHeight: rect.height,
        videoWidth: video.videoWidth || 16,
        videoHeight: video.videoHeight || 9,
      }) * 100;
      setFocalPositionY((currentPosition) => (
        Math.abs(currentPosition - nextPosition) < 0.01 ? currentPosition : nextPosition
      ));
    };

    const resizeObserver = typeof ResizeObserver === "function"
      ? new ResizeObserver(updateFocalPosition)
      : null;
    resizeObserver?.observe(container);
    if (!resizeObserver) window.addEventListener("resize", updateFocalPosition, { passive: true });
    video.addEventListener("loadedmetadata", updateFocalPosition);
    updateFocalPosition();

    return () => {
      resizeObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener("resize", updateFocalPosition);
      video.removeEventListener("loadedmetadata", updateFocalPosition);
    };
  }, [videoSource]);

  useEffect(() => {
    if (!scrubCapable || reducedMotion) return undefined;

    const onMouseMove = (event) => {
      latestPointerProgressRef.current = Math.min(
        1,
        Math.max(0, event.clientX / window.innerWidth),
      );
      if (heroInRange && documentVisible) syncScrubTargetRef.current?.();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    if (heroInRange && documentVisible) syncScrubTargetRef.current?.();

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [documentVisible, heroInRange, reducedMotion, scrubCapable]);

  useEffect(() => {
    const video = videoRef.current;
    if (
      !video
      || !scrubCapable
      || reducedMotion
      || !heroInRange
      || !documentVisible
      || readySource !== videoSource
    ) return undefined;

    let presentedTime = video.currentTime;
    let lastPresentedAt = 0;
    let seekActive = false;
    let presentedFrame = null;
    let frameCallbackId = null;
    let presentationFallbackTimer = 0;
    let seekWatchdogTimer = 0;
    let scrubPumpTimer = 0;
    let fallbackFrame = 0;
    let fallbackSecondFrame = 0;
    let scrubReadyAnnounced = false;
    const frameRate = 60;
    const frameDuration = 1 / frameRate;
    const frameInterval = 1000 / frameRate;
    const scrubInterval = 1000 / 45;
    const settleThreshold = frameDuration / 2;
    let lastSeekStartedAt = 0;
    let disposed = false;

    const announceScrubReady = () => {
      if (scrubReadyAnnounced || disposed) return;
      scrubReadyAnnounced = true;
      setScrubReadySource(videoSource);
    };

    const cancelActivePresentationWait = () => {
      if (frameCallbackId !== null && typeof video.cancelVideoFrameCallback === "function") {
        video.cancelVideoFrameCallback(frameCallbackId);
      }
      frameCallbackId = null;
      window.clearTimeout(presentationFallbackTimer);
      window.clearTimeout(seekWatchdogTimer);
      window.cancelAnimationFrame(fallbackFrame);
      window.cancelAnimationFrame(fallbackSecondFrame);
      presentationFallbackTimer = 0;
      seekWatchdogTimer = 0;
      fallbackFrame = 0;
      fallbackSecondFrame = 0;
    };

    const getDesiredTime = () => mapPointerToGazeTime(
      latestPointerProgressRef.current,
      video.duration,
    );

    let pumpScrub;
    let scheduleScrubPump;

    const finishPresentedFrame = (timestamp, mediaTime = video.currentTime) => {
      if (!seekActive || disposed) return;
      cancelActivePresentationWait();

      const presentedAt = Number.isFinite(timestamp) ? timestamp : performance.now();
      const elapsed = lastPresentedAt
        ? Math.max(frameInterval, presentedAt - lastPresentedAt)
        : frameInterval;
      lastPresentedAt = presentedAt;
      presentedTime = Number.isFinite(mediaTime) ? mediaTime : video.currentTime;
      seekActive = false;
      presentedFrame = null;
      announceScrubReady();
      scheduleScrubPump(elapsed);
    };

    const finishAfterPaint = () => {
      if (!seekActive || disposed) return;
      fallbackFrame = window.requestAnimationFrame(() => {
        fallbackFrame = 0;
        fallbackSecondFrame = window.requestAnimationFrame(() => {
          fallbackSecondFrame = 0;
          finishPresentedFrame(performance.now(), video.currentTime);
        });
      });
    };

    const onSeeked = () => {
      if (!seekActive || disposed) return;
      window.clearTimeout(seekWatchdogTimer);
      seekWatchdogTimer = 0;

      if (presentedFrame) {
        finishPresentedFrame(presentedFrame.timestamp, presentedFrame.mediaTime);
        return;
      }

      if (typeof video.requestVideoFrameCallback === "function") {
        presentationFallbackTimer = window.setTimeout(finishAfterPaint, 24);
      } else {
        finishAfterPaint();
      }
    };

    const recoverMissingSeekEvent = () => {
      if (!seekActive || disposed) return;
      if (video.seeking || video.readyState < 2) {
        seekWatchdogTimer = window.setTimeout(recoverMissingSeekEvent, 48);
        return;
      }
      finishAfterPaint();
    };

    const beginSeek = (nextTime) => {
      if (seekActive || disposed) return;
      seekActive = true;
      presentedFrame = null;

      if (typeof video.requestVideoFrameCallback === "function") {
        frameCallbackId = video.requestVideoFrameCallback((timestamp, metadata) => {
          frameCallbackId = null;
          if (!seekActive || disposed) return;
          presentedFrame = {
            timestamp,
            mediaTime: metadata?.mediaTime ?? video.currentTime,
          };
          if (!video.seeking) {
            finishPresentedFrame(presentedFrame.timestamp, presentedFrame.mediaTime);
          }
        });
      }

      try {
        lastSeekStartedAt = performance.now();
        video.currentTime = nextTime;
        seekWatchdogTimer = window.setTimeout(recoverMissingSeekEvent, 80);
      } catch {
        cancelActivePresentationWait();
        seekActive = false;
      }
    };

    pumpScrub = (elapsed = frameInterval) => {
      if (seekActive || disposed || !Number.isFinite(video.duration)) return;
      const desiredTime = getDesiredTime();
      if (Math.abs(desiredTime - presentedTime) <= settleThreshold) {
        presentedTime = desiredTime;
        lastPresentedAt = 0;
        announceScrubReady();
        return;
      }

      const nextTime = getNextHeroScrubTime({
        presentedTime,
        desiredTime,
        elapsedMs: elapsed,
        duration: video.duration,
        minimumStep: frameDuration,
        snapThreshold: settleThreshold,
      });
      beginSeek(nextTime);
    };

    scheduleScrubPump = (minimumElapsed = frameInterval) => {
      if (seekActive || disposed || scrubPumpTimer) return;
      const now = performance.now();
      const delay = getHeroScrubDelay({
        now,
        lastSeekStartedAt,
        intervalMs: scrubInterval,
      });
      if (delay <= 1) {
        const elapsed = lastPresentedAt
          ? Math.max(minimumElapsed, now - lastPresentedAt)
          : minimumElapsed;
        pumpScrub(elapsed);
        return;
      }

      scrubPumpTimer = window.setTimeout(() => {
        scrubPumpTimer = 0;
        const pumpAt = performance.now();
        const elapsed = lastPresentedAt
          ? Math.max(minimumElapsed, pumpAt - lastPresentedAt)
          : minimumElapsed;
        pumpScrub(elapsed);
      }, delay);
    };

    const onLoadedMetadata = () => {
      presentedTime = video.currentTime;
      lastPresentedAt = 0;
      scheduleScrubPump(frameInterval);
    };

    const syncTargetFromPointer = () => scheduleScrubPump(frameInterval);

    syncScrubTargetRef.current = syncTargetFromPointer;
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("seeked", onSeeked);
    if (video.readyState >= 1) onLoadedMetadata();

    return () => {
      disposed = true;
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("seeked", onSeeked);
      if (syncScrubTargetRef.current === syncTargetFromPointer) {
        syncScrubTargetRef.current = null;
      }
      cancelActivePresentationWait();
      window.clearTimeout(scrubPumpTimer);
      scrubPumpTimer = 0;
      seekActive = false;
    };
  }, [documentVisible, heroInRange, readySource, reducedMotion, scrubCapable, videoSource]);

  useEffect(() => {
    if (
      !scrubCapable
      || reducedMotion
      || readySource !== videoSource
      || scrubReadySource !== videoSource
      || bootRevealStartedRef.current
    ) return undefined;

    const revealController = new AbortController();

    const revealInteractiveHero = async () => {
      const criticalAssets = await criticalAssetsPromiseRef.current;
      const warmupRecord = heroWarmupRef.current;
      if (
        revealController.signal.aborted
        || criticalAssets?.error
        || warmupRecord?.source !== videoSource
      ) return;

      await waitForStableLayout({ signal: revealController.signal });
      const readiness = createHeroBootReadiness({
        mounted: true,
        sourceResolved: true,
        sourceAttached: true,
        metadataReady: warmupRecord.warmup.metadataReady,
        framesWarmed: warmupRecord.warmup.framesWarmed,
        neutralReady: warmupRecord.warmup.neutralReady,
        fontsReady: criticalAssets?.fontsReady,
        criticalImagesReady: criticalAssets?.criticalImagesReady,
        posterReady: criticalAssets?.posterReady,
        layoutStable: true,
      });

      if (getHeroBootRevealMode({
        readiness,
        timedOut: false,
        posterReady: criticalAssets?.posterReady,
      }) === "video") {
        await revealBootRef.current?.({ layoutStable: true, mode: "video" });
      }
    };

    void revealInteractiveHero().catch((error) => {
      if (!isAbortError(error)) {
        // A genuine preparation failure remains covered until the poster fallback path runs.
      }
    });
    return () => revealController.abort();
  }, [readySource, reducedMotion, scrubCapable, scrubReadySource, videoSource]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !appReady || readySource !== videoSource) return undefined;
    if (!heroInRange || !documentVisible) {
      video.pause();
      return undefined;
    }
    const playbackState = getHeroPlaybackState({ scrubCapable, reducedMotion });

    video.autoplay = playbackState.autoplay;
    video.loop = playbackState.loop;
    if (playbackState.autoplay) {
      video.play().catch(() => undefined);
      return undefined;
    }

    video.pause();
    return undefined;
  }, [appReady, documentVisible, heroInRange, readySource, reducedMotion, scrubCapable, videoSource]);

  return (
    <div
      className="hero-video"
      aria-hidden="true"
      ref={containerRef}
      style={{
        "--hero-focal-y": `${focalPositionY.toFixed(3)}%`,
        "--hero-poster": `url("${posterUrl}")`,
      }}
    >
      <video
        ref={videoRef}
        className={appReady && readySource === videoSource ? "is-ready" : ""}
        data-source={videoSource || undefined}
        muted
        playsInline
        preload="auto"
        poster={posterUrl}
      />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("has-open-menu", open);
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("has-open-menu");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const navigate = (id) => {
    scrollToSection(id);
    setOpen(false);
  };

  return (
    <header className={`aesir-header${open ? " is-menu-open" : ""}`}>
      <div className="aesir-header__inner">
        <button className="brand-button" onClick={() => navigate("top")} aria-label="Back to top">
          <img
            src={asset("assets/aesir/aesir-wordmark.webp")}
            alt="AESIR"
            width="1342"
            height="314"
            fetchPriority="high"
            decoding="async"
          />
        </button>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, id]) => (
            <button key={id} onClick={() => navigate(id)}>{label}</button>
          ))}
        </nav>

        <a className="header-contact" href={contactUrl} target="_blank" rel="noreferrer">
          Contact
        </a>

        <button
          className="menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`mobile-nav-overlay${open ? " is-open" : ""}`} aria-hidden={!open}>
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
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { displayed, done } = useTypewriter("Evidence for an\ninclusive future.");

  return (
    <section id="top" className="hero-section">
      <BackgroundVideo />

      <div className="hero-content">
        <div className="hero-copy">
          <div className="hero-reveal">
            <h1>
              {displayed}
              {!done && <span className="typewriter-cursor" aria-hidden="true" />}
            </h1>
          </div>

          <p className="hero-reveal hero-reveal--delayed">
            AESIR bridges human neurodiversity and frontier technology, translating industrial-grade
            AR, VR, AI, and public-policy research into measurable public value.
          </p>

        </div>
      </div>
    </section>
  );
}

function HeroEvidence() {
  return (
    <section className="hero-evidence section-shell" aria-label="AESIR in public dialogue">
      <figure>
        <img
          data-src={asset("assets/aesir/founder-panel.webp")}
          alt="Ernest HS CHAN speaking during an industry panel"
          width="1600"
          height="1200"
          loading="lazy"
          decoding="async"
          data-predictive-media
        />
        <figcaption aria-label="AESIR credentials">
          <span>Global social technology</span>
          <span>AR · VR · AI · Public policy</span>
          <span>APAC field deployment</span>
        </figcaption>
      </figure>
    </section>
  );
}

function Thesis() {
  return (
    <section className="thesis-section section-shell" data-enter>
      <div className="thesis-heading">
        <h2>Immersive pragmatism in practice.</h2>
        <p>Research earns its value when it survives contact with the real world.</p>
      </div>
      <div className="thesis-statement">
        <blockquote>
          Scientific discovery, proven through deployment.
        </blockquote>
        <p className="thesis-body">
          Built by practical innovators behind a globally recognised social-technology startup, AESIR's
          footprint connects rigorous data science, human-computer interaction, public policy, and
          industrial execution. Our fellows do not merely theorise technology; they build, test, and
          translate it into inclusive digital infrastructure and measurable socioeconomic wellbeing.
        </p>
      </div>
    </section>
  );
}

function ResearchAreas() {
  const [activeId, setActiveId] = useState(researchAreas[0].id);
  const [stageIndex, setStageIndex] = useState(0);
  const activeArea = researchAreas.find((area) => area.id === activeId) ?? researchAreas[0];
  const activeStage = activeArea.stages[stageIndex] ?? activeArea.stages[0];
  const finalStageIndex = activeArea.stages.length - 1;

  const selectArea = (id) => {
    setActiveId(id);
    setStageIndex(0);
  };

  const onStageKeyDown = (event, index) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + activeArea.stages.length) % activeArea.stages.length;
    setStageIndex(nextIndex);
    document.getElementById(`research-stage-tab-${activeArea.id}-${activeArea.stages[nextIndex].id}`)?.focus();
  };

  const onTabKeyDown = (event, index) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + researchAreas.length) % researchAreas.length;
    selectArea(researchAreas[nextIndex].id);
    document.getElementById(`research-tab-${nextIndex}`)?.focus();
  };

  return (
    <section id="research" className="research-section section-shell">
      <div className="section-intro" data-enter>
        <h2>Three research areas shaping human-centred technology.</h2>
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
              onClick={() => selectArea(area.id)}
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
        className={`research-panel research-panel--${activeArea.id}`}
        key={activeArea.id}
      >
        <div className="research-panel__lead">
          <h3>{activeArea.title}</h3>
          <p>{activeArea.summary}</p>
          <div className="research-tags">
            {activeArea.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
        <div className="research-journey">
          <div className="research-journey__steps" role="tablist" aria-label={`${activeArea.title} research sections`}>
            {activeArea.stages.map((stage, index) => (
              <button
                id={`research-stage-tab-${activeArea.id}-${stage.id}`}
                key={stage.id}
                type="button"
                role="tab"
                aria-selected={stageIndex === index}
                aria-controls="research-stage-panel"
                tabIndex={stageIndex === index ? 0 : -1}
                className={stageIndex === index ? "is-active" : ""}
                onClick={() => setStageIndex(index)}
                onKeyDown={(event) => onStageKeyDown(event, index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {stage.label}
              </button>
            ))}
          </div>

          <section
            id="research-stage-panel"
            role="tabpanel"
            aria-labelledby={`research-stage-tab-${activeArea.id}-${activeStage.id}`}
            className="research-journey__content"
            key={`${activeArea.id}-${activeStage.id}`}
          >
            <div className="research-journey__meta">
              <span>{activeStage.label}</span>
              <span>{String(stageIndex + 1).padStart(2, "0")} / {String(activeArea.stages.length).padStart(2, "0")}</span>
            </div>
            <h4>{activeStage.title}</h4>
            <div className="research-journey__body">
              {activeStage.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="research-journey__controls" aria-label="Research section navigation">
              <button
                type="button"
                disabled={stageIndex === 0}
                onClick={() => setStageIndex((index) => Math.max(0, index - 1))}
              >
                <ArrowLeft size={17} aria-hidden="true" />
                Previous
              </button>
              <button
                type="button"
                disabled={stageIndex === finalStageIndex}
                onClick={() => setStageIndex((index) => Math.min(finalStageIndex, index + 1))}
              >
                {stageIndex === finalStageIndex ? "Complete" : activeArea.stages[stageIndex + 1].label}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>
        <div id={`research-cases-${activeArea.id}`} className="research-cases">
          <div className="research-cases__heading">
            <h4>What AESIR has already built</h4>
          </div>
          <div className="research-cases__grid">
            {activeArea.cases.map((item) => (
              <article key={item.title}>
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}

function Method() {
  return (
    <section id="method" className="method-section">
      <div className="section-shell" data-enter>
        <div className="method-heading">
          <h2>From evidence to measurable public value.</h2>
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
        <h2>Applied programmes, partnerships, and public outcomes.</h2>
        <p>
          A growing body of participatory research, cross-sector collaboration, and deployment-led learning.
        </p>
      </div>

      <div className="evidence-story" data-enter>
        <div className="output-list">
          {outputs.map((output) => (
            <article key={output.title}>
              <h3>{output.title}</h3>
              <p>{output.description}</p>
            </article>
          ))}
        </div>
        <figure className="evidence-image">
          <img
            data-src={asset("assets/aesir/ai-for-all.webp")}
            alt="AESIR and programme partners at an inclusive AI deployment"
            width="1600"
            height="1200"
            loading="lazy"
            decoding="async"
            data-predictive-media
          />
        </figure>
      </div>

    </section>
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
  const isMobile = useMediaQuery("(max-width: 640px)");
  const collapsedProjectLimit = isMobile ? 6 : 12;

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return aesirProjects.filter((project) => {
      const categoryMatches = category === "All" || project.category === category;
      const queryMatches = !normalizedQuery
        || `${project.title} ${project.category} ${project.description}`.toLowerCase().includes(normalizedQuery);
      return categoryMatches && queryMatches;
    });
  }, [category, query]);

  const visibleProjects = expanded
    ? filteredProjects
    : filteredProjects.slice(0, collapsedProjectLimit);

  useEffect(() => setExpanded(false), [category, query, collapsedProjectLimit]);

  return (
    <section id="projects" className="projects-section section-shell">
      <div className="projects-heading" data-enter>
        <div>
          <h2>Field deployments across technology and society.</h2>
          <p>
            AESIR has delivered projects across diverse sectors and real-world contexts,
            translating research and emerging technology into practical applications for
            organisations, communities, and everyday life.
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
            aria-pressed={category === item}
            onClick={() => {
              setCategory(item);
              setQuery("");
              setExpanded(false);
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="project-context" aria-live="polite">
        {query
          ? `Showing matches for “${query}”${category === "All" ? "" : ` in ${category}`}`
          : category === "All"
            ? "Browsing the complete field archive"
            : `Browsing ${category}`}
      </p>

      {visibleProjects.length > 0 ? (
        <div id="project-grid" className="project-grid" key={`${category}-${query}`}>
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
                  data-src={asset(project.previewMedia ?? project.media)}
                  alt={`${project.title} project media`}
                  loading="lazy"
                  decoding="async"
                  data-predictive-media
                />
              </div>
              <div className="project-card__content">
                <span>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div>View project <ArrowUpRight size={16} aria-hidden="true" /></div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="project-empty">No projects match this search. Try another title or category.</div>
      )}

      {filteredProjects.length > collapsedProjectLimit && (
        <button
          type="button"
          className="archive-toggle"
          aria-expanded={expanded}
          aria-controls="project-grid"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show fewer projects" : "Explore more projects"}
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
            <h2>Built by practitioners across sectors and communities.</h2>
            <p>
              AESIR was built by social entrepreneurs working across AI, AR, VR, gaming,
              inclusive education, public innovation, and human-centred technology. The practice
              connects technical delivery with the realities of classrooms, clinics, community
              organisations, public programmes, and cross-sector partnerships.
            </p>
          </div>
        </div>

        <div className="leadership-feature" data-enter>
          <img
            data-src={asset("assets/aesir/ernest-reading.webp")}
            alt="AESIR Co-Founder Ernest HS CHAN reading an augmented-reality positive psychology playbook"
            width="2048"
            height="1365"
            loading="lazy"
            decoding="async"
            data-predictive-media
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
              <img
                data-src={asset(photo.src)}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
                data-predictive-media
              />
              <figcaption>{photo.label}</figcaption>
            </figure>
          ))}
        </div>

        <div className="archive-strip" data-enter>
          {archivePhotos.map(([src, alt, width, height]) => (
            <img
              key={src}
              data-src={asset(src)}
              alt={alt}
              width={width}
              height={height}
              loading="lazy"
              decoding="async"
              data-predictive-media
            />
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
        <h2>
          Build <span className="contact-word-with">with</span> AESIR
        </h2>
        <div>
          <p>
            Connect with AESIR about research collaboration, applied innovation, institutional
            programs, or technology deployment.
          </p>
          <a href={contactUrl} target="_blank" rel="noreferrer">
            Contact AESIR
          </a>
        </div>
      </div>
    </section>
  );
}

export function AesirResearchSite() {
  useEffect(() => installPredictiveMediaScheduler(), []);

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
        <HeroEvidence />
        <Thesis />
        <ResearchAreas />
        <Method />
        <Evidence />
        <ProjectLibrary />
        <Leadership />
        <Contact />
      </main>
      <footer className="aesir-footer">
        <img
          data-src={asset("assets/aesir/aesir-wordmark.webp")}
          alt="AESIR"
          width="1342"
          height="314"
          loading="lazy"
          decoding="async"
          data-predictive-media
        />
        <p>Evidence-based immersive intelligence.</p>
        <p>© {new Date().getFullYear()} AESIR</p>
      </footer>
    </div>
  );
}
