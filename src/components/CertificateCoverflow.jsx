import React, { useCallback, useEffect, useRef, useState } from 'react';

const PERSPECTIVE = 1600;
const SCALE_STEP = 0.16;
const MAX_VISIBLE = 2;
const DEPTH = 240;

const assetPath = (path) => /^https?:\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const cssTransition = (transition) => {
  const duration = typeof transition?.duration === 'number' ? transition.duration : 0.6;
  const easeValue = transition?.ease;
  let ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

  if (Array.isArray(easeValue) && easeValue.length === 4) {
    ease = `cubic-bezier(${easeValue[0]}, ${easeValue[1]}, ${easeValue[2]}, ${easeValue[3]})`;
  } else if (typeof easeValue === 'string') {
    const easingMap = {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    };
    ease = easingMap[easeValue] || 'ease';
  }

  return { duration, ease };
};

export const CertificateCoverflow = ({
  certificates,
  activeIndex,
  onChange,
  cardWidth = 520,
  cardHeight = 690,
  radius = 0,
  tilt = 11,
  sideTilt = 5,
  gap = 8,
  opacity = 58,
  transition = { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
}) => {
  const count = certificates.length;
  const lockRef = useRef(false);
  const { duration, ease } = cssTransition(transition);
  const transitionCss = `transform ${duration}s ${ease}, opacity ${duration}s ${ease}`;
  const effectiveRadius = (Math.max(0, Math.min(20, radius)) / 20) * (Math.min(cardWidth, cardHeight) / 2);
  const dim = 1 - Math.max(0, Math.min(100, opacity)) / 100;

  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(() => {
      lockRef.current = false;
    }, Math.max(50, duration * 1000));
  }, [duration]);

  const step = useCallback((direction) => {
    if (lockRef.current || count < 2) return;
    lock();
    onChange((((activeIndex + direction) % count) + count) % count);
  }, [activeIndex, count, lock, onChange]);

  const handleCardClick = useCallback((index) => {
    if (lockRef.current) return;
    lock();
    onChange(index === activeIndex ? (activeIndex + 1) % count : index);
  }, [activeIndex, count, lock, onChange]);

  const onKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    }
  }, [step]);

  useEffect(() => {
    if (activeIndex > count - 1) {
      onChange(Math.max(0, count - 1));
    }
  }, [activeIndex, count, onChange]);

  return (
    <div
      className="relative flex min-h-[520px] w-full min-w-[320px] items-center justify-center overflow-hidden outline-none md:min-h-[760px]"
      style={{ perspective: `${PERSPECTIVE}px` }}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="AESIR certificate coverflow"
      onKeyDown={onKeyDown}
    >
      <div
        className="relative"
        style={{
          width: cardWidth,
          height: cardHeight,
          maxWidth: '72vw',
          maxHeight: '78vh',
          transformStyle: 'preserve-3d'
        }}
      >
        {certificates.map((certificate, index) => {
          let relative = index - activeIndex;
          if (relative > count / 2) relative -= count;
          if (relative < -count / 2) relative += count;

          const distance = Math.abs(relative);
          const isVisible = distance <= MAX_VISIBLE;
          const isActive = relative === 0;
          const scale = Math.max(0.4, 1 - distance * SCALE_STEP);
          const translateX = relative * (gap * 30);
          const translateZ = -distance * DEPTH;
          const rotateY = -relative * tilt;
          const rotateZ = relative * sideTilt;

          return (
            <button
              key={certificate.number}
              type="button"
              onClick={() => handleCardClick(index)}
              className="absolute left-1/2 top-1/2 block overflow-hidden border border-white/15 bg-white p-2 shadow-[0_34px_90px_rgba(0,0,0,0.48)] outline-none transition hover:border-cyan-200 focus:border-cyan-200"
              style={{
                width: cardWidth,
                height: cardHeight,
                maxWidth: '72vw',
                maxHeight: '78vh',
                borderRadius: effectiveRadius,
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                transition: transitionCss,
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'auto' : 'none',
                cursor: isActive ? 'default' : 'pointer'
              }}
              aria-label={`Show certificate page ${certificate.number}`}
              aria-hidden={!isVisible}
            >
              <img
                src={assetPath(certificate.image)}
                alt={`AESIR achievement certificate page ${certificate.number}`}
                draggable={false}
                className="h-full w-full select-none object-contain"
              />
              <span
                className="pointer-events-none absolute inset-0 bg-black transition"
                style={{
                  opacity: isActive ? 0 : dim,
                  transition: `opacity ${duration}s ${ease}`
                }}
              />
              <span className="pointer-events-none absolute left-3 top-3 bg-black px-2 py-1 text-[10px] font-black text-white/70">
                {certificate.number}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CertificateCoverflow;
