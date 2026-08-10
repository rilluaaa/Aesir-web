import React, { useEffect, useRef, useState } from "react";
import {
  CINEMATIC_FRAME_RATE,
  CINEMATIC_SCROLL_HEIGHT_VH,
  clampCinematicProgress,
  dampCinematicProgress,
  getCinematicFocalY,
  getCinematicFrame,
  getCinematicHandoffOpacity,
  getCinematicScrollProgress,
  getCoverSourceRect,
  selectCinematicSource,
  shouldPrepareExistingContent,
} from "../../cinematicIntro.js";
import {
  createHeroVideoResourceLoader,
  decodeImageUrl,
  isAbortError,
  revealAesirApp,
  waitForStableLayout,
} from "../../heroBoot.js";
import "./CinematicIntro.css";

const CONVERGENCE_EPSILON = 0.00015;
const SEEK_RELEASE_MS = 180;
const CANVAS_DPR_LIMIT = 1.5;

const waitForVideoEvent = (video, eventName, signal) => new Promise((resolve, reject) => {
  if (signal.aborted) {
    reject(new DOMException("Cinematic preparation cancelled", "AbortError"));
    return;
  }

  const cleanup = () => {
    video.removeEventListener(eventName, onEvent);
    signal.removeEventListener("abort", onAbort);
  };
  const onEvent = () => {
    cleanup();
    resolve();
  };
  const onAbort = () => {
    cleanup();
    reject(new DOMException("Cinematic preparation cancelled", "AbortError"));
  };

  video.addEventListener(eventName, onEvent, { once: true });
  signal.addEventListener("abort", onAbort, { once: true });
});

