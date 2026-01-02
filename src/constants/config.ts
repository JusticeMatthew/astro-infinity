import type { IconName } from "~/primitives/Icon";
import { z } from "astro/zod";

const iconGlideSchema = z.object({
  movementIntensity: z.number(),
  speed: z.number(),
});

const iconSpinSchema = z.object({
  intervalMin: z.number().positive(),
  intervalMax: z.number().positive(),
  duration: z.number().positive(),
});

const iconConfigSchema = z.object({
  size: z.number().positive(),
  glide: iconGlideSchema,
  spin: iconSpinSchema,
});

const iconPositionSchema = z.object({
  key: z.string(),
  icon: z.custom<IconName>(),
  depthRatio: z.number().min(0).max(1),
  top: z.string(),
  left: z.string(),
  hideOnMobile: z.boolean(),
});

const configSchema = z.object({
  baseLayerCount: z.number().int().positive(),
  minScale: z.number().positive(),
  bufferScale: z.number().positive(),
  perspectiveDistance: z.number().positive(),
  transitionDuration: z.number().nonnegative(),
  flowSpeed: z.number().positive(),
  dotSize: z.number().positive(),
  dotPixelSpacing: z.number().positive(),
  lineWidth: z.number().positive(),
  lineCornerRadius: z.number().nonnegative(),
  cardLayer: z.number().int().nonnegative(),
  icons: iconConfigSchema,
  iconPositions: z.array(iconPositionSchema),
});

export type InfinitySpaceConfig = z.infer<typeof configSchema>;
export type IconPosition = z.infer<typeof iconPositionSchema>;

export const INFINITY_SPACE_CONFIG = configSchema.parse({
  baseLayerCount: 15,
  minScale: 0.3,
  bufferScale: 1.15,
  perspectiveDistance: 1000,
  transitionDuration: 100,
  flowSpeed: 10000,
  dotSize: 6,
  dotPixelSpacing: 80,
  lineWidth: 3,
  lineCornerRadius: 12,
  cardLayer: 8,
  icons: {
    size: 82,
    glide: {
      movementIntensity: 0.6,
      speed: 0.002,
    },
    spin: {
      intervalMin: 5000,
      intervalMax: 10000,
      duration: 7000,
    },
  },
  iconPositions: [
    {
      key: "topLeft",
      icon: "astro",
      depthRatio: 0.33,
      top: "14%",
      left: "16%",
      hideOnMobile: false,
    },
    {
      key: "bottomRight",
      icon: "solid",
      depthRatio: 0.4,
      top: "80%",
      left: "78%",
      hideOnMobile: false,
    },
    {
      key: "topRight",
      icon: "houston",
      depthRatio: 0.67,
      top: "10%",
      left: "82%",
      hideOnMobile: true,
    },
    {
      key: "bottomLeft",
      icon: "astronaut",
      depthRatio: 0.73,
      top: "90%",
      left: "12%",
      hideOnMobile: true,
    },
  ],
});
