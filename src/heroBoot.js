import { mapPointerToGazeTime } from "./heroVideo.js";

export const HERO_BOOT_WATCHDOG_MS = 12000;

export const HERO_BOOT_REQUIREMENTS = Object.freeze([
  "mounted",
  "fontsReady",
  "criticalImagesReady",
  "posterReady",
  "layoutStable",
]);

export const HERO_VIDEO_REQUIREMENTS = Object.freeze([
  "sourceResolved",
  "sourceAttached",
  "metadataReady",
  "framesWarmed",
  "neutralReady",
]);

export const createHeroBootReadiness = (overrides = {}) => ({
  mounted: false,
  sourceResolved: false,
  sourceAttached: false,
  metadataReady: false,
  framesWarmed: false,
  neutralReady: false,
  fontsReady: false,
  criticalImagesReady: false,
  posterReady: false,
  layoutStable: false,
  ...overrides,
});

export const isHeroBootReady = (readiness) => HERO_BOOT_REQUIREMENTS
  .every((requirement) => readiness?.[requirement] === true);

export const isHeroVideoReady = (readiness) => HERO_VIDEO_REQUIREMENTS
  .every((requirement) => readiness?.[requirement] === true);

export const resolveHeroDownloadSource = ({ sourceResolved, videoSource }) => (
  sourceResolved === true && typeof videoSource === "string" && videoSource.length > 0
    ? videoSource
    : null
);

export const getHeroBootRevealMode = ({
  readiness,
  timedOut,
  posterReady,
}) => {
  if (isHeroBootReady(readiness) && isHeroVideoReady(readiness)) return "video";
  if (isHeroBootReady(readiness)) return "poster";
  if (timedOut === true && posterReady === true) return "poster";
  return "covered";
};

export const getHeroWarmupTimes = ({
  duration,
  scrubCapable,
  reducedMotion,
}) => {
  if (!Number.isFinite(duration) || duration <= 0) return [];

  const neutral = mapPointerToGazeTime(0.5, duration);
  if (reducedMotion) return [neutral];
  if (!scrubCapable) return [0];

  return [
    mapPointerToGazeTime(0, duration),
    mapPointerToGazeTime(1, duration),
    neutral,
  ];
};

export const getNextHeroScrubTime = ({
  presentedTime,
  desiredTime,
  elapsedMs,
  duration,
  responseMs = 42,
  minimumStep = 1 / 60,
  snapThreshold = 1 / 240,
}) => {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const current = Math.min(safeDuration, Math.max(0, Number(presentedTime) || 0));
  const desired = Math.min(safeDuration, Math.max(0, Number(desiredTime) || 0));
  const distance = desired - current;
  if (Math.abs(distance) <= snapThreshold) return desired;

  const safeElapsed = Math.max(1, Number(elapsedMs) || (1000 / 60));
  const safeResponse = Math.max(1, Number(responseMs) || 42);
  const alpha = 1 - Math.exp(-safeElapsed / safeResponse);
  const easedStep = Math.abs(distance) * alpha;
  const step = Math.min(
    Math.abs(distance),
    Math.max(easedStep, Math.min(Math.abs(distance), minimumStep)),
  );
  const next = current + Math.sign(distance) * step;

  return Math.abs(desired - next) <= snapThreshold
    ? desired
    : Math.min(safeDuration, Math.max(0, next));
};

export const getHeroScrubDelay = ({
  now,
  lastSeekStartedAt,
  intervalMs = 1000 / 45,
}) => {
  const currentTime = Number.isFinite(now) ? now : 0;
  const previousTime = Number.isFinite(lastSeekStartedAt) ? lastSeekStartedAt : 0;
  const minimumInterval = Math.max(0, Number(intervalMs) || 0);
  if (previousTime <= 0 || previousTime > currentTime) return 0;
  return Math.max(0, minimumInterval - (currentTime - previousTime));
};

const createAbortError = () => {
  if (typeof DOMException === "function") {
    return new DOMException("The hero preparation was cancelled.", "AbortError");
  }

  const error = new Error("The hero preparation was cancelled.");
  error.name = "AbortError";
  return error;
};

export const isAbortError = (error) => error?.name === "AbortError";

const throwIfAborted = (signal) => {
  if (signal?.aborted) throw createAbortError();
};

