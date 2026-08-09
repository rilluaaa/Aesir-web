import assert from "node:assert/strict";
import test from "node:test";

import {
  createHeroBootReadiness,
  createHeroVideoResourceLoader,
  fetchHeroBlob,
  getHeroBootRevealMode,
  getHeroWarmupTimes,
  isAbortError,
  isHeroBootReady,
  prepareHeroCriticalAssets,
  resolveHeroDownloadSource,
  revealAesirApp,
  warmHeroVideoFrames,
} from "../src/heroBoot.js";

const completeReadiness = () => createHeroBootReadiness({
  mounted: true,
  sourceResolved: true,
  fileFetched: true,
  blobAttached: true,
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

test("loadedData-equivalent readiness cannot reveal before full fetch and warm-up", () => {
  const loadedDataOnly = createHeroBootReadiness({
    mounted: true,
    sourceResolved: true,
    blobAttached: true,
    metadataReady: true,
  });

  assert.equal(isHeroBootReady(loadedDataOnly), false);
  assert.equal(getHeroBootRevealMode({
    readiness: loadedDataOnly,
    timedOut: false,
    posterReady: true,
  }), "covered");
  assert.equal(isHeroBootReady(completeReadiness()), true);
});

test("full hero fetch uses the HTTP cache and returns the complete Blob", async () => {
  const expectedBlob = new Blob(["complete-video"]);
  let received;
  const actualBlob = await fetchHeroBlob({
    sourceUrl: "/hero.mp4",
    signal: new AbortController().signal,
    fetchImpl: async (url, options) => {
      received = { url, options };
      return { ok: true, blob: async () => expectedBlob };
    },
  });

  assert.equal(actualBlob, expectedBlob);
  assert.equal(received.url, "/hero.mp4");
  assert.equal(received.options.cache, "force-cache");
  assert.ok(received.options.signal instanceof AbortSignal);
});

test("resource loader cancels an obsolete source and revokes stale Blob URLs", async () => {
  const pending = new Map();
  const revoked = [];
  let objectIndex = 0;
  const loader = createHeroVideoResourceLoader({
    fetchImpl: (url, { signal }) => new Promise((resolve, reject) => {
      const onAbort = () => {
        const error = new Error("cancelled");
        error.name = "AbortError";
        reject(error);
      };
      signal.addEventListener("abort", onAbort, { once: true });
      pending.set(url, () => resolve({ ok: true, blob: async () => new Blob([url]) }));
    }),
    createObjectURL: () => `blob:hero-${++objectIndex}`,
    revokeObjectURL: (url) => revoked.push(url),
  });

  const obsolete = loader.load("/1080.mp4").catch((error) => error);
  const currentPromise = loader.load("/1440.mp4");
  pending.get("/1440.mp4")();
  const current = await currentPromise;
  current.activate();

  assert.equal(isAbortError(await obsolete), true);
  assert.equal(loader.getActiveObjectUrl(), "blob:hero-1");

  const replacementPromise = loader.load("/replacement.mp4");
  pending.get("/replacement.mp4")();
  const replacement = await replacementPromise;
  replacement.activate();
  assert.deepEqual(revoked, ["blob:hero-1"]);

  loader.dispose();
  assert.deepEqual(revoked, ["blob:hero-1", "blob:hero-2"]);
});

test("an unactivated Blob URL is released during effect cleanup", async () => {
  const revoked = [];
  const loader = createHeroVideoResourceLoader({
    fetchImpl: async () => ({ ok: true, blob: async () => new Blob(["video"]) }),
    createObjectURL: () => "blob:unused",
    revokeObjectURL: (url) => revoked.push(url),
  });
  const resource = await loader.load("/hero.mp4");
  resource.release();
  loader.dispose();
  assert.deepEqual(revoked, ["blob:unused"]);
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

test("desktop warm-up decodes neutral, left, right and neutral in sequence", async () => {
  const decoded = [];
  const times = await warmHeroVideoFrames({
    duration: 3.966667,
    scrubCapable: true,
    reducedMotion: false,
    seekFrame: async (time) => decoded.push(time),
  });

  assert.equal(times.length, 4);
  assert.deepEqual(decoded, times);
  assert.ok(Math.abs(times[0] - 1.975) < 0.001);
  assert.ok(Math.abs(times[1] - 0.116) < 0.001);
  assert.ok(Math.abs(times[2] - 3.832) < 0.001);
  assert.ok(Math.abs(times[3] - 1.975) < 0.001);
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
