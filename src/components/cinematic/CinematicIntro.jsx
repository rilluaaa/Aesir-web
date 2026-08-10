import React, { useEffect, useRef, useState } from "react";
import {
  CINEMATIC_FRAME_COUNT,
  CINEMATIC_FRAME_RATE,
  CINEMATIC_MIN_FRAME_INTERVAL_MS,
  CINEMATIC_SCROLL_HEIGHT_VH,
  dampCinematicProgress,
  getCinematicFocalY,
  getCinematicFrameIndex,
  getCinematicFrameUrl,
  getCinematicHandoffOpacity,
  getCinematicScrollProgress,
  getCoverSourceRect,
  selectCinematicSource,
  shouldPrepareExistingContent,
} from "../../cinematicIntro.js";
import {
  decodeImageUrl,
  isAbortError,
  revealAesirApp,
  waitForStableLayout,
} from "../../heroBoot.js";
import "./CinematicIntro.css";

const CONVERGENCE_EPSILON = 0.00015;
const DESKTOP_CACHE_LIMIT = 16;
const MOBILE_CACHE_LIMIT = 8;
const DESKTOP_PRELOAD_RADIUS = 4;
const MOBILE_PRELOAD_RADIUS = 2;
const PRELOAD_IDLE_MS = 140;

const getSelectedFrameBase = ({ desktopFrameBase, mobileFrameBase }) => selectCinematicSource({
  viewportWidth: typeof window === "undefined" ? 0 : window.innerWidth,
  desktopSource: desktopFrameBase,
  mobileSource: mobileFrameBase,
});

