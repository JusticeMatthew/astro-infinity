import type { Component } from "solid-js";

import { useHueColors } from "~/lib/composables/useHueColors";

import { DisplayMode } from "../control-modules/DisplayMode";
import { LayerCountSlider } from "../control-modules/LayerCountSlider";

export const ViewPanel: Component = () => {
  const colors = useHueColors();

  return (
    <div
      class="flex w-full flex-col gap-4 rounded-t-lg border-x border-t border-white/5 p-4"
      style={{ "background-color": colors.dark(5) }}>
      <div class="h-8">
        <DisplayMode />
      </div>
      <div class="h-8">
        <LayerCountSlider />
      </div>
    </div>
  );
};
