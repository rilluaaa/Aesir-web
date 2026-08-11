import assert from "node:assert/strict";
import test from "node:test";

import {
  createHeroBootReadiness,
  createHeroVideoResourceLoader,
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

test("desktop warm-up covers both smoothing corridors and finishes at neutral", async () => {
  const decoded = [];
  const times = await warmHeroVideoFrames({
    duration: 3.966667,
    scrubCapable: true,
    reducedMotion: false,
    seekFrame: async (time) => decoded.push(time),
  });

  assert.equal(times.length, 5);
  assert.deepEqual(decoded, times);
  assert.ok(Math.abs(times[0] - 0.116) < 0.001);
  assert.ok(times[1] > times[0] && times[1] < 1.975);
  assert.ok(times[2] > 1.975 && times[2] < 3.832);
  assert.ok(Math.abs(times[3] - 3.832) < 0.001);
  assert.ok(Math.abs(times[4] - 1.975) < 0.001);
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
