import assert from "node:assert/strict";
import test from "node:test";

import {
  getPredictivePreloadDistance,
  isMediaInPredictiveRange,
} from "../src/mediaScheduler.js";

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
