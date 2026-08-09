import assert from "node:assert/strict";
import test from "node:test";

import {
  HERO_GAZE_ANCHORS,
  HERO_HEAD_SAFE_GAP,
  HERO_HUMAN_FOCAL_POINT,
  HERO_SOURCE_QUALITY,
  HERO_VIDEO_SOURCES,
  calculateHeroObjectPositionY,
  getHeroPlaybackState,
  isConstrainedNetwork,
  isHeroScrubCapable,
  mapPointerToGazeTime,
  selectHeroSourceQuality,
  selectHeroVideoSource,
  supportsHighResolutionDecoding,
} from "../src/heroVideo.js";

const desktopEnvironment = {
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

test("interaction mode and source quality are independent", () => {
  const highQuality = selectHeroSourceQuality(desktopEnvironment);
  assert.equal(highQuality, HERO_SOURCE_QUALITY.high);
  assert.equal(
    selectHeroVideoSource({ quality: highQuality, scrubCapable: false }),
    HERO_VIDEO_SOURCES.desktop1440,
  );
  assert.equal(
    selectHeroVideoSource({ quality: HERO_SOURCE_QUALITY.standard, scrubCapable: false }),
    HERO_VIDEO_SOURCES.mobile,
  );
  assert.equal(
    selectHeroVideoSource({ quality: HERO_SOURCE_QUALITY.standard, scrubCapable: true }),
    HERO_VIDEO_SOURCES.desktop1080,
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
    selectHeroSourceQuality({ ...desktopEnvironment, constrainedNetwork: true }),
    HERO_SOURCE_QUALITY.standard,
  );
  assert.equal(
    selectHeroVideoSource({ quality: HERO_SOURCE_QUALITY.standard, scrubCapable: true }),
    HERO_VIDEO_SOURCES.desktop1080,
  );
});

test("Retina rendering selects 1440p without requiring privacy-limited hardware APIs", () => {
  assert.equal(selectHeroSourceQuality(desktopEnvironment), HERO_SOURCE_QUALITY.high);
  assert.equal(
    selectHeroSourceQuality({ ...desktopEnvironment, renderedWidth: 1440, renderedHeight: 900, devicePixelRatio: 1 }),
    HERO_SOURCE_QUALITY.standard,
  );
  assert.equal(
    selectHeroSourceQuality({ ...desktopEnvironment, hardwareConcurrency: undefined }),
    HERO_SOURCE_QUALITY.high,
  );
  assert.equal(
    selectHeroSourceQuality({ ...desktopEnvironment, deviceMemory: undefined }),
    HERO_SOURCE_QUALITY.high,
  );
  assert.equal(
    selectHeroSourceQuality({
      ...desktopEnvironment,
      hardwareConcurrency: undefined,
      deviceMemory: undefined,
      supports1440p: null,
    }),
    HERO_SOURCE_QUALITY.high,
  );
  assert.equal(
    selectHeroSourceQuality({ ...desktopEnvironment, supports1440p: false }),
    HERO_SOURCE_QUALITY.standard,
  );
  assert.equal(
    selectHeroSourceQuality({ ...desktopEnvironment, hardwareConcurrency: 4 }),
    HERO_SOURCE_QUALITY.standard,
  );
  assert.equal(
    selectHeroSourceQuality({ ...desktopEnvironment, deviceMemory: 2 }),
    HERO_SOURCE_QUALITY.standard,
  );
});

test("high-DPR touch tablets can receive 1440p while phones keep the mobile encode", () => {
  const tabletQuality = selectHeroSourceQuality({
    ...desktopEnvironment,
    renderedWidth: 1024,
    renderedHeight: 768,
    devicePixelRatio: 2,
  });
  assert.equal(tabletQuality, HERO_SOURCE_QUALITY.high);
  assert.equal(
    selectHeroVideoSource({ quality: tabletQuality, scrubCapable: false }),
    HERO_VIDEO_SOURCES.desktop1440,
  );

  const phoneQuality = selectHeroSourceQuality({
    ...desktopEnvironment,
    renderedWidth: 390,
    renderedHeight: 690,
    devicePixelRatio: 3,
  });
  assert.equal(phoneQuality, HERO_SOURCE_QUALITY.standard);
  assert.equal(
    selectHeroVideoSource({ quality: phoneQuality, scrubCapable: false }),
    HERO_VIDEO_SOURCES.mobile,
  );
});

test("media capability probing is conservative", async () => {
  assert.equal(await supportsHighResolutionDecoding(undefined), null);
  assert.equal(await supportsHighResolutionDecoding({}), null);
  assert.equal(await supportsHighResolutionDecoding({ decodingInfo: async () => ({ supported: true, smooth: true }) }), true);
  assert.equal(await supportsHighResolutionDecoding({ decodingInfo: async () => ({ supported: true, smooth: false }) }), false);
  assert.equal(await supportsHighResolutionDecoding({ decodingInfo: async () => ({ supported: false, smooth: false }) }), false);
  assert.equal(await supportsHighResolutionDecoding({ decodingInfo: async () => { throw new Error("unavailable"); } }), null);
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

test("hero focal framing protects the head across short desktop viewports", () => {
  const shortDesktop = calculateHeroObjectPositionY({
    containerWidth: 1356,
    containerHeight: 680,
    videoWidth: 1920,
    videoHeight: 1080,
  });
  const wideDesktop = calculateHeroObjectPositionY({
    containerWidth: 1910,
    containerHeight: 992,
    videoWidth: 1920,
    videoHeight: 1080,
  });
  const naturallyFitted = calculateHeroObjectPositionY({
    containerWidth: 1430,
    containerHeight: 812,
    videoWidth: 1920,
    videoHeight: 1080,
  });

  assert.ok(shortDesktop > 0.45 && shortDesktop < 0.5);
  assert.ok(wideDesktop > 0.75 && wideDesktop < 0.82);
  assert.equal(naturallyFitted, 0.5);

  const renderedHeight = 1080 * Math.max(1356 / 1920, 680 / 1080);
  const headTop = HERO_HUMAN_FOCAL_POINT.y * renderedHeight;
  const verticalCrop = (renderedHeight - 680) * shortDesktop;
  assert.ok(Math.abs((headTop - verticalCrop) - HERO_HEAD_SAFE_GAP) < 0.01);
});

test("hero focal framing safely handles missing dimensions", () => {
  assert.equal(calculateHeroObjectPositionY({}), 0.5);
  assert.equal(calculateHeroObjectPositionY({
    containerWidth: 390,
    containerHeight: 390,
    videoWidth: 0,
    videoHeight: 0,
  }), 0.5);
});
