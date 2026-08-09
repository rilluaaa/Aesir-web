export const HERO_VIDEO_SOURCES = Object.freeze({
  mobile: "assets/aesir/cognitive-hero-mobile-60fps.mp4",
  desktop1080: "assets/aesir/cognitive-hero-1080p-60fps-all-i.mp4",
  desktop1440: "assets/aesir/cognitive-hero-1440p-60fps-all-i.mp4",
});

const VERIFIED_HERO_DURATION = 3.966667;

export const HERO_GAZE_ANCHORS = Object.freeze({
  left: 0.116 / VERIFIED_HERO_DURATION,
  neutral: 1.975 / VERIFIED_HERO_DURATION,
  right: 3.832 / VERIFIED_HERO_DURATION,
});

const HIGH_RESOLUTION_DECODING_CONFIG = Object.freeze({
  type: "file",
  video: {
    contentType: 'video/mp4; codecs="avc1.640033"',
    width: 2560,
    height: 1440,
    bitrate: 8180700,
    framerate: 60,
  },
});

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

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

export const selectHeroVideoSource = ({
  scrubCapable,
  constrainedNetwork,
  renderedWidth,
  renderedHeight,
  devicePixelRatio,
  hardwareConcurrency,
  deviceMemory,
  supports1440p,
}) => {
  if (!scrubCapable) return HERO_VIDEO_SOURCES.mobile;
  if (constrainedNetwork) return HERO_VIDEO_SOURCES.desktop1080;

  const pixelRatio = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0
    ? devicePixelRatio
    : 1;
  const physicalWidth = Math.max(0, Number(renderedWidth) || 0) * pixelRatio;
  const physicalHeight = Math.max(0, Number(renderedHeight) || 0) * pixelRatio;
  const needsMoreThan1080p = physicalWidth > 1920 || physicalHeight > 1080;
  const knownHighCapacity = Number.isFinite(hardwareConcurrency)
    && Number.isFinite(deviceMemory)
    && hardwareConcurrency >= 8
    && deviceMemory >= 8;

  return needsMoreThan1080p && knownHighCapacity && supports1440p === true
    ? HERO_VIDEO_SOURCES.desktop1440
    : HERO_VIDEO_SOURCES.desktop1080;
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
  if (typeof mediaCapabilities?.decodingInfo !== "function") return false;

  try {
    const result = await mediaCapabilities.decodingInfo(HIGH_RESOLUTION_DECODING_CONFIG);
    return result?.supported === true && result?.smooth === true;
  } catch {
    return false;
  }
};
