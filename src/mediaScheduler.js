const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export const getPredictivePreloadDistance = ({
  velocity = 0,
  viewportHeight = 800,
}) => {
  const safeHeight = Math.max(1, Number(viewportHeight) || 800);
  const speed = Math.abs(Number(velocity) || 0);
  const normalDistance = clamp(safeHeight * 2.4, 1600, 2600);

  if (speed >= 2.4) return Math.max(normalDistance, clamp(safeHeight * 7, 4200, 6000));
  if (speed >= 0.9) return Math.max(normalDistance, clamp(safeHeight * 4, 2600, 3800));
  return normalDistance;
};

export const isMediaInPredictiveRange = ({
  top,
  bottom,
  viewportHeight,
  distance,
  direction,
}) => {
  const safeHeight = Math.max(1, Number(viewportHeight) || 1);
  const safeDistance = Math.max(0, Number(distance) || 0);
  if (direction < 0) return bottom >= -safeDistance && top <= safeHeight * 1.5;
  return top <= safeHeight + safeDistance && bottom >= -safeHeight * 0.5;
};

const getConnection = (navigatorRef) => navigatorRef?.connection
  || navigatorRef?.mozConnection
  || navigatorRef?.webkitConnection;

const isConstrainedConnection = (connection) => connection?.saveData === true
  || ["slow-2g", "2g", "3g"].includes(connection?.effectiveType);

const scheduleIdle = (windowRef, callback, timeout = 2200) => {
  if (typeof windowRef.requestIdleCallback === "function") {
    return { type: "idle", id: windowRef.requestIdleCallback(callback, { timeout }) };
  }
  return { type: "timeout", id: windowRef.setTimeout(() => callback({ timeRemaining: () => 0 }), 250) };
};

const cancelIdle = (windowRef, task) => {
  if (!task) return;
  if (task.type === "idle") windowRef.cancelIdleCallback?.(task.id);
  else windowRef.clearTimeout(task.id);
};

