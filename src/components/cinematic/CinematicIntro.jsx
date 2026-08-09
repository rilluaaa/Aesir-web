import React, { useEffect, useRef, useState } from "react";
import { CinematicRenderer } from "./CinematicRenderer";
import { FrameSequenceCache } from "./FrameSequenceCache";
import {
  cinematicManifest,
  selectSequenceSource,
} from "./cinematicManifest";
import "./CinematicIntro.css";

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (start, end, value) => {
  const x = clamp((value - start) / (end - start));
  return x * x * (3 - 2 * x);
};
const stageOpacity = (progress, scene) => {
  const fadeIn = scene.id === "human" ? 1 : smoothstep(scene.start, scene.peak, progress);
  const fadeOut = scene.id === "home" ? 1 : 1 - smoothstep(scene.peak, scene.end, progress);
  return fadeIn * fadeOut;
};

export function CinematicIntro({ logoSrc, onPrepareHome, onHeaderVisibility }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const copyRefs = useRef([]);
  const rendererRef = useRef(null);
  const targetProgress = useRef(0);
  const renderedProgress = useRef(0);
  const isVisible = useRef(true);
  const preparedHome = useRef(false);
  const headerVisible = useRef(false);
  const layout = useRef({ top: 0, distance: 1, width: 0 });
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)");
    const isMobile = coarsePointer.matches || window.innerWidth <= 760;
    const quality = isMobile
      ? cinematicManifest.quality.mobile
      : cinematicManifest.quality.desktop;
    let frameCache = null;
    let lastDrawnProgress = -1;
    let animationFrame = 0;
    let fallbackTimer = 0;

    if (cinematicManifest.mode === "sequence" && cinematicManifest.sequence.enabled) {
      const sourceName = selectSequenceSource(window.innerWidth, window.devicePixelRatio);
      frameCache = new FrameSequenceCache({
        frameCount: cinematicManifest.sequence.frameCount,
        pathTemplate: cinematicManifest.sequence.sources[sourceName],
        preloadRadius: cinematicManifest.sequence.preloadRadius,
        maxDecodedFrames: cinematicManifest.sequence.maxDecodedFrames,
      });
      frameCache.prioritize(0);
    }

    const renderer = new CinematicRenderer(canvas, {
      particleCount: quality.particleCount,
      pixelRatio: quality.pixelRatio,
      frameCache,
    });
    rendererRef.current = renderer;

    const updateLayout = () => {
      const rect = section.getBoundingClientRect();
      layout.current = {
        top: rect.top + window.scrollY,
        distance: Math.max(1, section.offsetHeight - window.innerHeight),
        width: window.innerWidth,
      };
      renderer.resize(window.innerWidth, window.innerHeight);
      updateTarget();
      renderer.render(renderedProgress.current);
    };

    const updateUi = (progress) => {
      section.style.setProperty("--cinematic-progress", progress.toFixed(4));
      section.style.setProperty(
        "--cinematic-brand-opacity",
        (1 - smoothstep(0.82, 0.92, progress)).toFixed(4),
      );
      let closestScene = 0;
      let closestDistance = Infinity;
      cinematicManifest.scenes.forEach((scene, index) => {
        const opacity = stageOpacity(progress, scene);
        const copy = copyRefs.current[index];
        if (copy) {
          copy.style.setProperty("--stage-opacity", opacity.toFixed(4));
          copy.style.setProperty("--stage-shift", `${((scene.peak - progress) * 7).toFixed(2)}vh`);
          copy.style.pointerEvents = opacity > 0.62 ? "auto" : "none";
        }
        const distance = Math.abs(progress - scene.peak);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestScene = index;
        }
      });
      setActiveScene((current) => (current === closestScene ? current : closestScene));

      if (!preparedHome.current && progress > 0.84) {
        preparedHome.current = true;
        onPrepareHome?.();
      }
      const shouldShowHeader = progress > 0.988;
      if (headerVisible.current !== shouldShowHeader) {
        headerVisible.current = shouldShowHeader;
        onHeaderVisibility?.(shouldShowHeader);
      }
    };

    const render = () => {
      readTarget();
      const target = targetProgress.current;
      const current = renderedProgress.current;
      const next = reducedMotion.matches
        ? target
        : current + (target - current) * cinematicManifest.damping;
      renderedProgress.current = Math.abs(target - next) < 0.00012 ? target : next;
      if (Math.abs(lastDrawnProgress - renderedProgress.current) > 0.00005) {
        renderer.render(renderedProgress.current);
        updateUi(renderedProgress.current);
        lastDrawnProgress = renderedProgress.current;
      }
      animationFrame = 0;
      window.clearTimeout(fallbackTimer);
      fallbackTimer = 0;
      if (
        isVisible.current
        && Math.abs(targetProgress.current - renderedProgress.current) > 0.00012
      ) {
        scheduleRender();
      }
    };

    function scheduleRender() {
      if (animationFrame || !isVisible.current) return;
      animationFrame = window.requestAnimationFrame(render);
      fallbackTimer = window.setTimeout(() => {
        if (!animationFrame) return;
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        render();
      }, 80);
    }

    function readTarget() {
      const scrollY = window.scrollY;
      isVisible.current = scrollY >= layout.current.top - window.innerHeight
        && scrollY <= layout.current.top + section.offsetHeight;
      if (reducedMotion.matches) {
        targetProgress.current = 1;
      } else {
        targetProgress.current = clamp(
          (scrollY - layout.current.top) / layout.current.distance,
        );
      }
    }

    function updateTarget() {
      readTarget();
      if (!isVisible.current && targetProgress.current === 1) {
        renderedProgress.current = 1;
        lastDrawnProgress = 1;
        updateUi(1);
        return;
      }
      if (
        isVisible.current
        || Math.abs(targetProgress.current - renderedProgress.current) > 0.00012
      ) {
        scheduleRender();
      }
    }

    const onResize = () => {
      if (coarsePointer.matches && layout.current.width === window.innerWidth) return;
      updateLayout();
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", updateLayout, { passive: true });
    reducedMotion.addEventListener("change", updateLayout);
    updateLayout();
    updateUi(reducedMotion.matches ? 1 : 0);
    scheduleRender();

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", updateLayout);
      reducedMotion.removeEventListener("change", updateLayout);
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(fallbackTimer);
      frameCache?.dispose();
      rendererRef.current = null;
    };
  }, [onHeaderVisibility, onPrepareHome]);

  const jumpToScene = (scene) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(1, section.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: top + distance * scene.peak,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  const skipIntro = () => {
    const section = sectionRef.current;
    if (!section) return;
    onPrepareHome?.();
    window.scrollTo({
      top: section.getBoundingClientRect().top + window.scrollY + section.offsetHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="cinematic-intro"
      aria-label="AESIR research journey"
      style={{
        "--cinematic-height": `${cinematicManifest.scrollHeightVh}vh`,
        "--cinematic-mobile-height": `${cinematicManifest.mobileScrollHeightVh}vh`,
      }}
    >
      <div className="cinematic-intro__sticky">
        <canvas ref={canvasRef} className="cinematic-intro__canvas" aria-hidden="true" />
        <div className="cinematic-intro__wash" aria-hidden="true" />

        <div className="cinematic-intro__brand" aria-hidden="true">
          <img src={logoSrc} alt="" />
        </div>

        <nav className="cinematic-progress" aria-label="Cinematic chapters">
          <span className="cinematic-progress__track" aria-hidden="true">
            <span />
          </span>
          {cinematicManifest.scenes.map((scene, index) => (
            <button
              key={scene.id}
              type="button"
              className={index === activeScene ? "is-active" : ""}
              onClick={() => jumpToScene(scene)}
              aria-current={index === activeScene ? "step" : undefined}
              aria-label={`Go to ${scene.label}, ${scene.range}`}
            >
              <span>{scene.number}</span>
              <strong>{scene.label}</strong>
              <small>{scene.range}</small>
              <i aria-hidden="true" />
            </button>
          ))}
        </nav>

        <div className="cinematic-copy">
          {cinematicManifest.scenes.map((scene, index) => (
            <article
              key={scene.id}
              ref={(node) => { copyRefs.current[index] = node; }}
              className={`cinematic-copy__scene cinematic-copy__scene--${scene.id}`}
              style={{ "--stage-opacity": index === 0 ? 1 : 0, "--stage-shift": "0vh" }}
            >
              {scene.id === "home" && <img src={logoSrc} alt="" />}
              <h2>{scene.title}</h2>
              <p>{scene.body}</p>
            </article>
          ))}
        </div>

        <button className="cinematic-skip" type="button" onClick={skipIntro}>
          Skip intro
        </button>

        <div className="cinematic-scroll-hint" aria-hidden="true">
          <span>Scroll to explore</span>
          <i />
        </div>

      </div>
    </section>
  );
}
