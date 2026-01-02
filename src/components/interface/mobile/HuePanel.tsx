import type { Component } from "solid-js";

import { useHueColors } from "~/lib/composables/useHueColors";

import { HueSlider } from "../control-modules/HueSlider";
import { RandomColor } from "../control-modules/RandomColor";

export const HuePanel: Component = () => {
  const colors = useHueColors();

  return (
    <div
      class="flex w-full flex-col gap-4 rounded-t-xl border-x border-t border-white/5 px-4 py-4 backdrop-blur-[6px]"
      style={{ "background-color": colors.dark(5) }}>
      <div class="h-8">
        <RandomColor />
      </div>
      <div class="h-8">
        <HueSlider />
      </div>
    </div>
  );
};
