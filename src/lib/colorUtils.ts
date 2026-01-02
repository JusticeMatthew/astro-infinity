const ACCENT_SATURATION = 70;
const ACCENT_LIGHTNESS = 55;

const LAYER_SATURATION_FADE = 0.2;
const LAYER_LIGHTNESS_FADE = 0.7;

const DARK_SATURATION_FACTOR = 0.8;

const SUBTLE_SATURATION_FACTOR = 0.5;
const SUBTLE_LIGHTNESS_BOOST = 15;
const MAX_LIGHTNESS = 85;

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export const toHSLString = ({ h, s, l }: HSL): string =>
  `hsl(${h}, ${s}%, ${l}%)`;

export const getAccentHSL = (hue: number): HSL => ({
  h: hue,
  s: ACCENT_SATURATION,
  l: ACCENT_LIGHTNESS,
});

export const getLayerHSL = (hue: number, progress: number): HSL => ({
  h: hue,
  s: ACCENT_SATURATION * (1 - progress * LAYER_SATURATION_FADE),
  l: ACCENT_LIGHTNESS * (1 - progress * LAYER_LIGHTNESS_FADE),
});

export const getDarkHSL = (hue: number, lightness = 8): HSL => ({
  h: hue,
  s: ACCENT_SATURATION * DARK_SATURATION_FACTOR,
  l: lightness,
});

export const getSubtleHSL = (hue: number): HSL => ({
  h: hue,
  s: ACCENT_SATURATION * SUBTLE_SATURATION_FACTOR,
  l: Math.min(ACCENT_LIGHTNESS + SUBTLE_LIGHTNESS_BOOST, MAX_LIGHTNESS),
});

const HSL_REGEX = /^hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)$/;

export const darkenHSL = (hsl: string, factor: number): string => {
  const match = HSL_REGEX.exec(hsl);
  if (!match) return hsl;
  return `hsl(${match[1]}, ${match[2]}%, ${parseFloat(match[3]!) * factor}%)`;
};
