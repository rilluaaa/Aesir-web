import React, { useEffect, useRef } from 'react';

const vertexShader = `
  uniform float uTime;
  uniform float uSize;
  uniform float uDrift;
  uniform float uDepth;
  uniform float uTwinkle;
  uniform vec3 uCursor;
  uniform float uRepelRadius;
  uniform float uRepelStrength;
  uniform float uActivity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  attribute float aScale;
  attribute float aPhase;
  attribute float aPalette;
  attribute float aBright;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec3 pos = position;
    pos.z = mod(pos.z + uDrift + (uDepth * 0.5), uDepth) - (uDepth * 0.5);

    float tw = sin(uTime * 1.6 + aPhase * 6.2831);
    vTwinkle = (1.0 - uTwinkle) + uTwinkle * (0.62 + 0.38 * tw);

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec3 toParticle = modelPosition.xyz - uCursor;
    float dist = length(toParticle);
    float falloff = smoothstep(uRepelRadius, 0.0, dist);
    modelPosition.xyz += normalize(toParticle + vec3(0.0001)) * falloff * uRepelStrength * uActivity;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize * aScale * (1.0 / max(0.4, -viewPosition.z));

    vec3 base = aPalette < 0.5 ? uColorA : (aPalette < 1.5 ? uColorB : uColorC);
    vColor = base * aBright;
  }
`;

const fragmentShader = `
  uniform float uOpacity;
  uniform float uBrightness;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float strength = pow(1.0 - d * 2.0, 3.2);
    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(color * uBrightness, strength * uOpacity * vTwinkle);
  }
`;

