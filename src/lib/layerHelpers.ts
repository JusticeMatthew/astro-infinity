import type { INFINITY_SPACE_CONFIG } from "~/constants/config";

const LINEAR_FADE_IN_END = 0.1;
const LINEAR_FADE_OUT_START = 0.8;

export interface LinearLayerSettings {
  scale: number;
  opacity: number;
}

type LinearSettingsConfig = Pick<
  typeof INFINITY_SPACE_CONFIG,
  "bufferScale" | "minScale"
>;

export const getLinearLayerSettings = (
  position: number,
  layerCount: number,
  config: LinearSettingsConfig,
): LinearLayerSettings => {
  const progress = position / layerCount;

  const scale =
    config.bufferScale - progress * (config.bufferScale - config.minScale);

  let opacity: number;
  if (progress < LINEAR_FADE_IN_END) {
    opacity = progress / LINEAR_FADE_IN_END;
  } else if (progress > LINEAR_FADE_OUT_START) {
    opacity =
      1 - (progress - LINEAR_FADE_OUT_START) / (1 - LINEAR_FADE_OUT_START);
  } else {
    opacity = 1;
  }

  return { scale, opacity };
};

export const getFixedLayerProgress = (
  slot: number,
  layerCount: number,
): number => {
  return slot / layerCount;
};

export const getRandomSpinInterval = (
  intervalMin: number,
  intervalMax: number,
): number => {
  return intervalMin + Math.random() * (intervalMax - intervalMin);
};

export const smoothstep = (t: number): number => {
  return t * t * (3 - 2 * t);
};

export const getEchoOpacity = (
  layerProgress: number,
  slotProgress: number,
  layerCount: number,
): number => {
  const distance = layerProgress - slotProgress;
  const oneSlotDistance = 1 / layerCount;

  if (distance < oneSlotDistance) {
    return smoothstep(distance / oneSlotDistance);
  }
  return 1;
};

export const isLayerDeeper = (
  layerProgress: number,
  slotProgress: number,
): boolean => {
  return layerProgress > slotProgress;
};

export const getSpinRotation = (
  progress: number,
  rotations: number,
  clockwise: boolean,
): number => {
  const maxAngle = rotations * 360;
  const direction = clockwise ? 1 : -1;
  const eased = smoothstep(progress);
  return eased * maxAngle * direction;
};
