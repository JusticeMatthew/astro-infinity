import type { INFINITY_SPACE_CONFIG } from "~/constants/config";

export interface DotPosition {
  x: number;
  y: number;
}

export const generateDotPositions = (
  width: number,
  height: number,
  spacing: number,
): DotPosition[] => {
  if (width <= 0 || height <= 0 || spacing <= 0) return [];

  const positions: DotPosition[] = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ];

  const hCount = Math.max(0, Math.round(width / spacing) - 1);
  const vCount = Math.max(0, Math.round(height / spacing) - 1);

  for (let i = 1; i <= hCount; i++) {
    const x = (i / (hCount + 1)) * 100;
    positions.push({ x, y: 0 }, { x, y: 100 });
  }

  for (let i = 1; i <= vCount; i++) {
    const y = (i / (vCount + 1)) * 100;
    positions.push({ x: 0, y }, { x: 100, y });
  }

  return positions;
};

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