export const createHeroVideoResourceLoader = () => {
  let requestVersion = 0;
  let activeSourceUrl = null;
  let disposed = false;

  const cancelPending = () => {
    requestVersion += 1;
  };

  const load = async (sourceUrl) => {
    if (disposed) throw new Error("The hero resource loader has been disposed.");
    if (!sourceUrl) throw new Error("A final hero source is required.");

    cancelPending();
    const version = requestVersion;
    await Promise.resolve();
    if (disposed || version !== requestVersion) throw createAbortError();

    let activated = false;
    let released = false;

    return {
      mediaUrl: sourceUrl,
      sourceUrl,
      activate() {
        if (released || disposed || version !== requestVersion) throw createAbortError();
        activeSourceUrl = sourceUrl;
        activated = true;
      },
      release() {
        if (activated) return;
        released = true;
      },
    };
  };

  return {
    load,
    cancelPending,
    getActiveSourceUrl: () => activeSourceUrl,
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelPending();
      activeSourceUrl = null;
    },
  };
};

const waitForEvent = (target, eventName, { signal, timeoutMs = 2500 } = {}) => (
  new Promise((resolve, reject) => {
    throwIfAborted(signal);
    let timeoutId = 0;

    const cleanup = () => {
      target.removeEventListener(eventName, onEvent);
      signal?.removeEventListener("abort", onAbort);
      clearTimeout(timeoutId);
    };
    const onEvent = () => {
      cleanup();
      resolve();
    };
    const onAbort = () => {
      cleanup();
      reject(createAbortError());
    };

    target.addEventListener(eventName, onEvent, { once: true });
    signal?.addEventListener("abort", onAbort, { once: true });
    timeoutId = setTimeout(() => {
      cleanup();
      resolve();
    }, timeoutMs);
  })
);

const waitForReadyState = async (video, readyState, eventName, signal) => {
  throwIfAborted(signal);
  if (video.readyState >= readyState) return;
  await waitForEvent(video, eventName, { signal });
  throwIfAborted(signal);
  if (video.readyState < readyState) {
    throw new Error(`Hero video did not reach readyState ${readyState}.`);
  }
};

export const waitForDecodedVideoFrame = (
  video,
  {
    signal,
    timeoutMs = 900,
    requestFrame = globalThis.requestAnimationFrame,
    cancelFrame = globalThis.cancelAnimationFrame,
  } = {},
) => (
  new Promise((resolve, reject) => {
    throwIfAborted(signal);
    let frameCallbackId = null;
    let animationFrameId = null;
    let secondAnimationFrameId = null;
    let timeoutId = 0;

    const cleanup = () => {
      if (frameCallbackId !== null && typeof video.cancelVideoFrameCallback === "function") {
        video.cancelVideoFrameCallback(frameCallbackId);
      }
      if (animationFrameId !== null && typeof cancelFrame === "function") {
        cancelFrame(animationFrameId);
      }
      if (secondAnimationFrameId !== null && typeof cancelFrame === "function") {
        cancelFrame(secondAnimationFrameId);
      }
      signal?.removeEventListener("abort", onAbort);
      clearTimeout(timeoutId);
    };
    const finish = () => {
      cleanup();
      resolve();
    };
    const onAbort = () => {
      cleanup();
      reject(createAbortError());
    };

    signal?.addEventListener("abort", onAbort, { once: true });
    if (video.readyState >= 2 && video.seeking !== true) {
      if (typeof requestFrame === "function") {
        animationFrameId = requestFrame(() => {
          animationFrameId = null;
          secondAnimationFrameId = requestFrame(finish);
        });
      } else {
        timeoutId = setTimeout(finish, 32);
      }
      return;
    }

    if (typeof video.requestVideoFrameCallback === "function") {
      frameCallbackId = video.requestVideoFrameCallback(finish);
    } else {
      timeoutId = setTimeout(finish, 32);
      return;
    }

    timeoutId = setTimeout(finish, timeoutMs);
  })
);

export const seekAndDecodeHeroFrame = async (video, time, { signal } = {}) => {
  throwIfAborted(signal);
  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  const targetTime = Math.min(Math.max(0, duration - 0.001), Math.max(0, time));

  if (Math.abs(video.currentTime - targetTime) > 1 / 120) {
    const seeked = waitForEvent(video, "seeked", { signal });
    video.currentTime = targetTime;
    await seeked;
  }

  await waitForDecodedVideoFrame(video, { signal });
  throwIfAborted(signal);
  return targetTime;
};

