import { createSignal } from "solid-js";

import {
  getGlideOffset as getGlideOffsetFromService,
  getRandomSpinInterval,
  getSpinRotation,
} from "~/lib/layerHelpers";

interface IconPhase {
  xPhase: number;
  yPhase: number;
  xFreq: number;
  yFreq: number;
}

interface IconSpinConfig {
  intervalMin: number;
  intervalMax: number;
  duration: number;
}

interface IconGlideConfig {
  movementIntensity: number;
  speed: number;
}

interface CreateIconAnimationsOptions {
  iconCount: number;
  spinConfig: IconSpinConfig;
  glideConfig: IconGlideConfig;
  canAnimate: () => boolean;
}

const ICON_FREQUENCIES = [
  { xFreq: 0.8, yFreq: 1.0 },
  { xFreq: 1.2, yFreq: 1.35 },
  { xFreq: 1.1, yFreq: 1.7 },
  { xFreq: 1.5, yFreq: 1.0 },
];

const SPIN_ROTATIONS = 3;
const MAX_PLAYS_BEFORE_RESET = 2;

export const createIconAnimations = (options: CreateIconAnimationsOptions) => {
  const [glideTime, setGlideTime] = createSignal(0);
  const [spinIconIndex, setSpinIconIndex] = createSignal<number | null>(null);
  const [spinProgress, setSpinProgress] = createSignal(0);
  const [spinClockwise, setSpinClockwise] = createSignal(false);

  let nextSpinTime =
    performance.now() +
    getRandomSpinInterval(
      options.spinConfig.intervalMin,
      options.spinConfig.intervalMax,
    );
  let lastClockwise = false;
  const playedTwice = new Set<number>();
  const playCount = new Map<number, number>();

  const iconPhases: IconPhase[] = Array.from(
    { length: options.iconCount },
    (_, i) => {
      const freqs = ICON_FREQUENCIES[i] ?? { xFreq: 1.0, yFreq: 1.0 };
      return {
        xPhase: i * Math.PI * 0.7 + Math.random() * 0.5,
        yPhase: i * Math.PI * 0.5 + Math.random() * 0.5,
        xFreq: freqs.xFreq,
        yFreq: freqs.yFreq,
      };
    },
  );

  const selectNextSpinIcon = (): number => {
    const available = Array.from(
      { length: options.iconCount },
      (_, i) => i,
    ).filter((i) => !playedTwice.has(i));

    if (available.length === 0) {
      playedTwice.clear();
      playCount.clear();
      return Math.floor(Math.random() * options.iconCount);
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const selectedIcon = available[randomIndex];

    if (selectedIcon === undefined) {
      return 0;
    }

    const count = (playCount.get(selectedIcon) ?? 0) + 1;
    playCount.set(selectedIcon, count);
    if (count >= MAX_PLAYS_BEFORE_RESET) {
      playedTwice.add(selectedIcon);
    }

    return selectedIcon;
  };

  const getGlideOffset = (iconIndex: number) => {
    const phase = iconPhases[iconIndex];
    if (!options.canAnimate() || !phase) {
      return { x: 0, y: 0 };
    }
    return getGlideOffsetFromService(
      glideTime(),
      phase,
      options.glideConfig.movementIntensity,
    );
  };

  const getIconRotation = (iconIndex: number): number => {
    if (!options.canAnimate()) {
      return 0;
    }
    const activeIcon = spinIconIndex();
    if (activeIcon === null || activeIcon !== iconIndex) {
      return 0;
    }
    return getSpinRotation(spinProgress(), SPIN_ROTATIONS, spinClockwise());
  };

  const updateAnimations = (deltaTime: number, currentTime: number) => {
    setGlideTime((prev) => prev + deltaTime * options.glideConfig.speed);

    const activeIcon = spinIconIndex();
    if (activeIcon !== null) {
      const newProgress =
        spinProgress() + deltaTime / options.spinConfig.duration;
      if (newProgress >= 1) {
        setSpinIconIndex(null);
        setSpinProgress(0);
        nextSpinTime =
          currentTime +
          getRandomSpinInterval(
            options.spinConfig.intervalMin,
            options.spinConfig.intervalMax,
          );
      } else {
        setSpinProgress(newProgress);
      }
    } else if (currentTime >= nextSpinTime) {
      lastClockwise = !lastClockwise;
      setSpinIconIndex(selectNextSpinIcon());
      setSpinProgress(0);
      setSpinClockwise(lastClockwise);
    }
  };

  return {
    glideTime,
    spinIconIndex,
    spinProgress,
    getGlideOffset,
    getIconRotation,
    updateAnimations,
  };
};
