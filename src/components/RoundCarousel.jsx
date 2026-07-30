import React, { useEffect, useRef } from 'react';

export default function RoundCarousel({
  images = [],
  imageWidth = 300,
  imageHeight = 300,
  spacing = 3,
  speed = 7,
  direction = 'right',
  drag = true,
  sensitivity = 5,
  tilt = -7,
  perspective = 3000,
  cornerRadius = 22,
  innerDim = 3.5,
  background = 'transparent',
  style = {}
}) {
  const items = images.length > 0 ? images : [];
  const count = Math.max(items.length, 1);
  const ringRef = useRef(null);
  const rafRef = useRef(0);
  const rotYRef = useRef(0);
  const velRef = useRef(0);
  const lastRef = useRef(0);
  const dragRef = useRef({ active: false, x: 0 });

  const angle = 360 / count;
  const factor = 1 + spacing * 0.15;
  const radius = (imageWidth * factor) / (2 * Math.tan(Math.PI / count));
  const degPerSec = speed * 6 * (direction === 'left' ? -1 : 1);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return undefined;

    const apply = () => {
      ring.style.transform = `translateZ(${-radius}px) rotateY(${rotYRef.current}deg)`;
    };

    const draw = (now) => {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
      lastRef.current = now;
      const frameTime = Math.min(dt, 0.1);

      if (!dragRef.current.active) {
        if (Math.abs(velRef.current) > 0.01) {
          rotYRef.current += velRef.current * frameTime;
          velRef.current *= 0.94;
        } else {
          rotYRef.current += degPerSec * frameTime;
        }
      }

      apply();
      rafRef.current = requestAnimationFrame(draw);
    };

    apply();
    rafRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rafRef.current);
  }, [radius, degPerSec]);

  const onPointerDown = (event) => {
    if (!drag) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { active: true, x: event.clientX };
    velRef.current = 0;
  };

  const onPointerMove = (event) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.x;
    dragRef.current.x = event.clientX;
    const movement = dx * 0.3 * sensitivity;
    rotYRef.current += movement;
    velRef.current = movement * 60;
  };

  const onPointerUp = (event) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    dragRef.current.active = false;
  };

  const faceBase = {
    position: 'absolute',
    inset: 0,
    borderRadius: cornerRadius,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div
      style={{
        ...style,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background,
        perspective: `${perspective}px`,
        cursor: drag ? 'grab' : 'default',
        touchAction: 'none'
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div style={{ transformStyle: 'preserve-3d', transform: `rotateX(${tilt}deg)` }}>
        <div
          ref={ringRef}
          style={{
            position: 'relative',
            width: imageWidth,
            height: imageHeight,
            transformStyle: 'preserve-3d'
          }}
        >
          {items.map((image, index) => (
            <div
              key={image.src}
              style={{
                position: 'absolute',
                inset: 0,
                transform: `rotateY(${index * angle}deg) translateZ(${radius}px)`,
                transformStyle: 'preserve-3d'
              }}
            >
              <div
                aria-label={image.alt || 'Founder photograph'}
                role="img"
                style={{
                  ...faceBase,
                  backgroundImage: `url(${image.src})`,
                  boxShadow: '0 24px 70px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.18)'
                }}
              />
              <div
                style={{
                  ...faceBase,
                  transform: 'rotateY(180deg)',
                  backgroundImage: `url(${image.src})`,
                  filter: `brightness(${innerDim / 10})`,
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