export const installPredictiveMediaScheduler = ({
  windowRef = globalThis.window,
  documentRef = globalThis.document,
  navigatorRef = globalThis.navigator,
} = {}) => {
  if (!windowRef || !documentRef) return () => {};

  const media = new Set();
  const connection = getConnection(navigatorRef);
  const normalMargin = getPredictivePreloadDistance({ viewportHeight: windowRef.innerHeight });
  let idleTask = null;
  let idleDelay = 0;
  let idleStarted = false;
  let heroReady = Boolean(documentRef.querySelector(".hero-video video[data-interactive-ready-at]"));
  let scrollFrame = 0;
  let lastScrollY = windowRef.scrollY;
  let lastScrollTime = windowRef.performance?.now?.() ?? Date.now();

  const forgetMedia = (element) => {
    media.delete(element);
    intersectionObserver?.unobserve(element);
  };

  const prepareMedia = (element, priority = "auto") => {
    if (!heroReady) return;
    if (!element || element.tagName !== "IMG") return;
    if (element.complete && element.naturalWidth > 0) {
      forgetMedia(element);
      return;
    }

    element.loading = "eager";
    if (priority === "high" || element.fetchPriority !== "high") {
      element.fetchPriority = priority;
    }
    element.dataset.mediaPrepared = priority;

    if (!element.dataset.mediaPreparedListener) {
      element.dataset.mediaPreparedListener = "true";
      element.addEventListener("load", () => forgetMedia(element), { once: true });
      element.addEventListener("error", () => forgetMedia(element), { once: true });
    }

    if (!element.getAttribute("src") && element.dataset.src) {
      element.src = element.dataset.src;
    }
  };

  const intersectionObserver = typeof windowRef.IntersectionObserver === "function"
    ? new windowRef.IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) prepareMedia(entry.target, "low");
      }
    }, { rootMargin: `${Math.round(normalMargin)}px 0px` })
    : null;

  const registerMedia = (element) => {
    if (!element || element.tagName !== "IMG" || media.has(element)) return;
    media.add(element);
    intersectionObserver?.observe(element);
  };

  const registerTree = (root) => {
    if (root?.matches?.("img[data-predictive-media]")) registerMedia(root);
    root?.querySelectorAll?.("img[data-predictive-media]").forEach(registerMedia);
  };

  const mutationObserver = typeof windowRef.MutationObserver === "function"
    ? new windowRef.MutationObserver((records) => {
      for (const record of records) record.addedNodes.forEach(registerTree);
    })
    : null;

  const evaluateScroll = () => {
    scrollFrame = 0;
    const now = windowRef.performance?.now?.() ?? Date.now();
    const scrollY = windowRef.scrollY;
    const elapsed = Math.max(16, now - lastScrollTime);
    const delta = scrollY - lastScrollY;
    const velocity = delta / elapsed;
    const direction = delta < 0 ? -1 : 1;
    const distance = getPredictivePreloadDistance({
      velocity,
      viewportHeight: windowRef.innerHeight,
    });
    const highPriority = Math.abs(velocity) >= 2.4;

    const candidates = [];
    for (const element of media) {
      if (!element.isConnected) {
        forgetMedia(element);
        continue;
      }
      const rect = element.getBoundingClientRect();
      if (isMediaInPredictiveRange({
        top: rect.top,
        bottom: rect.bottom,
        viewportHeight: windowRef.innerHeight,
        distance,
        direction,
      })) {
        const horizontallyVisible = rect.right > 0 && rect.left < windowRef.innerWidth;
        const verticallyVisible = rect.bottom > 0 && rect.top < windowRef.innerHeight;
        const forwardDistance = direction < 0
          ? Math.max(0, -rect.bottom)
          : Math.max(0, rect.top - windowRef.innerHeight);
        candidates.push({
          element,
          forwardDistance,
          visible: horizontallyVisible && verticallyVisible,
        });
      }
    }

    candidates.sort((a, b) => a.forwardDistance - b.forwardDistance);
    const upcomingLimit = highPriority ? 3 : candidates.length;
    candidates.forEach((candidate, index) => {
      if (candidate.visible) prepareMedia(candidate.element, "high");
      else if (index < upcomingLimit) prepareMedia(candidate.element, "auto");
    });

    lastScrollY = scrollY;
    lastScrollTime = now;
  };

  const onScroll = () => {
    if (!scrollFrame) scrollFrame = windowRef.requestAnimationFrame(evaluateScroll);
  };

  const warmNext = () => {
    idleTask = null;
    if (documentRef.hidden || isConstrainedConnection(connection)) return;
    const next = [...media].find((element) => (
      element.isConnected && (!element.complete || element.naturalWidth === 0)
    ));
    if (!next) return;

    prepareMedia(next, "low");
    const continueWarming = () => {
      idleTask = scheduleIdle(windowRef, warmNext);
    };
    next.addEventListener("load", continueWarming, { once: true });
    next.addEventListener("error", continueWarming, { once: true });
  };

  const startIdleWarm = () => {
    if (idleStarted || isConstrainedConnection(connection)) return;
    idleStarted = true;
    idleDelay = windowRef.setTimeout(() => {
      idleDelay = 0;
      idleTask = scheduleIdle(windowRef, warmNext, 3000);
    }, 3500);
  };

  const onHeroReady = () => {
    heroReady = true;
    evaluateScroll();
    startIdleWarm();
  };
  registerTree(documentRef);
  mutationObserver?.observe(documentRef.body, { childList: true, subtree: true });
  windowRef.addEventListener("scroll", onScroll, { passive: true });
  windowRef.addEventListener("aesir:hero-ready", onHeroReady, { once: true });
  if (heroReady) onHeroReady();

  return () => {
    windowRef.removeEventListener("scroll", onScroll);
    windowRef.removeEventListener("aesir:hero-ready", onHeroReady);
    windowRef.cancelAnimationFrame(scrollFrame);
    windowRef.clearTimeout(idleDelay);
    cancelIdle(windowRef, idleTask);
    intersectionObserver?.disconnect();
    mutationObserver?.disconnect();
    media.clear();
  };
};
