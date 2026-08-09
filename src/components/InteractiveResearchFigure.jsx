import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 36;
const padFrame = (index) => String(index + 1).padStart(2, "0");
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function InteractiveResearchFigure({ frameBase, poster }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return undefined;

    const context = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!context) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)");
    const frames = Array(FRAME_COUNT).fill(null);
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const centreIndex = Math.floor((FRAME_COUNT - 1) / 2);
    let visible = true;
    let disposed = false;
    let animationFrame = 0;
    let lastFrameTime = 0;
    let mobilePhase = 0;
    let canvasWidth = 1;
    let canvasHeight = 1;
    let cssWidth = 1;
    let cssHeight = 1;

    const drawCover = (image, opacity = 1) => {
      const imageWidth = image.naturalWidth || image.width;
      const imageHeight = image.naturalHeight || image.height;
      const scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
      const drawWidth = imageWidth * scale;
      const drawHeight = imageHeight * scale;
      const mobile = cssWidth <= 640;
      const focusX = mobile ? 0.68 : 1;
      const focusY = mobile ? 0.5 : 1;
      const verticalTravel = current.y * canvasHeight * 0.018;
      const x = (canvasWidth - drawWidth) * focusX;
      const y = (canvasHeight - drawHeight) * focusY - verticalTravel;

      context.globalAlpha = opacity;
      context.drawImage(image, x, y, drawWidth, drawHeight);
    };

    const nearestLoadedFrame = (index) => {
      const rounded = clamp(Math.round(index), 0, FRAME_COUNT - 1);
      if (frames[rounded]) return frames[rounded];
      for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
        if (frames[rounded - offset]) return frames[rounded - offset];
        if (frames[rounded + offset]) return frames[rounded + offset];
      }
      return null;
    };

    const paint = () => {
      const framePosition = ((current.x + 1) / 2) * (FRAME_COUNT - 1);
      const lowerIndex = Math.floor(framePosition);
      const upperIndex = Math.min(FRAME_COUNT - 1, lowerIndex + 1);
      const lower = frames[lowerIndex];
      const upper = frames[upperIndex];
      const fallback = nearestLoadedFrame(framePosition);

      context.globalAlpha = 1;
      context.fillStyle = "#f7f8fb";
      context.fillRect(0, 0, canvasWidth, canvasHeight);

      if (lower && upper && lower !== upper) {
        const mix = framePosition - lowerIndex;
        drawCover(lower, 1);
        drawCover(upper, mix);
      } else if (fallback) {
        drawCover(fallback, 1);
      }
      context.globalAlpha = 1;

      const tilt = current.y * -5.5;
      const lift = current.y * -14;
      canvas.style.transform = `scale(1.035) perspective(1200px) rotateX(${tilt}deg) translate3d(0, ${lift}px, 0)`;
    };

    const render = (time = 0) => {
      animationFrame = 0;
      if (!visible || disposed) return;

      const mobileMotion = coarsePointer.matches && !reduceMotion.matches;
      if (mobileMotion && time - lastFrameTime < 1000 / 30) {
        animationFrame = window.requestAnimationFrame(render);
        return;
      }

      const elapsed = lastFrameTime ? Math.min(64, time - lastFrameTime) : 16;
      lastFrameTime = time;
      if (mobileMotion) {
        mobilePhase += elapsed * 0.00025;
        target.x = Math.sin(mobilePhase) * 0.34;
        target.y = Math.sin(mobilePhase * 0.72) * 0.09;
      }

      const easing = 1 - Math.exp(-elapsed / 68);
      current.x += (target.x - current.x) * easing;
      current.y += (target.y - current.y) * easing;
      paint();

      const unsettled = Math.abs(target.x - current.x) > 0.001
        || Math.abs(target.y - current.y) > 0.001;
      if (mobileMotion || unsettled) animationFrame = window.requestAnimationFrame(render);
    };

    const requestRender = () => {
      if (!animationFrame && visible && !disposed) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, coarsePointer.matches ? 1.1 : 1.35);
      cssWidth = Math.max(1, bounds.width);
      cssHeight = Math.max(1, bounds.height);
      canvasWidth = Math.round(cssWidth * pixelRatio);
      canvasHeight = Math.round(cssHeight * pixelRatio);
      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }
      requestRender();
    };

    const onPointerMove = (event) => {
      if (coarsePointer.matches || reduceMotion.matches) return;
      target.x = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
      target.y = clamp(-((event.clientY / window.innerHeight) * 2 - 1), -1, 1);
      requestRender();
    };

    const loadFrame = (index) => new Promise((resolve) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (!disposed) {
          frames[index] = image;
          if (index === centreIndex) setReady(true);
          requestRender();
        }
        resolve();
      };
      image.onerror = resolve;
      image.src = `${frameBase}frame-${padFrame(index)}.webp`;
    });

    const loadOrder = [centreIndex];
    for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
      const before = centreIndex - offset;
      const after = centreIndex + offset;
      if (before >= 0) loadOrder.push(before);
      if (after < FRAME_COUNT) loadOrder.push(after);
    }
    loadFrame(centreIndex).then(() => Promise.all(
      loadOrder.slice(1).map((index) => loadFrame(index)),
    ));

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestRender();
      else if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    }, { rootMargin: "100px" });

    const onMotionPreferenceChange = () => {
      if (reduceMotion.matches) {
        target.x = 0;
        target.y = 0;
      }
      requestRender();
    };

    resizeObserver.observe(stage);
    intersectionObserver.observe(stage);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    reduceMotion.addEventListener("change", onMotionPreferenceChange);
    coarsePointer.addEventListener("change", resize);
    resize();

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      reduceMotion.removeEventListener("change", onMotionPreferenceChange);
      coarsePointer.removeEventListener("change", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [frameBase]);

  return (
    <div className={`research-figure${ready ? " is-ready" : ""}`}>
      <img className="research-figure__poster" src={poster} alt="" />
      <canvas ref={canvasRef} className="research-figure__canvas" />
    </div>
  );
}
