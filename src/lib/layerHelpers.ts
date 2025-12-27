import type { INFINITY_SPACE_CONFIG } from "~/constants/config";

const OPACITY_FADE_IN_THRESHOLD = 0.1;
const OPACITY_FADE_OUT_START = 0.6;
const OPACITY_FADE_OUT_DURATION = 0.4;

const DEFAULT_MIN_ICON_SCALE = 0.4;
const DEFAULT_MAX_ICON_SCALE = 1.2;

export interface LayerSettings {
  scale: number;
  opacity: number;
  iconSize: number;
}

type LayerSettingsConfig = Pick<
  typeof INFINITY_SPACE_CONFIG,
  "bufferScale" | "minScale"
> & {
  icons?: { size: number };
};

export interface DotPosition {
  x: number;
  y: number;
}

export const getLayerSettings = (
  progress: number,
  config: LayerSettingsConfig,
  minIconScaleFactor = DEFAULT_MIN_ICON_SCALE,
  maxIconScaleFactor = DEFAULT_MAX_ICON_SCALE,
): LayerSettings => {
  const easedProgress = smoothstep(progress);

  const scale =
    config.bufferScale - easedProgress * (config.bufferScale - config.minScale);

  let opacity: number;
  if (progress < OPACITY_FADE_IN_THRESHOLD) {
    opacity = progress / OPACITY_FADE_IN_THRESHOLD;
  } else if (progress > OPACITY_FADE_OUT_START) {
    const fadeProgress =
      (progress - OPACITY_FADE_OUT_START) / OPACITY_FADE_OUT_DURATION;
    opacity = 1 - fadeProgress * fadeProgress;
  } else {
    opacity = 1;
  }

  const baseIconSize = config.icons?.size ?? 82;
  const scaleFactor =
    maxIconScaleFactor -
    easedProgress * (maxIconScaleFactor - minIconScaleFactor);
  const iconSize = baseIconSize * scaleFactor;

  return { scale, opacity, iconSize };
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
