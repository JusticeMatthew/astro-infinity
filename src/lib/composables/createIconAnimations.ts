import { createSignal } from "solid-js";

import { getRandomSpinInterval, getSpinRotation } from "~/lib/layerHelpers";

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

  const cachedGlideOffsets = Array.from({ length: options.iconCount }, () => ({
    x: 0,
    y: 0,
  }));
  const cachedRotations = Array.from({ length: options.iconCount }, () => 0);

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
    return cachedGlideOffsets[iconIndex] ?? { x: 0, y: 0 };
  };

  const getIconRotation = (iconIndex: number): number => {
    return cachedRotations[iconIndex] ?? 0;
  };

  const updateCachedValues = () => {
    const time = glideTime();
    const intensity = options.glideConfig.movementIntensity;
    const animating = options.canAnimate();
    const activeIcon = spinIconIndex();
    const progress = spinProgress();
    const clockwise = spinClockwise();

    for (let i = 0; i < options.iconCount; i++) {
      const offset = cachedGlideOffsets[i];
      const phase = iconPhases[i];

      if (!animating || !offset || !phase) {
        if (offset) {
          offset.x = 0;
          offset.y = 0;
        }
        cachedRotations[i] = 0;
        continue;
      }

      offset.x = Math.sin(time * phase.xFreq + phase.xPhase) * intensity;
      offset.y = Math.cos(time * phase.yFreq + phase.yPhase) * intensity;

      cachedRotations[i] =
        activeIcon === i
          ? getSpinRotation(progress, SPIN_ROTATIONS, clockwise)
          : 0;
    }
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

    updateCachedValues();
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