export const warmHeroVideoFrames = async ({
  duration,
  scrubCapable,
  reducedMotion,
  seekFrame,
}) => {
  const times = getHeroWarmupTimes({ duration, scrubCapable, reducedMotion });
  for (const time of times) await seekFrame(time);
  return times;
};

export const attachAndWarmHeroVideo = async ({
  video,
  sourceUrl,
  scrubCapable,
  reducedMotion,
  signal,
}) => {
  throwIfAborted(signal);
  video.pause();
  video.src = sourceUrl;
  video.load();

  await waitForReadyState(video, 1, "loadedmetadata", signal);
  await waitForReadyState(video, 2, "loadeddata", signal);
  const times = await warmHeroVideoFrames({
    duration: video.duration,
    scrubCapable,
    reducedMotion,
    seekFrame: (time) => seekAndDecodeHeroFrame(video, time, { signal }),
  });

  return {
    metadataReady: true,
    framesWarmed: times.length > 0,
    neutralReady: reducedMotion || scrubCapable
      ? Math.abs(video.currentTime - mapPointerToGazeTime(0.5, video.duration)) < 1 / 30
      : video.readyState >= 2,
  };
};

export const decodeImageUrl = ({
  url,
  signal,
  ImageConstructor = globalThis.Image,
}) => new Promise((resolve, reject) => {
  if (!url || typeof ImageConstructor !== "function") {
    reject(new Error("A critical image URL and Image constructor are required."));
    return;
  }

  throwIfAborted(signal);
  const image = new ImageConstructor();

  const cleanup = () => {
    image.onload = null;
    image.onerror = null;
    signal?.removeEventListener("abort", onAbort);
  };
  const onAbort = () => {
    cleanup();
    image.src = "";
    reject(createAbortError());
  };
  const finish = async () => {
    try {
      if (typeof image.decode === "function") await image.decode();
      throwIfAborted(signal);
      cleanup();
      resolve(image);
    } catch (error) {
      cleanup();
      reject(error);
    }
  };

  image.onload = finish;
  image.onerror = () => {
    cleanup();
    reject(new Error(`Unable to load critical image: ${url}`));
  };
  signal?.addEventListener("abort", onAbort, { once: true });
  image.src = url;
  if (image.complete && image.naturalWidth > 0) void finish();
});

export const prepareHeroCriticalAssets = async ({
  fontReady,
  posterUrl,
  criticalImageUrls = [],
  signal,
  decodeImage = decodeImageUrl,
}) => {
  const [poster] = await Promise.all([
    decodeImage({ url: posterUrl, signal }),
    Promise.resolve(fontReady),
    ...criticalImageUrls.map((url) => decodeImage({ url, signal })),
  ]);

  return {
    fontsReady: true,
    criticalImagesReady: true,
    posterReady: Boolean(poster),
  };
};

export const waitForStableLayout = ({
  frames = 2,
  signal,
  requestFrame = globalThis.requestAnimationFrame,
} = {}) => new Promise((resolve, reject) => {
  let remaining = Math.max(1, frames);

  const onAbort = () => reject(createAbortError());
  signal?.addEventListener("abort", onAbort, { once: true });

  const next = () => {
    if (signal?.aborted) {
      signal.removeEventListener("abort", onAbort);
      reject(createAbortError());
      return;
    }
    remaining -= 1;
    if (remaining <= 0) {
      signal?.removeEventListener("abort", onAbort);
      resolve();
      return;
    }
    requestFrame(next);
  };

  requestFrame(next);
});

export const revealAesirApp = ({
  documentRef = globalThis.document,
  mode = "video",
  now = () => globalThis.performance?.now?.() ?? Date.now(),
} = {}) => {
  if (!documentRef?.documentElement) return false;
  documentRef.documentElement.dataset.aesirBoot = mode;
  documentRef.documentElement.dataset.aesirReadyAt = now().toFixed(1);
  documentRef.documentElement.classList.add("aesir-app-ready");
  documentRef.documentElement.setAttribute("aria-busy", "false");
  documentRef.body?.setAttribute("aria-busy", "false");
  return true;
};
