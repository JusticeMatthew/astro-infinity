import { useStore } from "@nanostores/solid";

import {
  getAccentHSL,
  getDarkHSL,
  getLayerHSL,
  getSubtleHSL,
  toHSLString,
} from "~/lib/colorUtils";
import { accentHue } from "~/lib/store";

export const useHueColors = () => {
  const hue = useStore(accentHue);

  return {
    hue,
    accent: () => toHSLString(getAccentHSL(hue())),
    dark: (lightness = 8) => toHSLString(getDarkHSL(hue(), lightness)),
    subtle: () => toHSLString(getSubtleHSL(hue())),
    layer: (progress: number) => toHSLString(getLayerHSL(hue(), progress)),
  };
};
