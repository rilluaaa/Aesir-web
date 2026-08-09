export const cinematicManifest = {
  mode: "procedural",
  scrollHeightVh: 500,
  mobileScrollHeightVh: 460,
  damping: 0.095,
  quality: {
    desktop: { pixelRatio: 1.45, particleCount: 620 },
    mobile: { pixelRatio: 1, particleCount: 310 },
  },
  sequence: {
    enabled: false,
    frameCount: 360,
    preloadRadius: 10,
    maxDecodedFrames: 42,
    sources: {
      desktopHigh: "assets/cinematic/desktop-high/frame_{frame}.webp",
      desktopMedium: "assets/cinematic/desktop-medium/frame_{frame}.webp",
      mobile: "assets/cinematic/mobile/frame_{frame}.webp",
    },
  },
  scenes: [
    {
      id: "human",
      number: "01",
      label: "Human",
      range: "0–20%",
      start: 0,
      peak: 0.1,
      end: 0.24,
      title: "Human complexity\nis not noise.",
      body: "We study cognition, behaviour, and interaction in real-world contexts.",
    },
    {
      id: "evidence",
      number: "02",
      label: "Evidence",
      range: "20–43%",
      start: 0.16,
      peak: 0.315,
      end: 0.49,
      title: "We measure.\nWe test.\nWe understand.",
      body: "Rigorous methodology.\nRobust data.\nReliable evidence.",
    },
    {
      id: "intelligence",
      number: "03",
      label: "Immersive Intelligence",
      range: "43–68%",
      start: 0.4,
      peak: 0.555,
      end: 0.73,
      title: "Evidence becomes intelligence.\nIntelligence becomes experience.",
      body: "Human cognition, computational intelligence, and the physical world become one testable system.",
    },
    {
      id: "society",
      number: "04",
      label: "Society",
      range: "68–90%",
      start: 0.64,
      peak: 0.79,
      end: 0.925,
      title: "Intelligence\nfor a better society.",
      body: "Human-centric. Cyber-physical. Towards Society 5.0.",
    },
    {
      id: "home",
      number: "05",
      label: "Home",
      range: "90–100%",
      start: 0.86,
      peak: 0.955,
      end: 1,
      title: "Evidence-Based\nImmersive Intelligence",
      body: "Advancing research. Empowering society.",
    },
  ],
};

export const selectSequenceSource = (viewportWidth, devicePixelRatio = 1) => {
  if (viewportWidth <= 760) return "mobile";
  if (viewportWidth >= 1440 && devicePixelRatio >= 1.25) return "desktopHigh";
  return "desktopMedium";
};
