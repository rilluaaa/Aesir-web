export const CINEMATIC_FRAME_RATE = 24;
export const CINEMATIC_SCROLL_HEIGHT_VH = 400;
export const CINEMATIC_DAMPING_MS = 52;
export const CINEMATIC_HANDOFF_START = 0.92;
export const CINEMATIC_PREPARE_CONTENT_AT = 0.76;
export const CINEMATIC_HANDOFF_WASH = 0.18;

export const clampCinematicProgress = (value) => (
  Math.min(1, Math.max(0, Number(value) || 0))
);

export const getCinematicScrollProgress = ({
  scrollY,
  sectionTop,
  sectionHeight,
  viewportHeight,
}) => {
  const distance = Math.max(1, sectionHeight - viewportHeight);
  return clampCinematicProgress((scrollY - sectionTop) / distance);
};

export const dampCinematicProgress = ({
  current,
  target,
  deltaMs,
  timeConstantMs = CINEMATIC_DAMPING_MS,
}) => {
  const safeDelta = Math.max(0, Number(deltaMs) || 0);
  const alpha = 1 - Math.exp(-safeDelta / Math.max(1, timeConstantMs));
  return clampCinematicProgress(
    clampCinematicProgress(current)
      + ((clampCinematicProgress(target) - clampCinematicProgress(current)) * alpha),
  );
};

export const getCinematicFrame = (
  progress,
  duration,
  frameRate = CINEMATIC_FRAME_RATE,
) => {
  if (!Number.isFinite(duration) || duration <= 0) return { index: 0, time: 0 };
  const safeFrameRate = Math.max(1, frameRate);
  const finalFrameIndex = Math.max(0, Math.floor(duration * safeFrameRate) - 1);
  const index = Math.round(clampCinematicProgress(progress) * finalFrameIndex);
  return { index, time: index / safeFrameRate };
};

export const selectCinematicSource = ({
  viewportWidth,
  desktopSource,
  mobileSource,
}) => Number(viewportWidth) > 900 ? desktopSource : mobileSource;

export const getCinematicFocalY = (progress) => {
  const value = clampCinematicProgress(progress);
  if (value < 0.16) return 0.31;
  if (value < 0.38) return 0.48;
  if (value < 0.6) return 0.58;
  if (value < 0.84) return 0.64;
  return 0.5;
};

export const getCoverSourceRect = ({
  sourceWidth,
  sourceHeight,
  destinationWidth,
  destinationHeight,
  focalY = 0.5,
}) => {
  if (
    ![sourceWidth, sourceHeight, destinationWidth, destinationHeight]
      .every((value) => Number.isFinite(value) && value > 0)
  ) {
    return { x: 0, y: 0, width: 1, height: 1 };
  }

  const sourceAspect = sourceWidth / sourceHeight;
  const destinationAspect = destinationWidth / destinationHeight;
  if (sourceAspect > destinationAspect) {
    const width = sourceHeight * destinationAspect;
    return {
      x: (sourceWidth - width) / 2,
      y: 0,
      width,
      height: sourceHeight,
    };
  }

  const height = sourceWidth / destinationAspect;
  const maxY = sourceHeight - height;
  return {
    x: 0,
    y: Math.min(maxY, Math.max(0, (sourceHeight * clampCinematicProgress(focalY)) - (height / 2))),
    width: sourceWidth,
    height,
  };
};

export const getCinematicHandoffOpacity = (progress) => {
  const local = clampCinematicProgress(
    (clampCinematicProgress(progress) - CINEMATIC_HANDOFF_START)
      / (1 - CINEMATIC_HANDOFF_START),
  );
  return (local * local * (3 - (2 * local))) * CINEMATIC_HANDOFF_WASH;
};

export const shouldPrepareExistingContent = (progress) => (
  clampCinematicProgress(progress) >= CINEMATIC_PREPARE_CONTENT_AT
);