export default function Background({ active = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    let disposed = false;
    let cleanup = () => {};

    const init = async () => {
      const THREE = await import('three');
      if (disposed || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const count = isMobile ? 1000 : 3000;
      const depth = 30;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
      renderer.setClearColor(0x070719, 1);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x070719, 2, 18);

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 80);
      camera.position.set(0, 0, 5);

      const positions = new Float32Array(count * 3);
      const scales = new Float32Array(count);
      const phases = new Float32Array(count);
      const palettes = new Float32Array(count);
      const brightness = new Float32Array(count);

      for (let index = 0; index < count; index += 1) {
        const index3 = index * 3;
        positions[index3] = (Math.random() - 0.5) * 24;
        positions[index3 + 1] = (Math.random() - 0.5) * 16;
        positions[index3 + 2] = (Math.random() - 0.5) * depth;
        palettes[index] = Math.floor(Math.random() * 3);
        brightness[index] = 0.7 + Math.random() * 0.6;
        scales[index] = 0.45 + Math.pow(Math.random(), 1.4) * 2.15;
        phases[index] = Math.random();
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
      geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
      geometry.setAttribute('aPalette', new THREE.BufferAttribute(palettes, 1));
      geometry.setAttribute('aBright', new THREE.BufferAttribute(brightness, 1));

      const uniforms = {
        uTime: { value: 0 },
        uSize: { value: isMobile ? 27 : 38 },
        uOpacity: { value: 0 },
        uDrift: { value: 0 },
        uDepth: { value: depth },
        uTwinkle: { value: reduceMotion ? 0.25 : 0.9 },
        uCursor: { value: new THREE.Vector3() },
        uRepelRadius: { value: 4.2 },
        uRepelStrength: { value: 0.28 },
        uActivity: { value: 0 },
        uColorA: { value: new THREE.Color('#aef6cf') },
        uColorB: { value: new THREE.Color('#5fe6a0') },
        uColorC: { value: new THREE.Color('#eafff2') },
        uBrightness: { value: 1.35 },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      const group = new THREE.Group();
      group.add(points);
      scene.add(group);

      const pointer = new THREE.Vector2();
      const pointerSmooth = new THREE.Vector2();
      const pointerWorld = new THREE.Vector3();
      const pointerTarget = new THREE.Vector3();
      const rayPoint = new THREE.Vector3();
      const rayDirection = new THREE.Vector3();
      let pointerActive = false;
      let pointerActivity = 0;
      let lastPointerMove = 0;
      let scrollTarget = 0;
      let scrollSmooth = 0;
      let animationFrame = 0;
      let lastFrame = performance.now();
      let appearStart = performance.now();

      const updateSize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, width < 768 ? 1 : 1.5);
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(1, height);
        camera.updateProjectionMatrix();
      };

      const updateScroll = () => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        scrollTarget = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      };

      const handlePointerMove = (event) => {
        pointer.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
        );
        pointerActive = true;
        lastPointerMove = performance.now();
      };

      const handlePointerLeave = () => {
        pointerActive = false;
      };

      const updatePointer = (now) => {
        pointerSmooth.lerp(pointer, 0.055);
        rayPoint.set(pointerSmooth.x, pointerSmooth.y, 0.5).unproject(camera);
        rayDirection.copy(rayPoint).sub(camera.position).normalize();

        if (Math.abs(rayDirection.z) > 0.0001) {
          const distance = -camera.position.z / rayDirection.z;
          if (distance > 0 && Number.isFinite(distance)) {
            pointerTarget.copy(camera.position).add(rayDirection.multiplyScalar(distance));
          }
        }

        pointerWorld.lerp(pointerTarget, 0.1);
        const shouldReact = pointerActive && now - lastPointerMove < 3000 ? 1 : 0;
        pointerActivity += (shouldReact - pointerActivity) * 0.06;
        uniforms.uCursor.value.copy(pointerWorld);
        uniforms.uActivity.value = pointerActivity;
      };

      const renderFrame = (now) => {
        animationFrame = window.requestAnimationFrame(renderFrame);
        if (document.hidden) return;

        const minimumFrameTime = window.innerWidth < 768 ? 1000 / 30 : 1000 / 50;
        if (now - lastFrame < minimumFrameTime) return;

        const delta = Math.min(0.05, (now - lastFrame) / 1000);
        lastFrame = now;
        scrollSmooth += (scrollTarget - scrollSmooth) * 0.06;
        updatePointer(now);

        uniforms.uTime.value = now / 1000;
        uniforms.uDrift.value += delta * (0.72 + scrollSmooth * 1.6);
        uniforms.uOpacity.value = Math.min(1.25, Math.max(0, (now - appearStart - 250) / 1400) * 1.25);

        camera.position.set(
          pointerSmooth.x * 0.32,
          pointerSmooth.y * 0.24,
          5 - scrollSmooth * 2.2,
        );
        camera.lookAt(pointerSmooth.x * 0.28, pointerSmooth.y * 0.2, -10);
        group.rotation.z += delta * (0.009 + scrollSmooth * 0.022);
        renderer.render(scene, camera);
      };

      const renderStatic = () => {
        uniforms.uOpacity.value = 0.8;
        renderer.render(scene, camera);
      };

      const handleResize = () => {
        updateSize();
        if (reduceMotion) renderStatic();
      };

      handleResize();
      updateScroll();
      window.addEventListener('resize', handleResize);

      if (reduceMotion) {
        renderStatic();
      } else {
        window.addEventListener('scroll', updateScroll, { passive: true });
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', handlePointerLeave);
        appearStart = performance.now();
        animationFrame = window.requestAnimationFrame(renderFrame);
      }

      cleanup = () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', updateScroll);
        window.removeEventListener('pointermove', handlePointerMove);
        document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    };

    init().catch(() => {});

    return () => {
      disposed = true;
      cleanup();
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full opacity-75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(174,233,255,0.12),transparent_30rem),radial-gradient(circle_at_88%_4%,rgba(199,155,255,0.11),transparent_28rem),linear-gradient(180deg,rgba(5,5,5,0.05),rgba(5,5,5,0.5))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/25" />
      <div className="absolute left-6 top-0 h-full w-px bg-white/[0.07] md:left-10" />
      <div className="absolute right-6 top-0 h-full w-px bg-white/[0.07] md:right-10" />
    </div>
  );
}
