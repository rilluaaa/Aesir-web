export const HERO_VIDEO_SOURCES = Object.freeze({
  mobile: "assets/aesir/cognitive-hero-mobile-1080p-60fps.mp4",
  desktop1080: "assets/aesir/cognitive-hero-1080p-60fps-gop3.mp4",
  desktop1440: "assets/aesir/cognitive-hero-1440p-60fps-gop3.mp4",
});

export const HERO_SOURCE_QUALITY = Object.freeze({
  standard: "standard",
  high: "high",
});

const VERIFIED_HERO_DURATION = 3.966667;

export const HERO_GAZE_ANCHORS = Object.freeze({
  left: 0.116 / VERIFIED_HERO_DURATION,
  neutral: 1.975 / VERIFIED_HERO_DURATION,
  right: 3.832 / VERIFIED_HERO_DURATION,
});

export const HERO_HUMAN_FOCAL_POINT = Object.freeze({
  x: 1,
  // Normalized top-of-head anchor measured from the neutral source frame.
  y: 0.083,
});

export const HERO_HEAD_SAFE_GAP = 24;

const HIGH_RESOLUTION_DECODING_CONFIG = Object.freeze({
  type: "file",
  video: {
    contentType: 'video/mp4; codecs="avc1.640033"',
    width: 2560,
    height: 1440,
    bitrate: 8600000,
    framerate: 60,
  },
});

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export const calculateHeroObjectPositionY = ({
  containerWidth,
  containerHeight,
  videoWidth,
  videoHeight,
  focalPointY = HERO_HUMAN_FOCAL_POINT.y,
  safeGap = HERO_HEAD_SAFE_GAP,
}) => {
  const dimensions = [containerWidth, containerHeight, videoWidth, videoHeight];
  if (!dimensions.every((value) => Number.isFinite(value) && value > 0)) return 0.5;

  const coverScale = Math.max(containerWidth / videoWidth, containerHeight / videoHeight);
  const renderedHeight = videoHeight * coverScale;
  const verticalOverflow = Math.max(0, renderedHeight - containerHeight);
  if (verticalOverflow <= 0.5) return 0.5;

  const renderedFocalY = clamp(focalPointY, 0, 1) * renderedHeight;
  const protectedCrop = Math.max(0, renderedFocalY - Math.max(0, safeGap));
  return clamp(Math.min(verticalOverflow, protectedCrop) / verticalOverflow, 0, 1);
};

export const isHeroScrubCapable = ({
  viewportWidth,
  anyHover,
  anyFinePointer,
}) => Number.isFinite(viewportWidth)
  && viewportWidth >= 1024
  && anyHover === true
  && anyFinePointer === true;

export const isConstrainedNetwork = ({ saveData, effectiveType }) => saveData === true
  || ["slow-2g", "2g", "3g"].includes(effectiveType);

export const getHeroPlaybackState = ({ scrubCapable, reducedMotion }) => {
  const autoplay = !scrubCapable && !reducedMotion;
  return { autoplay, loop: autoplay };
};

export const selectHeroSourceQuality = ({
  constrainedNetwork,
  renderedWidth,
  renderedHeight,
  devicePixelRatio,
  hardwareConcurrency,
  deviceMemory,
  supports1440p,
}) => {
  if (constrainedNetwork) return HERO_SOURCE_QUALITY.standard;

  const pixelRatio = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0
    ? devicePixelRatio
    : 1;
  const physicalWidth = Math.max(0, Number(renderedWidth) || 0) * pixelRatio;
  const physicalHeight = Math.max(0, Number(renderedHeight) || 0) * pixelRatio;
  const isPhoneSized = Number(renderedWidth) > 0 && Number(renderedWidth) < 768;
  const needsMoreThan1080p = !isPhoneSized
    && (physicalWidth > 1920 || physicalHeight > 1080);
  const explicitlyLowCapacity = (
    Number.isFinite(hardwareConcurrency) && hardwareConcurrency < 6
  ) || (
    Number.isFinite(deviceMemory) && deviceMemory < 4
  );

  if (!needsMoreThan1080p || explicitlyLowCapacity || supports1440p === false) {
    return HERO_SOURCE_QUALITY.standard;
  }

  return HERO_SOURCE_QUALITY.high;
};

export const selectHeroVideoSource = ({ quality, scrubCapable }) => {
  if (quality === HERO_SOURCE_QUALITY.high) return HERO_VIDEO_SOURCES.desktop1440;
  return scrubCapable ? HERO_VIDEO_SOURCES.desktop1080 : HERO_VIDEO_SOURCES.mobile;
};

export const mapPointerToGazeTime = (
  pointerProgress,
  duration,
  anchors = HERO_GAZE_ANCHORS,
) => {
  if (!Number.isFinite(duration) || duration <= 0) return 0;

  const progress = clamp(Number(pointerProgress) || 0, 0, 1);
  const left = clamp(anchors.left * duration, 0, duration);
  const neutral = clamp(anchors.neutral * duration, left, duration);
  const right = clamp(anchors.right * duration, neutral, duration);
  const segmentProgress = progress <= 0.5
    ? progress / 0.5
    : (progress - 0.5) / 0.5;
  const start = progress <= 0.5 ? left : neutral;
  const end = progress <= 0.5 ? neutral : right;

  return clamp(start + (end - start) * segmentProgress, 0, duration);
};

export const supportsHighResolutionDecoding = async (mediaCapabilities) => {
  if (typeof mediaCapabilities?.decodingInfo !== "function") return null;

  try {
    const result = await mediaCapabilities.decodingInfo(HIGH_RESOLUTION_DECODING_CONFIG);
    if (result?.supported === false || result?.smooth === false) return false;
    if (result?.supported === true && result?.smooth === true) return true;
    return null;
  } catch {
    return null;
  }
};
