import { atom } from "nanostores";

const MAX_HUE_HISTORY = 5;
const DEFAULT_HUE = 220;

export type DisplayMode = "dots" | "lines";

export const accentHue = atom<number>(DEFAULT_HUE);
export const displayMode = atom<DisplayMode>("dots");
export const layerCount = atom<number>(15);
export const downloadTrigger = atom<number>(0);
export const hueHistory = atom<number[]>([]);
export const pendingWave = atom<number | null>(null);

let hueInitialized = false;

export const initializeRandomHue = () => {
  if (hueInitialized) return;
  hueInitialized = true;
  accentHue.set(Math.floor(Math.random() * 360));
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
