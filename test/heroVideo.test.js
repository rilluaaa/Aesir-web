import assert from "node:assert/strict";
import test from "node:test";

import {
  HERO_GAZE_ANCHORS,
  HERO_VIDEO_SOURCES,
  getHeroPlaybackState,
  isConstrainedNetwork,
  isHeroScrubCapable,
  mapPointerToGazeTime,
  selectHeroVideoSource,
  supportsHighResolutionDecoding,
} from "../src/heroVideo.js";

const desktopEnvironment = {
  scrubCapable: true,
  constrainedNetwork: false,
  renderedWidth: 1440,
  renderedHeight: 900,
  devicePixelRatio: 2,
  hardwareConcurrency: 10,
  deviceMemory: 16,
  supports1440p: true,
};

test("scrub capability requires width, hover and a fine pointer", () => {
  assert.equal(isHeroScrubCapable({ viewportWidth: 1024, anyHover: true, anyFinePointer: true }), true);
  assert.equal(isHeroScrubCapable({ viewportWidth: 1366, anyHover: false, anyFinePointer: false }), false);
  assert.equal(isHeroScrubCapable({ viewportWidth: 1366, anyHover: true, anyFinePointer: false }), false);
  assert.equal(isHeroScrubCapable({ viewportWidth: 1023, anyHover: true, anyFinePointer: true }), false);
});

test("touch-first devices always receive the autoplay-capable mobile source", () => {
  assert.equal(
    selectHeroVideoSource({ ...desktopEnvironment, scrubCapable: false }),
    HERO_VIDEO_SOURCES.mobile,
  );
  assert.deepEqual(
    getHeroPlaybackState({ scrubCapable: false, reducedMotion: false }),
    { autoplay: true, loop: true },
  );
  assert.deepEqual(
    getHeroPlaybackState({ scrubCapable: false, reducedMotion: true }),
    { autoplay: false, loop: false },
  );
  assert.deepEqual(
    getHeroPlaybackState({ scrubCapable: true, reducedMotion: false }),
    { autoplay: false, loop: false },
  );
});

test("saveData and constrained connections keep scrub desktops on 1080p", () => {
  assert.equal(isConstrainedNetwork({ saveData: true, effectiveType: "4g" }), true);
  assert.equal(isConstrainedNetwork({ saveData: false, effectiveType: "3g" }), true);
  assert.equal(isConstrainedNetwork({ saveData: false, effectiveType: "4g" }), false);
  assert.equal(
    selectHeroVideoSource({ ...desktopEnvironment, constrainedNetwork: true }),
    HERO_VIDEO_SOURCES.desktop1080,
  );
});

test("1440p requires physical pixels, known hardware and confirmed decoding support", () => {
  assert.equal(selectHeroVideoSource(desktopEnvironment), HERO_VIDEO_SOURCES.desktop1440);
  assert.equal(
    selectHeroVideoSource({ ...desktopEnvironment, renderedWidth: 1440, renderedHeight: 900, devicePixelRatio: 1 }),
    HERO_VIDEO_SOURCES.desktop1080,
  );
  assert.equal(
    selectHeroVideoSource({ ...desktopEnvironment, hardwareConcurrency: undefined }),
    HERO_VIDEO_SOURCES.desktop1080,
  );
  assert.equal(
    selectHeroVideoSource({ ...desktopEnvironment, deviceMemory: undefined }),
    HERO_VIDEO_SOURCES.desktop1080,
  );
  assert.equal(
    selectHeroVideoSource({ ...desktopEnvironment, supports1440p: false }),
    HERO_VIDEO_SOURCES.desktop1080,
  );
});

test("media capability probing is conservative", async () => {
  assert.equal(await supportsHighResolutionDecoding(undefined), false);
  assert.equal(await supportsHighResolutionDecoding({}), false);
  assert.equal(await supportsHighResolutionDecoding({ decodingInfo: async () => ({ supported: true, smooth: true }) }), true);
  assert.equal(await supportsHighResolutionDecoding({ decodingInfo: async () => ({ supported: true, smooth: false }) }), false);
  assert.equal(await supportsHighResolutionDecoding({ decodingInfo: async () => { throw new Error("unsupported"); } }), false);
});

test("gaze mapping uses distinct left, neutral and right anchors", () => {
  const duration = 3.966667;
  assert.ok(Math.abs(mapPointerToGazeTime(0, duration) - 0.116) < 0.001);
  assert.ok(Math.abs(mapPointerToGazeTime(0.5, duration) - 1.975) < 0.001);
  assert.ok(Math.abs(mapPointerToGazeTime(1, duration) - 3.832) < 0.001);
  assert.ok(Math.abs(mapPointerToGazeTime(0.25, duration) - ((0.116 + 1.975) / 2)) < 0.001);
  assert.ok(Math.abs(mapPointerToGazeTime(0.75, duration) - ((1.975 + 3.832) / 2)) < 0.001);
});

test("gaze mapping clamps progress and scales normalized anchors after re-encoding", () => {
  const duration = 8;
  assert.equal(mapPointerToGazeTime(-1, duration), HERO_GAZE_ANCHORS.left * duration);
  assert.equal(mapPointerToGazeTime(2, duration), HERO_GAZE_ANCHORS.right * duration);
  assert.equal(mapPointerToGazeTime(0.5, duration), HERO_GAZE_ANCHORS.neutral * duration);
  assert.equal(mapPointerToGazeTime(0.5, Number.NaN), 0);
});
