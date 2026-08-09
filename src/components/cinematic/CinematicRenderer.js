const TAU = Math.PI * 2;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const mix = (a, b, amount) => a + (b - a) * amount;
const smoothstep = (start, end, value) => {
  const x = clamp((value - start) / (end - start));
  return x * x * (3 - 2 * x);
};
const windowed = (progress, start, peak, end) => (
  smoothstep(start, peak, progress) * (1 - smoothstep(peak, end, progress))
);

const rgba = (r, g, b, alpha = 1) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

const seededRandom = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const hexToRgb = (hex) => {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const colorMix = (a, b, amount, alpha = 1) => {
  const first = hexToRgb(a);
  const second = hexToRgb(b);
  return rgba(
    Math.round(mix(first[0], second[0], amount)),
    Math.round(mix(first[1], second[1], amount)),
    Math.round(mix(first[2], second[2], amount)),
    alpha,
  );
};

function drawCover(context, image, width, height) {
  const scale = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

export class CinematicRenderer {
  constructor(canvas, { particleCount = 620, pixelRatio = 1.4, frameCache = null } = {}) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d", { alpha: false, desynchronized: true });
    this.pixelRatio = pixelRatio;
    this.frameCache = frameCache;
    this.width = 0;
    this.height = 0;
    this.random = seededRandom(5185);
    this.particles = Array.from({ length: particleCount }, (_, index) => ({
      angle: this.random() * TAU,
      radius: Math.sqrt(this.random()),
      depth: this.random(),
      phase: this.random() * TAU,
      speed: 0.45 + this.random() * 1.55,
      size: 0.35 + this.random() * 1.8,
      warm: this.random() > 0.86,
      index,
    }));
    this.city = Array.from({ length: 82 }, (_, index) => ({
      x: this.random() * 2 - 1,
      z: this.random(),
      height: 0.18 + Math.pow(this.random(), 2.1) * 0.82,
      width: 0.018 + this.random() * 0.03,
      phase: this.random() * TAU,
      index,
    })).sort((a, b) => b.z - a.z);
  }

  resize(width, height) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    const ratio = Math.min(this.pixelRatio, window.devicePixelRatio || 1);
    const renderWidth = Math.round(this.width * ratio);
    const renderHeight = Math.round(this.height * ratio);
    if (this.canvas.width !== renderWidth || this.canvas.height !== renderHeight) {
      this.canvas.width = renderWidth;
      this.canvas.height = renderHeight;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }

  render(progress) {
    const frame = this.frameCache?.get(progress * (this.frameCache.frameCount - 1));
    if (frame) {
      drawCover(this.context, frame, this.width, this.height);
      return;
    }

    const context = this.context;
    const width = this.width;
    const height = this.height;
    if (!context || !width || !height) return;

    context.clearRect(0, 0, width, height);
    this.drawAtmosphere(context, progress, width, height);
    this.drawSpatialFlow(context, progress, width, height);
    this.drawHuman(context, progress, width, height);
    this.drawEvidence(context, progress, width, height);
    this.drawIntelligence(context, progress, width, height);
    this.drawSociety(context, progress, width, height);
    this.drawHome(context, progress, width, height);
    this.drawVignette(context, progress, width, height);
  }

  drawAtmosphere(context, progress, width, height) {
    const light = smoothstep(0.1, 0.52, progress);
    const background = context.createLinearGradient(0, 0, 0, height);
    background.addColorStop(0, colorMix("#020b17", "#f7fbff", light));
    background.addColorStop(0.5, colorMix("#071729", "#dbe7f3", light));
    background.addColorStop(1, colorMix("#0b1e33", "#ffffff", light));
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    const horizonY = mix(height * 0.7, height * 0.43, smoothstep(0.12, 0.72, progress));
    const haze = context.createRadialGradient(width * 0.55, horizonY, 0, width * 0.55, horizonY, width * 0.7);
    haze.addColorStop(0, rgba(216, 235, 255, 0.22 + light * 0.35));
    haze.addColorStop(0.48, rgba(91, 135, 184, 0.08 + light * 0.12));
    haze.addColorStop(1, rgba(4, 13, 26, 0));
    context.fillStyle = haze;
    context.fillRect(0, 0, width, height);
  }

  drawSpatialFlow(context, progress, width, height) {
    const dark = 1 - smoothstep(0.64, 0.95, progress);
    const flight = smoothstep(0.02, 0.9, progress);
    context.save();
    context.globalCompositeOperation = "screen";

    for (let line = 0; line < 24; line += 1) {
      const offset = (line - 11.5) / 11.5;
      context.beginPath();
      for (let step = 0; step <= 54; step += 1) {
        const t = step / 54;
        const y = mix(-height * 0.08, height * 1.06, t);
        const centre = width * (0.57 + Math.sin(t * 7 + flight * 5.4) * (0.045 + 0.025 * (1 - t)));
        const spread = mix(width * 0.34, width * 0.025, Math.pow(t, 0.72));
        const x = centre + offset * spread + Math.sin(t * 18 + line) * width * 0.006;
        if (!step) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.strokeStyle = rgba(150, 203, 255, (0.025 + (line % 5 === 0 ? 0.06 : 0.016)) * dark);
      context.lineWidth = line % 5 === 0 ? 0.9 : 0.45;
      context.stroke();
    }

    const riverAlpha = 0.44 + smoothstep(0.62, 0.96, progress) * 0.36;
    const ribbon = context.createLinearGradient(0, 0, 0, height);
    ribbon.addColorStop(0, rgba(209, 231, 255, 0));
    ribbon.addColorStop(0.34, rgba(187, 219, 255, riverAlpha * 0.48));
    ribbon.addColorStop(0.7, rgba(255, 255, 255, riverAlpha));
    ribbon.addColorStop(1, rgba(208, 225, 255, 0));
    context.beginPath();
    for (let step = 0; step <= 90; step += 1) {
      const t = step / 90;
      const x = width * (0.54 + Math.sin(t * 6.5 + progress * 3.2) * (0.04 + t * 0.025));
      const y = t * height;
      if (!step) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.strokeStyle = ribbon;
    context.shadowColor = rgba(186, 219, 255, 0.85);
    context.shadowBlur = 18;
    context.lineWidth = mix(1.5, 4.5, smoothstep(0.45, 1, progress));
    context.stroke();
    context.restore();
  }

  drawHuman(context, progress, width, height) {
    const alpha = 1 - smoothstep(0.14, 0.31, progress);
    if (alpha < 0.001) return;
    const enter = smoothstep(0, 0.22, progress);
    const centreX = width * mix(0.63, 0.5, enter);
    const centreY = height * 0.4;
    const radiusX = width * mix(0.24, 0.5, enter);
    const radiusY = height * mix(0.36, 0.68, enter);

    context.save();
    context.globalCompositeOperation = "screen";
    context.globalAlpha = alpha;

    for (let line = 0; line < 34; line += 1) {
      const y = centreY - radiusY + (line / 33) * radiusY * 2;
      context.beginPath();
      for (let step = 0; step <= 45; step += 1) {
        const t = step / 45;
        const x = centreX - radiusX + t * radiusX * 2;
        const oval = Math.sqrt(Math.max(0, 1 - Math.pow((y - centreY) / radiusY, 2)));
        const warp = Math.sin(t * 9 + line * 0.42 + progress * 8) * height * 0.007;
        const profilePull = t > 0.5 ? (t - 0.5) * oval * width * 0.11 : 0;
        const py = y + warp - profilePull * 0.08;
        if (!step) context.moveTo(x, py);
        else context.lineTo(x + profilePull, py);
      }
      context.strokeStyle = rgba(118, 181, 238, line % 6 === 0 ? 0.28 : 0.11);
      context.lineWidth = line % 6 === 0 ? 0.8 : 0.42;
      context.stroke();
    }

    this.particles.forEach((particle) => {
      const orbit = particle.radius * (0.68 + particle.depth * 0.32);
      const x = centreX + Math.cos(particle.angle + progress * particle.speed) * radiusX * orbit;
      const y = centreY + Math.sin(particle.angle * 1.16 + particle.phase) * radiusY * orbit * 0.76;
      const profileBias = x > centreX ? (x - centreX) * 0.12 : 0;
      const size = particle.size * (0.6 + particle.depth * 1.6) * (1 + enter * 1.5);
      context.beginPath();
      context.arc(x + profileBias, y, size, 0, TAU);
      context.fillStyle = particle.warm
        ? rgba(255, 194, 178, 0.72)
        : rgba(190, 222, 255, 0.55 + particle.depth * 0.25);
      context.fill();
    });

    context.beginPath();
    context.moveTo(centreX + radiusX * 0.05, centreY - radiusY * 0.95);
    context.bezierCurveTo(
      centreX + radiusX * 0.82,
      centreY - radiusY * 0.76,
      centreX + radiusX * 0.63,
      centreY - radiusY * 0.18,
      centreX + radiusX * 0.98,
      centreY - radiusY * 0.04,
    );
    context.bezierCurveTo(
      centreX + radiusX * 0.7,
      centreY + radiusY * 0.08,
      centreX + radiusX * 0.84,
      centreY + radiusY * 0.38,
      centreX + radiusX * 0.32,
      centreY + radiusY * 0.5,
    );
    context.bezierCurveTo(
      centreX + radiusX * 0.06,
      centreY + radiusY * 0.65,
      centreX + radiusX * 0.28,
      centreY + radiusY * 0.9,
      centreX + radiusX * 0.18,
      centreY + radiusY * 1.08,
    );
    context.strokeStyle = rgba(224, 239, 255, 0.7);
    context.lineWidth = 1.2;
    context.shadowColor = rgba(151, 204, 255, 0.8);
    context.shadowBlur = 11;
    context.stroke();
    context.restore();
  }

  drawEvidence(context, progress, width, height) {
    const alpha = windowed(progress, 0.13, 0.33, 0.59);
    if (alpha < 0.001) return;
    const local = smoothstep(0.15, 0.52, progress);
    const horizon = mix(height * 0.72, height * 0.39, local);
    context.save();
    context.globalAlpha = alpha;

    for (let row = 0; row < 30; row += 1) {
      const z = row / 29;
      const y = horizon + Math.pow(z, 1.8) * (height - horizon) * 1.1;
      context.beginPath();
      for (let column = 0; column <= 70; column += 1) {
        const xRatio = column / 70;
        const x = xRatio * width;
        const wave = Math.sin(xRatio * 12 + z * 8 + progress * 3) * (7 + z * 25)
          + Math.cos(xRatio * 26 - z * 4) * (2 + z * 8);
        if (!column) context.moveTo(x, y - wave);
        else context.lineTo(x, y - wave);
      }
      context.strokeStyle = rgba(52, 94, 137, 0.09 + z * 0.18);
      context.lineWidth = z > 0.82 ? 0.9 : 0.55;
      context.stroke();
    }

    for (let column = 0; column < 23; column += 1) {
      const x = (column / 22) * width;
      context.beginPath();
      context.moveTo(width * 0.54 + (x - width * 0.54) * 0.08, horizon);
      context.lineTo(x, height * 1.04);
      context.strokeStyle = rgba(56, 103, 150, 0.1);
      context.stroke();
    }

    this.particles.slice(0, Math.floor(this.particles.length * 0.62)).forEach((particle) => {
      const depth = (particle.depth + local * particle.speed * 0.17) % 1;
      const spread = Math.pow(depth, 1.65);
      const x = width * 0.54 + Math.sin(particle.phase + particle.angle * 2) * width * spread * 0.62;
      const y = horizon + spread * (height - horizon) + Math.sin(particle.angle * 5) * 18 * spread;
      const size = 0.45 + spread * 2.4;
      context.fillStyle = particle.warm
        ? rgba(222, 120, 102, 0.54)
        : rgba(56, 99, 145, 0.34 + spread * 0.4);
      context.fillRect(x, y, size, size);
    });

    const measurements = [
      [0.18, 0.38, "OBSERVATION"],
      [0.32, 0.62, "DATA POINT"],
      [0.48, 0.3, "RELATIONSHIP"],
      [0.58, 0.74, "FIELD NOTE"],
      [0.58, 0.46, "EVALUATION"],
      [0.64, 0.67, "PATTERN"],
    ];
    context.font = `${Math.max(8, Math.min(11, width * 0.007))}px "DM Sans", sans-serif`;
    context.textBaseline = "bottom";
    measurements.forEach(([xRatio, depth, label], index) => {
      const spread = Math.pow(depth, 1.58);
      const x = width * 0.54 + (xRatio - 0.5) * width * spread * 1.22;
      const groundY = horizon + spread * (height - horizon) + Math.sin(index * 1.7) * 12;
      const stem = 16 + depth * 34;
      context.beginPath();
      context.moveTo(x, groundY);
      context.lineTo(x, groundY - stem);
      context.strokeStyle = rgba(34, 76, 119, 0.34);
      context.lineWidth = 0.7;
      context.stroke();
      context.fillStyle = rgba(245, 249, 255, 0.88);
      context.fillRect(x - 3, groundY - stem - 3, 6, 6);
      context.strokeStyle = rgba(28, 67, 108, 0.62);
      context.strokeRect(x - 3, groundY - stem - 3, 6, 6);
      context.fillStyle = rgba(27, 58, 91, 0.7);
      context.fillText(label, x + 8, groundY - stem + 2);
    });
    context.restore();
  }

  drawIntelligence(context, progress, width, height) {
    const alpha = windowed(progress, 0.37, 0.56, 0.77);
    if (alpha < 0.001) return;
    const local = smoothstep(0.4, 0.7, progress);
    const centreX = width * 0.56;
    const centreY = height * mix(0.62, 0.48, local);
    const planeWidth = Math.min(width * 0.44, height * 0.78) * mix(0.75, 1.1, local);
    const planeDepth = planeWidth * 0.3;
    const gap = height * 0.13;
    const colors = [[154, 203, 255], [174, 151, 239], [170, 205, 229]];

    context.save();
    context.globalAlpha = alpha;
    context.globalCompositeOperation = "screen";
    for (let layer = 0; layer < 3; layer += 1) {
      const cy = centreY + (layer - 1) * gap;
      context.beginPath();
      context.moveTo(centreX, cy - planeDepth);
      context.lineTo(centreX + planeWidth * 0.52, cy);
      context.lineTo(centreX, cy + planeDepth);
      context.lineTo(centreX - planeWidth * 0.52, cy);
      context.closePath();
      const [r, g, b] = colors[layer];
      context.fillStyle = rgba(r, g, b, 0.05 + (1 - layer * 0.12) * 0.04);
      context.strokeStyle = rgba(r, g, b, 0.62);
      context.lineWidth = 0.9;
      context.fill();
      context.stroke();

      for (let line = 1; line < 9; line += 1) {
        const t = line / 9;
        context.beginPath();
        context.moveTo(mix(centreX, centreX - planeWidth * 0.52, t), mix(cy - planeDepth, cy, t));
        context.lineTo(mix(centreX + planeWidth * 0.52, centreX, t), mix(cy, cy + planeDepth, t));
        context.strokeStyle = rgba(r, g, b, 0.18);
        context.stroke();
      }

      for (let node = 0; node < 26; node += 1) {
        const seed = this.particles[(node * 17 + layer * 31) % this.particles.length];
        const nx = (seed.depth * 2 - 1) * planeWidth * 0.38;
        const ny = (seed.radius * 2 - 1) * planeDepth * (1 - Math.abs(nx) / planeWidth);
        context.beginPath();
        context.arc(centreX + nx, cy + ny, seed.size * 0.65, 0, TAU);
        context.fillStyle = rgba(r, g, b, 0.82);
        context.fill();
      }
    }
    context.beginPath();
    context.moveTo(centreX, centreY - gap * 2.5);
    context.lineTo(centreX, centreY + gap * 2.5);
    context.strokeStyle = rgba(255, 255, 255, 0.78);
    context.shadowColor = rgba(176, 206, 255, 1);
    context.shadowBlur = 20;
    context.lineWidth = 1.4;
    context.stroke();
    context.restore();
  }

  drawSociety(context, progress, width, height) {
    const alpha = windowed(progress, 0.61, 0.8, 0.965);
    if (alpha < 0.001) return;
    const local = smoothstep(0.64, 0.92, progress);
    const horizon = height * mix(0.72, 0.52, local);
    const centreX = width * 0.56;
    context.save();
    context.globalAlpha = alpha;

    const civicGround = context.createRadialGradient(
      centreX,
      horizon + height * 0.24,
      0,
      centreX,
      horizon + height * 0.24,
      width * 0.58,
    );
    civicGround.addColorStop(0, rgba(245, 250, 255, 0.82));
    civicGround.addColorStop(0.64, rgba(202, 218, 234, 0.32));
    civicGround.addColorStop(1, rgba(164, 188, 211, 0));
    context.fillStyle = civicGround;
    context.fillRect(0, horizon - height * 0.05, width, height - horizon + height * 0.05);

    for (let road = -7; road <= 7; road += 1) {
      const endX = centreX + road * width * 0.085;
      context.beginPath();
      context.moveTo(centreX + road * 2, horizon);
      context.quadraticCurveTo(
        centreX + road * width * 0.025 + Math.sin(road) * 18,
        horizon + height * 0.24,
        endX,
        height * 1.03,
      );
      context.strokeStyle = rgba(91, 133, 174, road % 3 === 0 ? 0.24 : 0.12);
      context.lineWidth = road % 3 === 0 ? 1.4 : 0.7;
      context.stroke();
    }

    for (let band = 1; band <= 8; band += 1) {
      const depth = band / 8;
      const y = horizon + Math.pow(depth, 1.7) * height * 0.46;
      context.beginPath();
      context.moveTo(centreX - width * depth * 0.53, y);
      context.quadraticCurveTo(centreX, y - 10 * depth, centreX + width * depth * 0.53, y);
      context.strokeStyle = rgba(82, 126, 169, 0.1 + depth * 0.08);
      context.lineWidth = band === 5 ? 1.2 : 0.65;
      context.stroke();
    }

    this.city.forEach((building) => {
      const depth = clamp(building.z + local * 0.28);
      const scale = 0.28 + Math.pow(depth, 1.55) * 1.18;
      const x = centreX + building.x * width * 0.48 * scale;
      const groundY = horizon + Math.pow(depth, 1.7) * height * 0.42;
      const buildingHeight = height * building.height * 0.24 * scale;
      const buildingWidth = width * building.width * scale;
      const gradient = context.createLinearGradient(x, groundY - buildingHeight, x + buildingWidth, groundY);
      gradient.addColorStop(0, rgba(244, 249, 255, 0.96));
      gradient.addColorStop(1, rgba(118, 151, 184, 0.5));
      context.fillStyle = gradient;
      context.fillRect(x - buildingWidth / 2, groundY - buildingHeight, buildingWidth, buildingHeight);
      context.strokeStyle = rgba(92, 128, 165, 0.26);
      context.strokeRect(x - buildingWidth / 2, groundY - buildingHeight, buildingWidth, buildingHeight);
      context.beginPath();
      context.moveTo(x - buildingWidth / 2, groundY - buildingHeight);
      context.lineTo(x, groundY - buildingHeight - buildingWidth * 0.22);
      context.lineTo(x + buildingWidth / 2, groundY - buildingHeight);
      context.strokeStyle = rgba(255, 255, 255, 0.48);
      context.stroke();

      const windows = Math.min(7, Math.floor(buildingHeight / 14));
      for (let row = 1; row < windows; row += 1) {
        context.fillStyle = rgba(116, 172, 224, 0.22 + ((row + building.index) % 3) * 0.09);
        context.fillRect(x - buildingWidth * 0.23, groundY - buildingHeight + row * (buildingHeight / windows), buildingWidth * 0.46, 1);
      }
    });

    context.globalCompositeOperation = "screen";
    for (let arc = 0; arc < 12; arc += 1) {
      const seed = this.city[arc * 5];
      const x = centreX + seed.x * width * 0.38;
      const y = horizon + seed.z * height * 0.32;
      context.beginPath();
      context.moveTo(x, y);
      context.quadraticCurveTo(centreX, horizon - height * (0.11 + arc * 0.008), centreX - seed.x * width * 0.24, y + height * 0.03);
      context.strokeStyle = rgba(118, 168, 218, 0.13 + local * 0.12);
      context.lineWidth = 0.7;
      context.stroke();
    }
    context.restore();
  }

  drawHome(context, progress, width, height) {
    const alpha = smoothstep(0.88, 1, progress);
    if (alpha < 0.001) return;
    context.save();
    context.fillStyle = rgba(255, 255, 255, alpha * 0.82);
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = "multiply";
    this.particles.slice(0, Math.floor(this.particles.length * 0.45)).forEach((particle) => {
      const side = particle.index % 2 ? 1 : -1;
      const x = width * 0.5 + side * width * (0.14 + particle.radius * 0.54) * alpha;
      const y = height * (0.48 + Math.sin(particle.phase) * 0.28);
      context.fillStyle = rgba(62, 113, 168, 0.08 * alpha);
      context.fillRect(x, y, 1.1, 1.1);
    });
    context.restore();
  }

  drawVignette(context, progress, width, height) {
    const amount = 1 - smoothstep(0.7, 0.98, progress);
    if (amount <= 0) return;
    const vignette = context.createRadialGradient(width * 0.54, height * 0.47, width * 0.12, width * 0.54, height * 0.47, width * 0.78);
    vignette.addColorStop(0, rgba(1, 8, 18, 0));
    vignette.addColorStop(1, rgba(0, 6, 14, 0.48 * amount));
    context.fillStyle = vignette;
    context.fillRect(0, 0, width, height);
  }
}