const decodeFrameBlob = async (blob) => {
  if (typeof createImageBitmap === "function") return createImageBitmap(blob);

  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = objectUrl;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export function CinematicIntro({
  desktopFrameBase,
  mobileFrameBase,
  posterSource,
  onHandoffApproach,
}) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const metricsRef = useRef({ top: 0, height: 1, viewportHeight: 1 });
  const targetProgressRef = useRef(0);
  const displayedProgressRef = useRef(0);
  const pendingFrameIndexRef = useRef(0);
  const displayedFrameIndexRef = useRef(-1);
  const animationFrameRef = useRef(0);
  const cadenceTimeoutRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const lastFrameRequestAtRef = useRef(Number.NEGATIVE_INFINITY);
  const handoffPreparedRef = useRef(false);
  const visibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const [selectedFrameBase, setSelectedFrameBase] = useState(() => getSelectedFrameBase({
    desktopFrameBase,
    mobileFrameBase,
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
    let resizeFrame = 0;
    const updateFrameBase = () => {
      resizeFrame = 0;
      const nextBase = getSelectedFrameBase({ desktopFrameBase, mobileFrameBase });
      setSelectedFrameBase((currentBase) => currentBase === nextBase ? currentBase : nextBase);
    };
    const queueFrameBaseUpdate = () => {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(updateFrameBase);
    };

    window.addEventListener("resize", queueFrameBaseUpdate, { passive: true });
    window.addEventListener("orientationchange", queueFrameBaseUpdate, { passive: true });
    return () => {
      window.removeEventListener("resize", queueFrameBaseUpdate);
      window.removeEventListener("orientationchange", queueFrameBaseUpdate);
      window.cancelAnimationFrame(resizeFrame);
    };
  }, [desktopFrameBase, mobileFrameBase]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas || !selectedFrameBase) return undefined;

    const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!context) return undefined;

    let disposed = false;
    let preloadTimeout = 0;
    let lastScrollAt = Number.NEGATIVE_INFINITY;
    let previousQueuedFrame = 0;
    let travelDirection = 1;
    let frameRequestInFlight = false;
    let activeFrameRequestIndex = -1;
    let latestTargetFrame = 0;
    const frameCache = new Map();
    const inFlightFrames = new Map();
    const mobileFrames = selectedFrameBase === mobileFrameBase;
    const cacheLimit = mobileFrames ? MOBILE_CACHE_LIMIT : DESKTOP_CACHE_LIMIT;
    const preloadRadius = mobileFrames ? MOBILE_PRELOAD_RADIUS : DESKTOP_PRELOAD_RADIUS;

    const closeFrame = (frame) => {
      if (typeof frame?.close === "function") frame.close();
    };

    const touchCachedFrame = (frameIndex) => {
      const frame = frameCache.get(frameIndex);
      if (!frame) return null;
      frameCache.delete(frameIndex);
      frameCache.set(frameIndex, frame);
      return frame;
    };

    const trimCache = () => {
      while (frameCache.size > cacheLimit) {
        const oldestIndex = frameCache.keys().next().value;
        const oldestFrame = frameCache.get(oldestIndex);
        frameCache.delete(oldestIndex);
        closeFrame(oldestFrame);
      }
    };

    const loadFrame = (frameIndex) => {
      const cachedFrame = touchCachedFrame(frameIndex);
      if (cachedFrame) return Promise.resolve(cachedFrame);
      if (inFlightFrames.has(frameIndex)) return inFlightFrames.get(frameIndex).promise;

      const controller = new AbortController();
      const promise = fetch(getCinematicFrameUrl({
        basePath: selectedFrameBase,
        frameIndex,
      }), {
        cache: "force-cache",
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) throw new Error(`Cinematic frame failed: ${response.status}`);
          return response.blob();
        })
        .then(decodeFrameBlob)
        .then((frame) => {
          if (disposed) {
            closeFrame(frame);
            return null;
          }
          frameCache.set(frameIndex, frame);
          trimCache();
          return frame;
        })
        .catch((error) => {
          if (error.name !== "AbortError") section.setAttribute("data-frame-fallback", "poster");
          return null;
        })
        .finally(() => {
          inFlightFrames.delete(frameIndex);
        });

      inFlightFrames.set(frameIndex, { controller, promise });
      return promise;
    };

    const abortObsoleteFrames = (targetIndex) => {
      inFlightFrames.forEach(({ controller }, frameIndex) => {
        if (
          frameIndex !== activeFrameRequestIndex
          &&
          Math.abs(frameIndex - targetIndex) > 2
          && Math.abs(frameIndex - latestTargetFrame) > 2
        ) controller.abort();
      });
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const sourceWidth = mobileFrames ? 1280 : 1440;
      const sourceHeight = mobileFrames ? 720 : 810;
      const scale = Math.max(0.5, Math.min(
        window.devicePixelRatio || 1,
        sourceWidth / Math.max(1, rect.width),
        sourceHeight / Math.max(1, rect.height),
      ));
      const width = Math.max(1, Math.round(rect.width * scale));
      const height = Math.max(1, Math.round(rect.height * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        displayedFrameIndexRef.current = -1;
      }
    };

    const drawFrame = (frame, frameIndex, progress) => {
      if (!frame || disposed) return;
      const targetIndex = pendingFrameIndexRef.current;
      const currentDistance = displayedFrameIndexRef.current < 0
        ? Number.POSITIVE_INFINITY
        : Math.abs(displayedFrameIndexRef.current - targetIndex);
      if (Math.abs(frameIndex - targetIndex) >= currentDistance) return;
      const source = getCoverSourceRect({
        sourceWidth: frame.width || frame.naturalWidth,
        sourceHeight: frame.height || frame.naturalHeight,
        destinationWidth: canvas.width,
        destinationHeight: canvas.height,
        focalY: getCinematicFocalY(progress),
      });
      context.drawImage(
        frame,
        source.x,
        source.y,
        source.width,
        source.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      displayedFrameIndexRef.current = frameIndex;
      canvas.dataset.frameIndex = String(frameIndex);
      section.classList.add("is-frame-ready");
    };

    const drawClosestCachedFrame = (progress) => {
      let closestIndex = -1;
      let closestDistance = Number.POSITIVE_INFINITY;
      frameCache.forEach((_, frameIndex) => {
        const distance = Math.abs(frameIndex - pendingFrameIndexRef.current);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = frameIndex;
        }
      });
      if (closestIndex < 0 || closestIndex === displayedFrameIndexRef.current) return;
      drawFrame(touchCachedFrame(closestIndex), closestIndex, progress);
    };

    const preloadNearbyFrames = (frameIndex) => {
      window.clearTimeout(preloadTimeout);
      const preload = () => {
        preloadTimeout = 0;
        const elapsedSinceScroll = performance.now() - lastScrollAt;
        if (elapsedSinceScroll < PRELOAD_IDLE_MS) {
          preloadTimeout = window.setTimeout(preload, PRELOAD_IDLE_MS - elapsedSinceScroll);
          return;
        }
        for (let offset = 1; offset <= preloadRadius; offset += 1) {
          const forward = frameIndex + offset;
          const backward = frameIndex - offset;
          if (forward < CINEMATIC_FRAME_COUNT) void loadFrame(forward);
          if (backward >= 0) void loadFrame(backward);
        }
      };
      preloadTimeout = window.setTimeout(preload, PRELOAD_IDLE_MS);
    };

    const preloadInTravelDirection = (frameIndex) => {
      if (inFlightFrames.size >= 3) return;
      for (let offset = 1; offset <= 2; offset += 1) {
        const candidate = frameIndex + (travelDirection * offset);
        if (
          candidate >= 0
          && candidate < CINEMATIC_FRAME_COUNT
          && !frameCache.has(candidate)
          && !inFlightFrames.has(candidate)
        ) void loadFrame(candidate);
      }
    };

    const requestLatestFrame = () => {
      cadenceTimeoutRef.current = 0;
      if (disposed || document.hidden || frameRequestInFlight) return;
      const frameIndex = pendingFrameIndexRef.current;
      if (frameIndex === displayedFrameIndexRef.current) return;

      const now = performance.now();
      const elapsed = now - lastFrameRequestAtRef.current;
      if (elapsed < CINEMATIC_MIN_FRAME_INTERVAL_MS) {
        cadenceTimeoutRef.current = window.setTimeout(
          requestLatestFrame,
          CINEMATIC_MIN_FRAME_INTERVAL_MS - elapsed,
        );
        return;
      }

      lastFrameRequestAtRef.current = now;
      abortObsoleteFrames(frameIndex);
      frameRequestInFlight = true;
      activeFrameRequestIndex = frameIndex;
      void loadFrame(frameIndex)
        .then((frame) => {
          if (!frame) return;
          drawFrame(frame, frameIndex, displayedProgressRef.current);
          if (frameIndex === pendingFrameIndexRef.current) {
            preloadInTravelDirection(frameIndex);
            preloadNearbyFrames(frameIndex);
          }
        })
        .finally(() => {
          frameRequestInFlight = false;
          activeFrameRequestIndex = -1;
          if (
            !disposed
            && displayedFrameIndexRef.current !== pendingFrameIndexRef.current
            && !cadenceTimeoutRef.current
          ) cadenceTimeoutRef.current = window.setTimeout(requestLatestFrame, 0);
        });
    };

    const queueFrame = (progress) => {
      const frameIndex = getCinematicFrameIndex(progress);
      if (frameIndex !== previousQueuedFrame) {
        travelDirection = Math.sign(frameIndex - previousQueuedFrame) || travelDirection;
        previousQueuedFrame = frameIndex;
      }
      pendingFrameIndexRef.current = frameIndex;
      drawClosestCachedFrame(progress);
      if (cadenceTimeoutRef.current || frameIndex === displayedFrameIndexRef.current) return;
      requestLatestFrame();
    };

    const primeLatestTargetFrame = () => {
      abortObsoleteFrames(latestTargetFrame);
      if (!frameCache.has(latestTargetFrame) && !inFlightFrames.has(latestTargetFrame)) {
        void loadFrame(latestTargetFrame);
      }
    };

    const applyProgress = (progress) => {
      section.style.setProperty(
        "--cinematic-handoff-opacity",
        getCinematicHandoffOpacity(progress).toFixed(4),
      );
      queueFrame(progress);
    };

    const updateTarget = () => {
      lastScrollAt = performance.now();
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
      latestTargetFrame = getCinematicFrameIndex(progress);
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
      primeLatestTargetFrame();
      applyProgress(displayedProgressRef.current);

      if (
        visibleRef.current
        && Math.abs(targetProgressRef.current - displayedProgressRef.current) > CONVERGENCE_EPSILON
      ) scheduleRender();
    };

    function scheduleRender() {
      if (animationFrameRef.current || disposed || document.hidden) return;
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
        return;
      }
      updateTarget();
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedMotionRef.current = reducedMotion;
    if (reducedMotion) {
      section.classList.add("is-handoff-complete");
      handoffPreparedRef.current = true;
      onHandoffApproach?.();
    }

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateMetrics, { passive: true });
    window.addEventListener("orientationchange", updateMetrics, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    updateMetrics();

    return () => {
      disposed = true;
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateMetrics);
      window.removeEventListener("orientationchange", updateMetrics);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(cadenceTimeoutRef.current);
      cadenceTimeoutRef.current = 0;
      window.clearTimeout(preloadTimeout);
      inFlightFrames.forEach(({ controller }) => controller.abort());
      frameCache.forEach(closeFrame);
      inFlightFrames.clear();
      frameCache.clear();
    };
  }, [mobileFrameBase, onHandoffApproach, selectedFrameBase]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="cinematic-intro"
      aria-label="AESIR cinematic introduction"
      style={{ "--cinematic-scroll-height": `${CINEMATIC_SCROLL_HEIGHT_VH}vh` }}
    >
      <div className="cinematic-intro__sticky" aria-hidden="true">
        <img
          src={posterSource}
          alt=""
          decoding="async"
          fetchPriority="high"
          draggable="false"
        />
        <canvas ref={canvasRef} />
        <div className="cinematic-intro__handoff" />
      </div>
    </section>
  );
}
