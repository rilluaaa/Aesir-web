import assert from "node:assert/strict";
import test from "node:test";

import {
  createHeroBootReadiness,
  createHeroVideoResourceLoader,
  getHeroScrubDelay,
  getNextHeroScrubTime,
  getHeroBootRevealMode,
  getHeroWarmupTimes,
  isAbortError,
  isHeroBootReady,
  isHeroVideoReady,
  prepareHeroCriticalAssets,
  resolveHeroDownloadSource,
  revealAesirApp,
  waitForDecodedVideoFrame,
  warmHeroVideoFrames,
} from "../src/heroBoot.js";

const completeReadiness = () => createHeroBootReadiness({
  mounted: true,
  sourceResolved: true,
  sourceAttached: true,
  metadataReady: true,
  framesWarmed: true,
  neutralReady: true,
  fontsReady: true,
  criticalImagesReady: true,
  posterReady: true,
  layoutStable: true,
});

test("the final source must resolve before a download can begin", () => {
  assert.equal(resolveHeroDownloadSource({ sourceResolved: false, videoSource: "hero.mp4" }), null);
  assert.equal(resolveHeroDownloadSource({ sourceResolved: true, videoSource: "" }), null);
  assert.equal(resolveHeroDownloadSource({ sourceResolved: true, videoSource: "hero.mp4" }), "hero.mp4");
});

test("loadedData alone cannot reveal before critical poster readiness", () => {
  const loadedDataOnly = createHeroBootReadiness({
    mounted: true,
    sourceResolved: true,
    sourceAttached: true,
    metadataReady: true,
  });

  assert.equal(isHeroBootReady(loadedDataOnly), false);
  assert.equal(getHeroBootRevealMode({
    readiness: loadedDataOnly,
    timedOut: false,
    posterReady: true,
  }), "covered");
  assert.equal(isHeroBootReady(completeReadiness()), true);
  assert.equal(isHeroVideoReady(completeReadiness()), true);
});

test("decoded critical poster reveals the page while video preparation continues", () => {
  const posterReadiness = createHeroBootReadiness({
    mounted: true,
    fontsReady: true,
    criticalImagesReady: true,
    posterReady: true,
    layoutStable: true,
  });

  assert.equal(isHeroBootReady(posterReadiness), true);
  assert.equal(isHeroVideoReady(posterReadiness), false);
  assert.equal(getHeroBootRevealMode({
    readiness: posterReadiness,
    timedOut: false,
    posterReady: true,
  }), "poster");
});

test("resource loader keeps the selected native media URL attached", async () => {
  const loader = createHeroVideoResourceLoader();
  const obsolete = loader.load("/1080.mp4").catch((error) => error);
  const current = await loader.load("/1440.mp4");
  current.activate();

  assert.equal(isAbortError(await obsolete), true);
  assert.equal(current.mediaUrl, "/1440.mp4");
  assert.equal(loader.getActiveSourceUrl(), "/1440.mp4");

  const replacement = await loader.load("/replacement.mp4");
  replacement.activate();
  assert.equal(loader.getActiveSourceUrl(), "/replacement.mp4");

  loader.dispose();
  assert.equal(loader.getActiveSourceUrl(), null);
});

test("an unactivated native media URL can be released during effect cleanup", async () => {
  const loader = createHeroVideoResourceLoader();
  const resource = await loader.load("/hero.mp4");
  resource.release();
  loader.dispose();
  assert.equal(loader.getActiveSourceUrl(), null);
});

test("scrub desktops fully buffer exactly one selected source and revoke it on replacement", async () => {
  const fetches = [];
  const revoked = [];
  const videoBlob = { size: 5331520 };
  const loader = createHeroVideoResourceLoader({
    fetchImpl: async (url, options) => {
      fetches.push({ url, options });
      return { ok: true, status: 200, blob: async () => videoBlob };
    },
    createObjectURL: (blob) => {
      assert.equal(blob, videoBlob);
      return "blob:hero-1440";
    },
    revokeObjectURL: (url) => revoked.push(url),
  });

  const buffered = await loader.load("/hero-1440.mp4", { bufferFully: true });
  assert.equal(buffered.mediaUrl, "blob:hero-1440");
  assert.equal(buffered.fullyBuffered, true);
  assert.equal(buffered.byteLength, 5331520);
  assert.equal(fetches.length, 1);
  assert.equal(fetches[0].url, "/hero-1440.mp4");
  assert.equal(fetches[0].options.cache, "force-cache");
  assert.equal(fetches[0].options.priority, "high");
  buffered.activate();

  const replacement = await loader.load("/hero-1080.mp4");
  replacement.activate();
  assert.deepEqual(revoked, ["blob:hero-1440"]);
  assert.equal(loader.getActiveSourceUrl(), "/hero-1080.mp4");
  loader.dispose();
});

test("changing quality aborts an obsolete full-buffer request", async () => {
  let obsoleteSignal;
  const loader = createHeroVideoResourceLoader({
    fetchImpl: async (_url, options) => {
      obsoleteSignal = options.signal;
      return new Promise((_resolve, reject) => {
        options.signal.addEventListener("abort", () => {
          reject(new DOMException("Cancelled", "AbortError"));
        }, { once: true });
      });
    },
    createObjectURL: () => "blob:obsolete",
    revokeObjectURL: () => {},
  });

  const obsolete = loader.load("/hero-1440.mp4", { bufferFully: true }).catch((error) => error);
  await Promise.resolve();
  const current = await loader.load("/hero-1080.mp4");

  assert.equal(obsoleteSignal.aborted, true);
  assert.equal(isAbortError(await obsolete), true);
  current.activate();
  assert.equal(loader.getActiveSourceUrl(), "/hero-1080.mp4");
  loader.dispose();
});

