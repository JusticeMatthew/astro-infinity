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

export const downloadLoading = atom<boolean>(false);

export const motionEnabled = atom<boolean>(true);

export const prefersReducedMotion = atom<boolean>(false);

export const setMotionEnabled = (enabled: boolean) => {
  motionEnabled.set(enabled);
};

export const INFINITY_ROTATION_DURATION = 7000;

export const infinityMode = atom<boolean>(false);
export const hueSliderActive = atom<boolean>(false);

export const toggleInfinityMode = () => {
  if (!motionEnabled.get()) return;
  clearAllWaves();
  infinityMode.set(!infinityMode.get());
};

export const setHueSliderActive = (active: boolean) => {
  hueSliderActive.set(active);
};
