import React, {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { localizeProject } from "../i18n/projectTranslations.js";
import {
  calculateSectionTargetY,
  getActiveSectionId,
  SECTION_IDS,
} from "../sectionNavigation.js";
import {
  getInitialLanguage,
  LANGUAGE_KEYS,
  LANGUAGE_STORAGE_KEY,
  languages,
} from "../i18n/translations.js";
import "./AesirResearchSite.css";

const contactUrl = "https://aesir.hk/#contactus";
const asset = (path) =>
  /^https?:\/\//.test(path)
    ? path
    : `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const LocalizationContext = createContext({
  language: "en",
  setLanguage: () => {},
  copy: languages.en,
});

const useLocalization = () => useContext(LocalizationContext);

const newPhotos = [
  {
    src: "assets/aesir/founder-panel.webp",
    width: 1600,
    height: 1200,
  },
  {
    src: "assets/aesir/ai-for-all.webp",
    width: 1600,
    height: 1200,
  },
  {
    src: "assets/aesir/hkict-2021.webp",
    width: 800,
    height: 600,
  },
  {
    src: "assets/aesir/business-practicum.webp",
    width: 800,
    height: 600,
  },
];

const archivePhotos = [
  ["assets/founders/ernest-elon-musk-hong-kong.jpeg", 960, 697],
  ["assets/founders/community-program.jpg", 640, 398],
  ["assets/founders/aesir-presentation.jpeg", 596, 335],
  ["assets/founders/founder-speaking.jpeg", 617, 324],
  ["assets/founders/founders-crates-photo.jpeg", 1066, 1600],
  ["assets/founders/founders-interview.jpg", 800, 535],
  ["assets/founders/dbs-nus-awards-2016.jpeg", 960, 587],
  ["assets/founders/happy-kingdom-with-guest.jpeg", 960, 720],
  ["assets/founders/lion-rock-daily-coverage.jpeg", 1149, 1062],
  ["assets/founders/founders-staircase-photo.jpeg", 1600, 1055],
];

const projectViewer = (project, language) => {
  const params = new URLSearchParams({
    lang: language,
    title: project.title,
    category: project.category,
    description: project.description,
    media: asset(project.media),
  });

  if (project.link) params.set("link", project.link);

  return `${asset("project-viewer.html")}?${params.toString()}`;
};

const getHeaderHeight = () => (
  document.querySelector(".aesir-header__inner")
    ?? document.querySelector(".aesir-header")
)?.getBoundingClientRect().height ?? 88;

let cancelPendingScrollCorrection = () => {};

const getSectionTargetY = (id) => {
  if (id === "top") return 0;

  const element = document.getElementById(id);
  if (!element) return null;

  return calculateSectionTargetY({
    elementTop: element.getBoundingClientRect().top,
    scrollY: window.scrollY,
    headerHeight: getHeaderHeight(),
  });
};

const scheduleScrollCorrection = (id, behavior) => {
  cancelPendingScrollCorrection();
  const interruptionEvents = ["wheel", "touchstart", "keydown"];

  const correctPosition = () => {
    const targetY = getSectionTargetY(id);
    if (targetY !== null && Math.abs(window.scrollY - targetY) > 2) {
      window.scrollTo({ top: targetY, behavior: "auto" });
    }
  };

  if (behavior === "auto") {
    let cancelled = false;
    const cancel = () => {
      if (cancelled) return;
      cancelled = true;
      window.clearTimeout(correctionTimer);
      interruptionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, cancel, true);
      });
    };
    const correctionTimer = window.setTimeout(() => {
      if (cancelled) return;
      cancel();
      correctPosition();
    }, 1200);
    interruptionEvents.forEach((eventName) => {
      window.addEventListener(eventName, cancel, { capture: true, once: true });
    });
    cancelPendingScrollCorrection = cancel;
    return;
  }

  let correctionTimer = 0;
  let fallbackTimer = 0;
  let finished = false;

  const cleanup = () => {
    window.removeEventListener("scrollend", finish);
    interruptionEvents.forEach((eventName) => {
      window.removeEventListener(eventName, cancel, true);
    });
    window.clearTimeout(correctionTimer);
    window.clearTimeout(fallbackTimer);
  };

  const cancel = () => {
    if (finished) return;
    finished = true;
    cleanup();
  };

  const finish = () => {
    if (finished) return;
    window.clearTimeout(fallbackTimer);
    correctionTimer = window.setTimeout(() => {
      if (finished) return;
      finished = true;
      cleanup();
      correctPosition();
    }, 80);
  };

  window.addEventListener("scrollend", finish, { once: true });
  interruptionEvents.forEach((eventName) => {
    window.addEventListener(eventName, cancel, { capture: true, once: true });
  });
  fallbackTimer = window.setTimeout(finish, 2000);
  cancelPendingScrollCorrection = cancel;
};

const scrollToSection = (id, options = {}) => {
  const behavior = options.behavior ?? (window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth");

  const targetY = getSectionTargetY(id);
  if (targetY === null) return;

  window.scrollTo({
    top: targetY,
    behavior,
  });
  scheduleScrollCorrection(id, behavior);
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
  const interactiveReadySourceRef = useRef(null);
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
    const onBootTimeout = () => void revealPosterFallback();

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
  }, [posterUrl, wordmarkUrl]);

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
        setReadySource(null);
        setScrubReadySource(null);
        interactiveReadySourceRef.current = null;
        delete video.dataset.resourceReadyAt;
        delete video.dataset.interactiveReadyAt;
        delete video.dataset.resourceStrategy;
        delete video.dataset.resourceBytes;

        resource = await loader.load(asset(finalVideoSource), {
          bufferFully: scrubCapable && !reducedMotion,
          signal: preparationController.signal,
        });
        if (preparationController.signal.aborted) throw new DOMException("Cancelled", "AbortError");

        video.dataset.resourceReadyAt = performance.now().toFixed(1);
        video.dataset.resourceStrategy = resource.fullyBuffered ? "blob" : "native";
        video.dataset.resourceBytes = String(resource.byteLength || 0);
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
    const video = videoRef.current;
    const interactiveReady = readySource === videoSource && (
      !scrubCapable
      || reducedMotion
      || scrubReadySource === videoSource
    );
    if (
      !video
      || !interactiveReady
      || interactiveReadySourceRef.current === videoSource
    ) return;

    interactiveReadySourceRef.current = videoSource;
    video.dataset.interactiveReadyAt = performance.now().toFixed(1);
    window.dispatchEvent(new CustomEvent("aesir:hero-ready", {
      detail: {
        source: videoSource,
        warmup: heroWarmupRef.current?.warmup,
        resourceStrategy: video.dataset.resourceStrategy,
        resourceBytes: Number(video.dataset.resourceBytes || 0),
      },
    }));
  }, [readySource, reducedMotion, scrubCapable, scrubReadySource, videoSource]);

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

function LanguageSelector({ mobile = false }) {
  const { language, setLanguage, copy } = useLocalization();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape" || !open) return;
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const chooseLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <div className={`language-selector${mobile ? " language-selector--mobile" : ""}`} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="language-selector__trigger"
        aria-label={copy.languageSelector}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {copy.languageLabel} <span aria-hidden="true">▾</span>
      </button>
      <div className="language-selector__menu" role="menu" hidden={!open}>
        {LANGUAGE_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            role="menuitemradio"
            aria-checked={language === key}
            className={language === key ? "is-active" : ""}
            onClick={() => chooseLanguage(key)}
          >
            {languages[key].languageLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

function Header({ activeSection }) {
  const { copy } = useLocalization();
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
        <button className="brand-button" onClick={() => navigate("top")} aria-label={copy.nav.backToTop}>
          <img
            src={asset("assets/aesir/aesir-wordmark.webp")}
            alt="AESIR"
            width="1342"
            height="314"
            fetchPriority="high"
            decoding="async"
          />
        </button>

        <nav className="desktop-nav" aria-label={copy.nav.primaryLabel}>
          {copy.nav.items.map(([label, id]) => (
            <button
              key={id}
              type="button"
              className={activeSection === id ? "is-active" : ""}
              aria-current={activeSection === id ? "location" : undefined}
              onClick={() => navigate(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <a
            className={`header-contact${activeSection === "contact" ? " is-active" : ""}`}
            href={contactUrl}
            target="_blank"
            rel="noreferrer"
          >
            {copy.nav.contact}
          </a>
          <LanguageSelector />
        </div>

        <button
          className="menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? copy.nav.close : copy.nav.open}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`mobile-nav-overlay${open ? " is-open" : ""}`} aria-hidden={!open}>
          <nav id="mobile-navigation" className="mobile-nav" aria-label={copy.nav.mobileLabel}>
            {copy.nav.items.map(([label, id]) => (
              <button key={id} onClick={() => navigate(id)}>
                {label}<ArrowRight size={17} aria-hidden="true" />
              </button>
            ))}
            <a href={contactUrl} target="_blank" rel="noreferrer">
              {copy.nav.contactAesir}<ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <LanguageSelector mobile />
          </nav>
        </div>
      </div>
    </header>
  );
}

function SectionDotNavigation({ activeSection }) {
  const { copy } = useLocalization();

  return (
    <nav className="section-dot-nav" aria-label={copy.sectionNavigation.label}>
      {copy.sectionNavigation.items.map(([label, id]) => (
        <button
          key={id}
          type="button"
          className={`section-dot${activeSection === id ? " is-active" : ""}`}
          aria-label={label}
          aria-current={activeSection === id ? "location" : undefined}
          onClick={() => scrollToSection(id)}
        >
          <span aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}

function Hero() {
  const { copy } = useLocalization();
  const { displayed, done } = useTypewriter(copy.hero.headline);

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
            {copy.hero.description}
          </p>

        </div>
      </div>
    </section>
  );
}

function HeroEvidence() {
  const { copy } = useLocalization();

  return (
    <section className="hero-evidence section-shell" aria-label={copy.heroEvidence.sectionLabel}>
      <figure>
        <img
          data-src={asset("assets/aesir/founder-panel.webp")}
          alt={copy.heroEvidence.imageAlt}
          width="1600"
          height="1200"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          data-predictive-media
        />
        <figcaption aria-label={copy.heroEvidence.credentialsLabel}>
          {copy.heroEvidence.credentials.map((credential) => <span key={credential}>{credential}</span>)}
        </figcaption>
      </figure>
    </section>
  );
}

function Thesis() {
  const { copy } = useLocalization();

  return (
    <section className="thesis-section section-shell" data-enter>
      <div className="thesis-heading">
        <h2>{copy.thesis.title}</h2>
        <p>{copy.thesis.intro}</p>
      </div>
      <div className="thesis-statement">
        <blockquote>
          {copy.thesis.statement}
        </blockquote>
        <p className="thesis-body">
          {copy.thesis.body}
        </p>
      </div>
    </section>
  );
}

function ResearchAreas() {
  const { copy } = useLocalization();
  const researchAreas = copy.researchAreas;
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
        <h2>{copy.research.title}</h2>
        <p>{copy.research.intro}</p>
      </div>

      <div className="research-tabs" role="tablist" aria-label={copy.research.areasLabel} data-enter>
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
          <div className="research-journey__steps" role="tablist" aria-label={`${activeArea.title} ${copy.research.sectionsLabel}`}>
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
            <div className="research-journey__controls" aria-label={copy.research.navigationLabel}>
              <button
                type="button"
                disabled={stageIndex === 0}
                onClick={() => setStageIndex((index) => Math.max(0, index - 1))}
              >
                <ArrowLeft size={17} aria-hidden="true" />
                {copy.research.previous}
              </button>
              <button
                type="button"
                disabled={stageIndex === finalStageIndex}
                onClick={() => setStageIndex((index) => Math.min(finalStageIndex, index + 1))}
              >
                {stageIndex === finalStageIndex ? copy.research.complete : activeArea.stages[stageIndex + 1].label}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>
        <div id={`research-cases-${activeArea.id}`} className="research-cases">
          <div className="research-cases__heading">
            <h4>{copy.research.built}</h4>
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
  const { copy } = useLocalization();

  return (
    <section id="method" className="method-section">
      <div className="section-shell" data-enter>
        <div className="method-heading">
          <h2>{copy.method.title}</h2>
          <p>{copy.method.intro}</p>
        </div>
        <ol className="method-flow">
          {copy.method.steps.map(([title, description], index) => (
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
  const { copy } = useLocalization();

  return (
    <section id="evidence" className="evidence-section section-shell">
      <div className="section-intro" data-enter>
        <h2>{copy.evidence.title}</h2>
        <p>{copy.evidence.intro}</p>
      </div>

      <div className="evidence-story" data-enter>
        <div className="output-list">
          {copy.evidence.outputs.map((output) => (
            <article key={output.title}>
              <h3>{output.title}</h3>
              <p>{output.description}</p>
            </article>
          ))}
        </div>
        <figure className="evidence-image">
          <img
            data-src={asset("assets/aesir/ai-for-all.webp")}
            alt={copy.evidence.imageAlt}
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
  const { language, copy } = useLocalization();
  const localizedProjects = useMemo(
    () => aesirProjects.map((project) => localizeProject(project, language)),
    [language],
  );
  const categories = useMemo(
    () => [
      { value: "all", label: copy.projects.all },
      ...Array.from(new Set(aesirProjects.map((project) => project.category))).map((originalCategory) => ({
        value: originalCategory,
        label: localizedProjects.find((project) => project.originalCategory === originalCategory)?.category ?? originalCategory,
      })),
    ],
    [copy.projects.all, localizedProjects],
  );
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const collapsedProjectLimit = isMobile ? 6 : 12;

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return localizedProjects.filter((project) => {
      const categoryMatches = category === "all" || project.originalCategory === category;
      const queryMatches = !normalizedQuery
        || `${project.title} ${project.category} ${project.description} ${project.originalTitle}`.toLowerCase().includes(normalizedQuery);
      return categoryMatches && queryMatches;
    });
  }, [category, localizedProjects, query]);

  const visibleProjects = expanded
    ? filteredProjects
    : filteredProjects.slice(0, collapsedProjectLimit);

  useEffect(() => setExpanded(false), [category, query, collapsedProjectLimit]);

  return (
    <section id="projects" className="projects-section section-shell">
      <div className="projects-heading" data-enter>
        <div>
          <h2>{copy.projects.title}</h2>
          <p>{copy.projects.intro}</p>
        </div>
        <div className="project-search">
          <Search size={18} aria-hidden="true" />
          <label className="sr-only" htmlFor="project-search">{copy.projects.searchLabel}</label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.projects.searchPlaceholder}
          />
        </div>
      </div>

      <div className="category-filter" aria-label={copy.projects.filterLabel} data-enter>
        {categories.map((item) => (
          <button
            key={item.value}
            className={category === item.value ? "is-active" : ""}
            aria-pressed={category === item.value}
            onClick={() => {
              setCategory(item.value);
              setQuery("");
              setExpanded(false);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="project-context" aria-live="polite">
        {query
          ? copy.projects.matches(query, category === "all" ? "" : categories.find((item) => item.value === category)?.label ?? category)
          : category === "all"
            ? copy.projects.browseAll
            : copy.projects.browseCategory(categories.find((item) => item.value === category)?.label ?? category)}
      </p>

      {visibleProjects.length > 0 ? (
        <div id="project-grid" className="project-grid" key={`${category}-${query}`}>
          {visibleProjects.map((project) => (
            <a
              key={`${project.number}-${project.originalTitle}-${project.media}`}
              className="project-card"
              href={projectViewer(project, language)}
              target="_blank"
              rel="noreferrer"
            >
              <div className="project-card__media">
                <img
                  data-src={asset(project.previewMedia ?? project.media)}
                  alt={copy.projects.mediaAlt(project.title)}
                  loading="lazy"
                  decoding="async"
                  data-predictive-media
                />
              </div>
              <div className="project-card__content">
                <span>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div>{copy.projects.view} <ArrowUpRight size={16} aria-hidden="true" /></div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="project-empty">{copy.projects.empty}</div>
      )}

      {filteredProjects.length > collapsedProjectLimit && (
        <button
          type="button"
          className="archive-toggle"
          aria-expanded={expanded}
          aria-controls="project-grid"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? copy.projects.fewer : copy.projects.more}
          <ChevronDown className={expanded ? "is-rotated" : ""} size={18} aria-hidden="true" />
        </button>
      )}
    </section>
  );
}

function Leadership() {
  const { copy } = useLocalization();

  return (
    <section id="leadership" className="leadership-section">
      <div className="section-shell">
        <div className="leadership-intro" data-enter>
          <div>
            <h2>{copy.leadership.title}</h2>
            <p>{copy.leadership.intro}</p>
          </div>
        </div>

        <div className="leadership-feature" data-enter>
          <img
            data-src={asset("assets/aesir/ernest-reading.webp")}
            alt={copy.leadership.featureAlt}
            width="2048"
            height="1365"
            loading="lazy"
            decoding="async"
            data-predictive-media
          />
          <div>
            <h3>{copy.leadership.featureTitle}</h3>
            <p>{copy.leadership.featureBody}</p>
          </div>
        </div>

        <div className="photo-grid" data-enter>
          {newPhotos.map((photo, index) => (
            <figure key={photo.src}>
              <img
                data-src={asset(photo.src)}
                alt={copy.leadership.photoAlts[index]}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
                data-predictive-media
              />
              <figcaption>{copy.leadership.photoLabels[index]}</figcaption>
            </figure>
          ))}
        </div>

        <div className="archive-strip" data-enter>
          {archivePhotos.map(([src, width, height], index) => (
            <img
              key={src}
              data-src={asset(src)}
              alt={copy.leadership.archiveAlts[index]}
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
  const { copy } = useLocalization();

  return (
    <section id="contact" className="contact-section">
      <div className="section-shell contact-layout" data-enter>
        <h2>
          {copy.contact.titleBefore}{" "}
          {copy.contact.titleWith && <span className="contact-word-with">{copy.contact.titleWith}</span>}
          {copy.contact.titleWith && " "}{copy.contact.titleAfter}
        </h2>
        <div>
          <p>{copy.contact.body}</p>
          <a href={contactUrl} target="_blank" rel="noreferrer">
            {copy.contact.action}
          </a>
        </div>
      </div>
    </section>
  );
}

export function AesirResearchSite() {
  const [language, setLanguageState] = useState(getInitialLanguage);
  const [activeSection, setActiveSection] = useState("top");
  const activeSectionRef = useRef(activeSection);
  const languageAnchorRef = useRef(null);
  const copy = languages[language];

  activeSectionRef.current = activeSection;

  const setLanguage = useCallback((nextLanguage) => {
    if (nextLanguage === language) return;

    const currentSection = document.getElementById(activeSectionRef.current);
    languageAnchorRef.current = currentSection
      ? {
          id: activeSectionRef.current,
          viewportTop: currentSection.getBoundingClientRect().top,
        }
      : null;
    setLanguageState(nextLanguage);
  }, [language]);

  const localization = useMemo(
    () => ({ language, setLanguage, copy }),
    [copy, language, setLanguage],
  );

  useLayoutEffect(() => {
    const anchor = languageAnchorRef.current;
    if (!anchor) return;

    let secondAnimationFrame = 0;
    const firstAnimationFrame = window.requestAnimationFrame(() => {
      secondAnimationFrame = window.requestAnimationFrame(() => {
        languageAnchorRef.current = null;
        const section = document.getElementById(anchor.id);
        if (!section) return;

        const delta = section.getBoundingClientRect().top - anchor.viewportTop;
        if (Math.abs(delta) > 0.5) window.scrollBy({ top: delta, behavior: "auto" });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstAnimationFrame);
      window.cancelAnimationFrame(secondAnimationFrame);
    };
  }, [language]);

  useEffect(() => installPredictiveMediaScheduler(), []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language === "en" ? "en" : "zh";
    document.documentElement.dataset.language = language;
    document.title = copy.seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", copy.seo.description);
  }, [copy.seo.description, copy.seo.title, language]);

  useEffect(() => {
    const sections = Object.fromEntries(
      SECTION_IDS.map((id) => [id, document.getElementById(id)]),
    );
    let animationFrame = 0;

    const updateActiveSection = () => {
      animationFrame = 0;
      const referenceY = getHeaderHeight() + Math.min(window.innerHeight * 0.22, 180);
      const sectionTops = Object.fromEntries(
        SECTION_IDS.map((id) => [id, sections[id]?.getBoundingClientRect().top]),
      );
      const documentElement = document.documentElement;
      const atDocumentEnd = window.scrollY + window.innerHeight
        >= documentElement.scrollHeight - 2;
      const nextSection = getActiveSectionId({
        sectionTops,
        referenceY,
        atDocumentEnd,
      });
      setActiveSection((currentSection) => (
        currentSection === nextSection ? currentSection : nextSection
      ));
    };

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    document.fonts?.ready?.then(requestUpdate).catch(() => undefined);
    requestUpdate();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [language]);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const resolveHash = () => {
      let targetId = window.location.hash.slice(1);

      if (window.location.hash.startsWith("#/founders")) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#leadership`);
        targetId = "leadership";
      } else if (window.location.hash.startsWith("#/neuro")) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#top`);
        targetId = "top";
      }

      if (!SECTION_IDS.includes(targetId)) return;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => scrollToSection(targetId, { behavior: "auto" }));
      });
    };

    resolveHash();
    if (!window.location.hash) window.scrollTo({ top: 0 });
    window.addEventListener("hashchange", resolveHash);

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
      window.removeEventListener("hashchange", resolveHash);
    };
  }, []);

  return (
    <LocalizationContext.Provider value={localization}>
    <div className="aesir-site">
      <Header activeSection={activeSection} />
      <SectionDotNavigation activeSection={activeSection} />
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
        <p>{copy.footer}</p>
        <p>© {new Date().getFullYear()} AESIR</p>
      </footer>
    </div>
    </LocalizationContext.Provider>
  );
}
