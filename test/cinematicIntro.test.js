import assert from "node:assert/strict";
import test from "node:test";

import {
  dampCinematicProgress,
  getCinematicFocalY,
  getCinematicFrame,
  getCinematicHandoffOpacity,
  getCinematicScrollProgress,
  getCoverSourceRect,
  selectCinematicSource,
  shouldPrepareExistingContent,
} from "../src/cinematicIntro.js";

test("sticky scroll distance maps to a clamped cinematic progress", () => {
  const input = { sectionTop: 100, sectionHeight: 4000, viewportHeight: 1000 };
  assert.equal(getCinematicScrollProgress({ ...input, scrollY: 100 }), 0);
  assert.equal(getCinematicScrollProgress({ ...input, scrollY: 1600 }), 0.5);
  assert.equal(getCinematicScrollProgress({ ...input, scrollY: 4000 }), 1);
});

test("time-aware damping moves smoothly in both directions", () => {
  const forward = dampCinematicProgress({ current: 0, target: 1, deltaMs: 16 });
  const reverse = dampCinematicProgress({ current: 1, target: 0, deltaMs: 16 });
  assert.ok(forward > 0 && forward < 0.3);
  assert.ok(reverse < 1 && reverse > 0.7);
});

test("cinematic targets are quantized to native 24fps frames", () => {
  assert.deepEqual(getCinematicFrame(0, 12.041667), { index: 0, time: 0 });
  const middle = getCinematicFrame(0.5, 12.041667);
  assert.equal(middle.index, 144);
  assert.equal(middle.time, 6);
  assert.equal(getCinematicFrame(1, 12.041667).index, 288);
});

test("only one responsive cinematic source is selected", () => {
  const sources = { desktopSource: "desktop.mp4", mobileSource: "mobile.mp4" };
  assert.equal(selectCinematicSource({ viewportWidth: 1440, ...sources }), "desktop.mp4");
  assert.equal(selectCinematicSource({ viewportWidth: 901, ...sources }), "desktop.mp4");
  assert.equal(selectCinematicSource({ viewportWidth: 900, ...sources }), "mobile.mp4");
  assert.equal(selectCinematicSource({ viewportWidth: 390, ...sources }), "mobile.mp4");
});

test("portrait media cover crop preserves aspect ratio and follows the focal point", () => {
  const top = getCoverSourceRect({
    sourceWidth: 1080,
    sourceHeight: 1920,
    destinationWidth: 1920,
    destinationHeight: 1080,
    focalY: 0.31,
  });
  const bottom = getCoverSourceRect({
    sourceWidth: 1080,
    sourceHeight: 1920,
    destinationWidth: 1920,
    destinationHeight: 1080,
    focalY: 0.64,
  });
  assert.equal(top.width / top.height, 16 / 9);
  assert.ok(bottom.y > top.y);
  assert.ok(bottom.y + bottom.height <= 1920);
});

test("scene focal points change only at authored cinematic beats", () => {
  assert.equal(getCinematicFocalY(0.1), 0.31);
  assert.equal(getCinematicFocalY(0.2), 0.48);
  assert.equal(getCinematicFocalY(0.5), 0.58);
  assert.equal(getCinematicFocalY(0.7), 0.64);
  assert.equal(getCinematicFocalY(0.9), 0.5);
});

test("handoff stays clear until the final beat and keeps the final frame visible", () => {
  assert.equal(getCinematicHandoffOpacity(0.91), 0);
  assert.ok(getCinematicHandoffOpacity(0.96) > 0);
  assert.equal(getCinematicHandoffOpacity(1), 0.18);
});

test("existing hero preparation starts only near the handoff", () => {
  assert.equal(shouldPrepareExistingContent(0.75), false);
  assert.equal(shouldPrepareExistingContent(0.76), true);
});
