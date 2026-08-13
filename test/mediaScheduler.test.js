import assert from "node:assert/strict";
import test from "node:test";

import {
  getPredictivePreloadDistance,
  installPredictiveMediaScheduler,
  isMediaInPredictiveRange,
} from "../src/mediaScheduler.js";

const createImage = ({ top = 900, bottom = 1200 } = {}) => {
  const listeners = new Map();
  return {
    tagName: "IMG",
    dataset: { src: "/image.webp" },
    complete: false,
    naturalWidth: 0,
    isConnected: true,
    loading: "lazy",
    fetchPriority: "auto",
    src: "",
    getBoundingClientRect: () => ({ top, bottom, left: 0, right: 600 }),
    getAttribute(name) {
      return name === "src" ? this.src : null;
    },
    addEventListener(type, callback) {
      listeners.set(type, callback);
    },
  };
};

const installWithImages = ({ images, connection } = {}) => {
  const listeners = new Map();
  const windowRef = {
    innerHeight: 844,
    innerWidth: 1280,
    scrollY: 0,
    performance: { now: () => 100 },
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => {},
    setTimeout: () => 1,
    clearTimeout: () => {},
    addEventListener(type, callback) {
      listeners.set(type, callback);
    },
    removeEventListener(type) {
      listeners.delete(type);
    },
  };
  const documentRef = {
    body: {},
    hidden: false,
    querySelector: () => null,
    querySelectorAll: () => images,
  };
  const cleanup = installPredictiveMediaScheduler({
    windowRef,
    documentRef,
    navigatorRef: { connection },
  });
  return { cleanup, listeners };
};

test("predictive preload distance expands with scroll velocity and then contracts", () => {
  const slow = getPredictivePreloadDistance({ velocity: 0.2, viewportHeight: 844 });
  const fast = getPredictivePreloadDistance({ velocity: 1.4, viewportHeight: 844 });
  const veryFast = getPredictivePreloadDistance({ velocity: 3.2, viewportHeight: 844 });
  const slowAgain = getPredictivePreloadDistance({ velocity: 0.1, viewportHeight: 844 });

  assert.equal(slow, slowAgain);
  assert.ok(fast > slow);
  assert.ok(veryFast > fast);
  assert.ok(veryFast <= 6000);
});

test("predictive range follows the current scroll direction", () => {
  const viewportHeight = 844;
  const distance = 3600;

  assert.equal(isMediaInPredictiveRange({
    top: 3800,
    bottom: 4100,
    viewportHeight,
    distance,
    direction: 1,
  }), true);
  assert.equal(isMediaInPredictiveRange({
    top: 5000,
    bottom: 5300,
    viewportHeight,
    distance,
    direction: 1,
  }), false);
  assert.equal(isMediaInPredictiveRange({
    top: -3300,
    bottom: -3000,
    viewportHeight,
    distance,
    direction: -1,
  }), true);
});

test("nearby content images prepare immediately without hero readiness", () => {
  const image = createImage({ top: 980, bottom: 1280 });
  const { cleanup } = installWithImages({ images: [image] });

  assert.equal(image.src, "/image.webp");
  assert.equal(image.loading, "eager");
  assert.equal(image.dataset.mediaPrepared, "auto");
  cleanup();
});

test("visible images still prepare on constrained connections", () => {
  const image = createImage({ top: 100, bottom: 500 });
  const { cleanup } = installWithImages({
    images: [image],
    connection: { saveData: true, effectiveType: "2g" },
  });

  assert.equal(image.src, "/image.webp");
  assert.equal(image.fetchPriority, "high");
  cleanup();
});

test("deep archive images remain deferred during initial evaluation", () => {
  const image = createImage({ top: 5200, bottom: 5500 });
  const { cleanup } = installWithImages({ images: [image] });

  assert.equal(image.src, "");
  assert.equal(image.loading, "lazy");
  cleanup();
});