test("a settled paused frame confirms readiness on paint frames without the long timeout", async () => {
  const callbacks = [];
  const video = {
    readyState: 2,
    seeking: false,
    requestVideoFrameCallback() {
      throw new Error("settled paused frames should not wait for playback callbacks");
    },
  };

  const ready = waitForDecodedVideoFrame(video, {
    requestFrame: (callback) => {
      callbacks.push(callback);
      return callbacks.length;
    },
    cancelFrame: () => {},
  });
  callbacks.shift()();
  callbacks.shift()();
  await ready;

  assert.equal(callbacks.length, 0);
});

test("critical first-view assets coordinate fonts, poster and wordmark decoding", async () => {
  const decoded = [];
  let fontsResolved = false;
  const result = await prepareHeroCriticalAssets({
    fontReady: Promise.resolve().then(() => { fontsResolved = true; }),
    posterUrl: "/poster.webp",
    criticalImageUrls: ["/wordmark.webp"],
    decodeImage: async ({ url }) => {
      decoded.push(url);
      return { url };
    },
  });

  assert.equal(fontsResolved, true);
  assert.deepEqual(decoded, ["/poster.webp", "/wordmark.webp"]);
  assert.deepEqual(result, {
    fontsReady: true,
    criticalImagesReady: true,
    posterReady: true,
  });
});

test("desktop warm-up decodes only left, right and finishes at neutral", async () => {
  const decoded = [];
  const times = await warmHeroVideoFrames({
    duration: 3.966667,
    scrubCapable: true,
    reducedMotion: false,
    seekFrame: async (time) => decoded.push(time),
  });

  assert.equal(times.length, 3);
  assert.deepEqual(decoded, times);
  assert.ok(Math.abs(times[0] - 0.116) < 0.001);
  assert.ok(Math.abs(times[1] - 3.832) < 0.001);
  assert.ok(Math.abs(times[2] - 1.975) < 0.001);
});

test("decoder-driven scrub step preserves easing and reacts to micro movements", () => {
  const regular = getNextHeroScrubTime({
    presentedTime: 1.975,
    desiredTime: 3.832,
    elapsedMs: 1000 / 60,
    duration: 3.966667,
  });
  const micro = getNextHeroScrubTime({
    presentedTime: 1.975,
    desiredTime: 1.985,
    elapsedMs: 1000 / 60,
    duration: 3.966667,
  });
  const lateFrame = getNextHeroScrubTime({
    presentedTime: 1.975,
    desiredTime: 3.832,
    elapsedMs: 80,
    duration: 3.966667,
  });

  assert.ok(regular > 1.975 && regular < 3.832);
  assert.equal(micro, 1.985);
  assert.ok(lateFrame > regular);
});

test("decoder-driven scrub cadence waits only for the remaining display interval", () => {
  assert.equal(getHeroScrubDelay({
    now: 100,
    lastSeekStartedAt: 0,
    intervalMs: 20,
  }), 0);
  assert.equal(getHeroScrubDelay({
    now: 112,
    lastSeekStartedAt: 100,
    intervalMs: 20,
  }), 8);
  assert.equal(getHeroScrubDelay({
    now: 125,
    lastSeekStartedAt: 100,
    intervalMs: 20,
  }), 0);
});

test("reduced motion warms only the neutral frame while mobile warms its start", () => {
  const reduced = getHeroWarmupTimes({
    duration: 3.966667,
    scrubCapable: true,
    reducedMotion: true,
  });
  const mobile = getHeroWarmupTimes({
    duration: 3.966667,
    scrubCapable: false,
    reducedMotion: false,
  });

  assert.equal(reduced.length, 1);
  assert.ok(Math.abs(reduced[0] - 1.975) < 0.001);
  assert.deepEqual(mobile, [0]);
});

test("the watchdog reveals only a decoded poster fallback", () => {
  const readiness = createHeroBootReadiness();
  assert.equal(getHeroBootRevealMode({ readiness, timedOut: true, posterReady: true }), "poster");
  assert.equal(getHeroBootRevealMode({ readiness, timedOut: true, posterReady: false }), "covered");
  assert.equal(getHeroBootRevealMode({ readiness: completeReadiness(), timedOut: false, posterReady: true }), "video");
});

test("reveal clears busy state and records the reveal mode and timestamp", () => {
  const classes = new Set();
  const html = {
    dataset: {},
    classList: { add: (...names) => names.forEach((name) => classes.add(name)) },
    setAttribute(name, value) { this[name] = value; },
  };
  const body = { setAttribute(name, value) { this[name] = value; } };

  assert.equal(revealAesirApp({ documentRef: { documentElement: html, body }, mode: "poster", now: () => 123.45 }), true);
  assert.equal(classes.has("aesir-app-ready"), true);
  assert.equal(html.dataset.aesirBoot, "poster");
  assert.equal(html.dataset.aesirReadyAt, "123.5");
  assert.equal(html["aria-busy"], "false");
  assert.equal(body["aria-busy"], "false");
});
