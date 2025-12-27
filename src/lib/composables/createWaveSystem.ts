import { useStore } from "@nanostores/solid";
import { createEffect, createSignal, on } from "solid-js";

import { getLayerHSL, toHSLString } from "~/lib/colorUtils";
import {
  accentHue,
  clearPendingWave,
  clearWavesSignal,
  pendingWave,
} from "~/lib/store";

export interface HueWave {
  hue: number;
  wavefrontPosition: number;
}

interface CreateWaveSystemOptions {
  flowSpeed: number;
  getFrontmostProgress: () => number;
}

const WAVE_LIFT_DURATION = 1600;

export const createWaveSystem = (options: CreateWaveSystemOptions) => {
  const currentHue = useStore(accentHue);
  const pending = useStore(pendingWave);
  const clearSignal = useStore(clearWavesSignal);

  const [waves, setWaves] = createSignal<HueWave[]>([]);
  const [resolvedHue, setResolvedHue] = createSignal(currentHue());

  createEffect(() => {
    if (waves().length === 0) {
      setResolvedHue(currentHue());
    }
  });

  createEffect(() => {
    const newHue = pending();
    if (newHue !== null) {
      const liftOffset = WAVE_LIFT_DURATION / options.flowSpeed;
      const startPosition = options.getFrontmostProgress() + liftOffset;

      setWaves((prev) => [
        ...prev,
        { hue: newHue, wavefrontPosition: startPosition },
      ]);
      clearPendingWave();
    }
  });

  createEffect(
    on(
      clearSignal,
      (signal) => {
        if (signal > 0) {
          setWaves([]);
          setResolvedHue(accentHue.get());
        }
      },
      { defer: true },
    ),
  );

  const advanceWaves = (deltaTime: number) => {
    const increment = deltaTime / options.flowSpeed;

    setWaves((prev) => {
      const updated: HueWave[] = [];
      for (const wave of prev) {
        const newPosition = wave.wavefrontPosition + increment;
        if (newPosition >= 1) {
          setResolvedHue(wave.hue);
        } else {
          updated.push({ ...wave, wavefrontPosition: newPosition });
        }
      }
      return updated;
    });
  };

  const getHueForProgress = (progress: number): number => {
    const allWaves = waves();

    for (let i = allWaves.length - 1; i >= 0; i--) {
      const wave = allWaves[i];
      if (wave && progress < wave.wavefrontPosition) {
        return wave.hue;
      }
    }

    return resolvedHue();
  };

  const getLayerColor = (layerProgress: number): string => {
    const hue = getHueForProgress(layerProgress);
    return toHSLString(getLayerHSL(hue, layerProgress));
  };

  return {
    waves,
    activeHue: resolvedHue,
    advanceWaves,
    getHueForProgress,
    getLayerColor,
  };
};