export function CinematicIntro({
  desktopSource,
  mobileSource,
  posterSource,
  onHandoffApproach,
}) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const metricsRef = useRef({ top: 0, height: 1, viewportHeight: 1 });
  const targetProgressRef = useRef(0);
  const displayedProgressRef = useRef(0);
  const pendingTimeRef = useRef(null);
  const seekInFlightRef = useRef(false);
  const seekTimeoutRef = useRef(0);
  const animationFrameRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const lastFrameIndexRef = useRef(-1);
  const handoffPreparedRef = useRef(false);
  const visibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [selectedSource] = useState(() => selectCinematicSource({
    viewportWidth: typeof window === "undefined" ? 0 : window.innerWidth,
    desktopSource,
    mobileSource,
  }));

  useEffect(() => {
    const controller = new AbortController();
    const revealPoster = async () => {
      try {
        await decodeImageUrl({ url: posterSource, signal: controller.signal });
        await waitForStableLayout({ signal: controller.signal });
      } catch (error) {
        if (isAbortError(error)) return;
      }

      if (!document.documentElement.classList.contains("aesir-app-ready")) {
        revealAesirApp({ mode: "cinematic-poster" });
      }
      window.clearTimeout(window.__AESIR_BOOT_WATCHDOG__);
      window.clearTimeout(window.__AESIR_BOOT_HARD_FALLBACK__);
    };

    void revealPoster();
    return () => controller.abort();
  }, [posterSource]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !selectedSource) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedMotionRef.current = reducedMotion;
    if (reducedMotion) {
      sectionRef.current?.classList.add("is-handoff-complete");
      handoffPreparedRef.current = true;
      onHandoffApproach?.();
      return undefined;
    }

    const controller = new AbortController();
    const loader = createHeroVideoResourceLoader();
    let resource = null;

    const prepareVideo = async () => {
      try {
        resource = await loader.load(selectedSource);
        video.src = resource.objectUrl;
        video.load();
        if (video.readyState < 1) await waitForVideoEvent(video, "loadedmetadata", controller.signal);
        if (video.readyState < 2) await waitForVideoEvent(video, "loadeddata", controller.signal);
        const warmTime = Math.min(1 / CINEMATIC_FRAME_RATE, Math.max(0, video.duration - 0.001));
        if (warmTime > 0) {
          video.currentTime = warmTime;
          await waitForVideoEvent(video, "seeked", controller.signal);
          video.currentTime = 0;
          await waitForVideoEvent(video, "seeked", controller.signal);
        }
        resource.activate();
        setMediaReady(true);
      } catch (error) {
        resource?.release();
        if (!isAbortError(error)) sectionRef.current?.setAttribute("data-media-fallback", "poster");
      }
    };

    void prepareVideo();
    return () => {
      controller.abort();
      loader.dispose();
      resource?.release();
      video.removeAttribute("src");
      video.load();
    };
  }, [onHandoffApproach, selectedSource]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!section || !canvas || !video) return undefined;

    const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!context) return undefined;

    let disposed = false;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(CANVAS_DPR_LIMIT, Math.max(1, window.devicePixelRatio || 1));
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        lastFrameIndexRef.current = -1;
      }
    };

    const drawFrame = (progress) => {
      if (video.readyState < 2 || video.videoWidth <= 0 || video.videoHeight <= 0) return;
      resizeCanvas();
      const source = getCoverSourceRect({
        sourceWidth: video.videoWidth,
        sourceHeight: video.videoHeight,
        destinationWidth: canvas.width,
        destinationHeight: canvas.height,
        focalY: getCinematicFocalY(progress),
      });
      context.drawImage(
        video,
        source.x,
        source.y,
        source.width,
        source.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      section.classList.add("is-canvas-ready");
    };

    const releaseSeek = () => {
      window.clearTimeout(seekTimeoutRef.current);
      seekTimeoutRef.current = 0;
      seekInFlightRef.current = false;
      flushLatestSeek();
    };

    const onSeeked = () => {
      const pendingTime = pendingTimeRef.current;
      const hasNewerTarget = pendingTime !== null
        && Math.abs(pendingTime - video.currentTime) > 1 / (CINEMATIC_FRAME_RATE * 2);
      if (!hasNewerTarget) drawFrame(displayedProgressRef.current);
      releaseSeek();
    };

    function flushLatestSeek() {
      if (
        disposed
        || document.hidden
        || seekInFlightRef.current
        || video.seeking
        || pendingTimeRef.current === null
        || video.readyState < 1
      ) return;

      const nextTime = pendingTimeRef.current;
      pendingTimeRef.current = null;
      if (Math.abs(video.currentTime - nextTime) < 1 / (CINEMATIC_FRAME_RATE * 2)) {
        drawFrame(displayedProgressRef.current);
        return;
      }

      seekInFlightRef.current = true;
      try {
        video.currentTime = nextTime;
        seekTimeoutRef.current = window.setTimeout(() => {
          drawFrame(displayedProgressRef.current);
          releaseSeek();
        }, SEEK_RELEASE_MS);
      } catch {
        releaseSeek();
      }
    }

    const queueFrame = (progress) => {
      const frame = getCinematicFrame(progress, video.duration);
      if (frame.index === lastFrameIndexRef.current) return;
      lastFrameIndexRef.current = frame.index;
      pendingTimeRef.current = frame.time;
      flushLatestSeek();
    };

    const applyProgress = (progress) => {
      section.style.setProperty(
        "--cinematic-handoff-opacity",
        getCinematicHandoffOpacity(progress).toFixed(4),
      );
      queueFrame(progress);
    };

    const updateTarget = () => {
      const metrics = metricsRef.current;
      const progress = reducedMotionRef.current
        ? 0
        : getCinematicScrollProgress({
          scrollY: window.scrollY,
          sectionTop: metrics.top,
          sectionHeight: metrics.height,
          viewportHeight: metrics.viewportHeight,
        });
      targetProgressRef.current = progress;
      visibleRef.current = window.scrollY >= metrics.top - metrics.viewportHeight
        && window.scrollY <= metrics.top + metrics.height;

      const handoffComplete = (metrics.top + metrics.height - window.scrollY) <= 96;
      section.classList.toggle("is-handoff-complete", handoffComplete);
      if (!handoffPreparedRef.current && shouldPrepareExistingContent(progress)) {
        handoffPreparedRef.current = true;
        onHandoffApproach?.();
      }
      scheduleRender();
    };

    const render = (timestamp) => {
      animationFrameRef.current = 0;
      const previous = lastTimestampRef.current || timestamp - 16.67;
      const deltaMs = Math.min(48, Math.max(1, timestamp - previous));
      lastTimestampRef.current = timestamp;
      const next = reducedMotionRef.current
        ? 0
        : dampCinematicProgress({
          current: displayedProgressRef.current,
          target: targetProgressRef.current,
          deltaMs,
        });
      displayedProgressRef.current = Math.abs(targetProgressRef.current - next) < CONVERGENCE_EPSILON
        ? targetProgressRef.current
        : next;
      applyProgress(displayedProgressRef.current);

      if (
        visibleRef.current
        && Math.abs(targetProgressRef.current - displayedProgressRef.current) > CONVERGENCE_EPSILON
      ) scheduleRender();
    };

    function scheduleRender() {
      if (animationFrameRef.current || disposed || document.hidden || !mediaReady) return;
      animationFrameRef.current = window.requestAnimationFrame(render);
    }

    const updateMetrics = () => {
      const rect = section.getBoundingClientRect();
      metricsRef.current = {
        top: rect.top + window.scrollY,
        height: section.offsetHeight,
        viewportHeight: window.innerHeight,
      };
      resizeCanvas();
      updateTarget();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
        pendingTimeRef.current = null;
        return;
      }
      updateTarget();
    };

    video.pause();
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateMetrics, { passive: true });
    window.addEventListener("orientationchange", updateMetrics, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    updateMetrics();
    if (mediaReady) {
      drawFrame(0);
      scheduleRender();
    }

    return () => {
      disposed = true;
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateMetrics);
      window.removeEventListener("orientationchange", updateMetrics);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(seekTimeoutRef.current);
    };
  }, [mediaReady, onHandoffApproach]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="cinematic-intro"
      aria-label="AESIR cinematic introduction"
      style={{ "--cinematic-scroll-height": `${CINEMATIC_SCROLL_HEIGHT_VH}vh` }}
    >
      <div className="cinematic-intro__sticky" aria-hidden="true">
        <img src={posterSource} alt="" decoding="async" draggable="false" />
        <canvas ref={canvasRef} />
        <video ref={videoRef} muted playsInline preload="none" tabIndex="-1" />
        <div className="cinematic-intro__handoff" />
      </div>
    </section>
  );
}
