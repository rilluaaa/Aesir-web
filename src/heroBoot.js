import { mapPointerToGazeTime } from "./heroVideo.js";

export const HERO_BOOT_WATCHDOG_MS = 12000;

export const HERO_BOOT_REQUIREMENTS = Object.freeze([
  "mounted",
  "sourceResolved",
  "fileFetched",
  "blobAttached",
  "metadataReady",
  "framesWarmed",
  "neutralReady",
  "fontsReady",
  "criticalImagesReady",
  "posterReady",
  "layoutStable",
]);

export const createHeroBootReadiness = (overrides = {}) => ({
  mounted: false,
  sourceResolved: false,
  fileFetched: false,
  blobAttached: false,
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
  if (isHeroBootReady(readiness)) return "video";
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
    neutral,
    mapPointerToGazeTime(0, duration),
    mapPointerToGazeTime(1, duration),
    neutral,
  ];
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

export const fetchHeroBlob = async ({
  sourceUrl,
  signal,
  fetchImpl = globalThis.fetch,
}) => {
  if (!sourceUrl || typeof fetchImpl !== "function") {
    throw new Error("A final hero source and fetch implementation are required.");
  }

  const response = await fetchImpl(sourceUrl, {
    cache: "force-cache",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Unable to download the selected hero video (${response.status}).`);
  }

  throwIfAborted(signal);
  const blob = await response.blob();
  throwIfAborted(signal);
  return blob;
};

export const createHeroVideoResourceLoader = ({
  fetchImpl = globalThis.fetch,
  createObjectURL = (blob) => URL.createObjectURL(blob),
  revokeObjectURL = (url) => URL.revokeObjectURL(url),
} = {}) => {
  let requestVersion = 0;
  let pendingController = null;
  let activeObjectUrl = null;
  let disposed = false;

  const cancelPending = () => {
    requestVersion += 1;
    pendingController?.abort();
    pendingController = null;
  };

  const load = async (sourceUrl) => {
    if (disposed) throw new Error("The hero resource loader has been disposed.");

    cancelPending();
    const version = requestVersion;
    const controller = new AbortController();
    pendingController = controller;

    try {
      const blob = await fetchHeroBlob({
        sourceUrl,
        signal: controller.signal,
        fetchImpl,
      });
      if (disposed || version !== requestVersion) throw createAbortError();

      const objectUrl = createObjectURL(blob);
      let activated = false;
      let released = false;

      return {
        objectUrl,
        sourceUrl,
        activate() {
          if (released || disposed || version !== requestVersion) throw createAbortError();
          if (activeObjectUrl && activeObjectUrl !== objectUrl) revokeObjectURL(activeObjectUrl);
          activeObjectUrl = objectUrl;
          activated = true;
        },
        release() {
          if (released || activated) return;
          released = true;
          revokeObjectURL(objectUrl);
        },
      };
    } finally {
      if (pendingController === controller) pendingController = null;
    }
  };

  return {
    load,
    cancelPending,
    getActiveObjectUrl: () => activeObjectUrl,
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelPending();
      if (activeObjectUrl) revokeObjectURL(activeObjectUrl);
      activeObjectUrl = null;
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

export const waitForDecodedVideoFrame = (video, { signal, timeoutMs = 900 } = {}) => (
  new Promise((resolve, reject) => {
    throwIfAborted(signal);
    let frameCallbackId = null;
    let timeoutId = 0;

    const cleanup = () => {
      if (frameCallbackId !== null && typeof video.cancelVideoFrameCallback === "function") {
        video.cancelVideoFrameCallback(frameCallbackId);
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
  objectUrl,
  scrubCapable,
  reducedMotion,
  signal,
}) => {
  throwIfAborted(signal);
  video.pause();
  video.src = objectUrl;
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
