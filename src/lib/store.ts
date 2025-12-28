import { atom } from "nanostores";

const MAX_HUE_HISTORY = 5;

export type DisplayMode = "dots" | "lines";

export const accentHue = atom<number>(0);
export const hueReady = atom<boolean>(false);
export const displayMode = atom<DisplayMode>("dots");
export const layerCount = atom<number>(15);
export const downloadTrigger = atom<number>(0);
export const hueHistory = atom<number[]>([]);
export const pendingWave = atom<number | null>(null);

let hueInitialized = false;

export const initializeRandomHue = () => {
  if (hueInitialized) return;
  accentHue.set(Math.floor(Math.random() * 360));
  hueInitialized = true;

  requestAnimationFrame(() => {
    hueReady.set(true);
  });
};

export const setHue = (hue: number, addToHistory = false) => {
  if (addToHistory) {
    const history = hueHistory.get();
    const updated = [accentHue.get(), ...history].slice(0, MAX_HUE_HISTORY);
    hueHistory.set(updated);
    pendingWave.set(hue);
  }
  accentHue.set(hue);
};

export const randomizeHue = () => {
  setHue(Math.floor(Math.random() * 360), true);
};

export const clearPendingWave = () => {
  pendingWave.set(null);
};

export const clearWavesSignal = atom<number>(0);

export const clearAllWaves = () => {
  clearWavesSignal.set(Date.now());
};

export const setDisplayMode = (mode: DisplayMode) => {
  displayMode.set(mode);
};

export const setLayerCount = (count: number) => {
  layerCount.set(count);
};

export const triggerDownload = () => {
  downloadTrigger.set(Date.now());
};

export const motionEnabled = atom<boolean>(true);

let motionInitialized = false;

export const initializeMotionPreference = () => {
  if (motionInitialized || typeof window === "undefined") return;
  motionInitialized = true;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReduced) {
    motionEnabled.set(false);
  }
};

export const setMotionEnabled = (enabled: boolean) => {
  motionEnabled.set(enabled);
};

export const infinityBreathing = atom<boolean>(false);
export const breatheProgress = atom<number>(0);
export const breatheFlowMultiplier = atom<number>(1);

const BREATHE_DURATION = 3000;
const LAYER_MAX = 30;
const BREATHE_FLOW_BOOST = 2.5;

const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const triggerInfinityBreathe = () => {
  if (infinityBreathing.get()) return;

  infinityBreathing.set(true);

  const startHue = accentHue.get();
  const startLayers = layerCount.get();
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / BREATHE_DURATION, 1);

    breatheProgress.set(progress);

    const layerBreatheCurve =
      progress < 0.5
        ? easeInOutCubic(progress * 2)
        : easeInOutCubic(2 - progress * 2);

    const newLayers = Math.round(
      startLayers + (LAYER_MAX - startLayers) * layerBreatheCurve,
    );
    layerCount.set(newLayers);

    breatheFlowMultiplier.set(1 + layerBreatheCurve * (BREATHE_FLOW_BOOST - 1));

    const hueShift = progress * 360;
    accentHue.set((startHue + hueShift) % 360);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      layerCount.set(startLayers);
      breatheProgress.set(0);
      breatheFlowMultiplier.set(1);
      infinityBreathing.set(false);
    }
  };

  requestAnimationFrame(animate);
};
