const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export class FrameSequenceCache {
  constructor({ frameCount, pathTemplate, preloadRadius = 8, maxDecodedFrames = 36 }) {
    this.frameCount = frameCount;
    this.pathTemplate = pathTemplate;
    this.preloadRadius = preloadRadius;
    this.maxDecodedFrames = maxDecodedFrames;
    this.frames = new Map();
    this.pending = new Map();
    this.lastFrame = null;
  }

  frameUrl(index) {
    const value = String(index + 1).padStart(4, "0");
    return `${import.meta.env.BASE_URL}${this.pathTemplate.replace("{frame}", value)}`;
  }

  async load(index) {
    const safeIndex = clamp(index, 0, this.frameCount - 1);
    if (this.frames.has(safeIndex)) return this.frames.get(safeIndex).bitmap;
    if (this.pending.has(safeIndex)) return this.pending.get(safeIndex);

    const request = fetch(this.frameUrl(safeIndex))
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load cinematic frame ${safeIndex}`);
        return response.blob();
      })
      .then(async (blob) => {
        const bitmap = "createImageBitmap" in window
          ? await createImageBitmap(blob)
          : await this.createImage(blob);
        this.frames.set(safeIndex, { bitmap, touched: performance.now() });
        this.lastFrame = bitmap;
        this.trim(safeIndex);
        return bitmap;
      })
      .finally(() => this.pending.delete(safeIndex));

    this.pending.set(safeIndex, request);
    return request;
  }

  createImage(blob) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(blob);
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to decode cinematic frame"));
      };
      image.src = url;
    });
  }

  prioritize(targetIndex) {
    const target = clamp(Math.round(targetIndex), 0, this.frameCount - 1);
    const order = [target];
    for (let offset = 1; offset <= this.preloadRadius; offset += 1) {
      order.push(target + offset, target - offset);
    }
    order
      .filter((index) => index >= 0 && index < this.frameCount)
      .forEach((index) => this.load(index).catch(() => undefined));
  }

  get(index) {
    const safeIndex = clamp(Math.round(index), 0, this.frameCount - 1);
    const record = this.frames.get(safeIndex);
    if (record) {
      record.touched = performance.now();
      this.lastFrame = record.bitmap;
      return record.bitmap;
    }
    this.prioritize(safeIndex);
    return this.lastFrame;
  }

  trim(keepIndex) {
    if (this.frames.size <= this.maxDecodedFrames) return;
    const candidates = [...this.frames.entries()]
      .filter(([index]) => Math.abs(index - keepIndex) > this.preloadRadius)
      .sort((a, b) => a[1].touched - b[1].touched);
    while (this.frames.size > this.maxDecodedFrames && candidates.length) {
      const [index, frame] = candidates.shift();
      frame.bitmap.close?.();
      this.frames.delete(index);
    }
  }

  dispose() {
    this.frames.forEach(({ bitmap }) => bitmap.close?.());
    this.frames.clear();
    this.pending.clear();
    this.lastFrame = null;
  }
}

