import type { Component } from "solid-js";

import { DisplayMode } from "../control-modules/DisplayMode";
import { LayerCountSlider } from "../control-modules/LayerCountSlider";

export const ViewPanel: Component = () => {
  return (
    <div class="flex w-full flex-col items-center gap-3 border-t border-white/5 bg-black pt-3">
      <div class="flex h-10 w-full max-w-xl px-3 md:h-12">
        <DisplayMode />
      </div>
      <div class="flex h-10 w-full max-w-xl px-3 md:h-12">
        <LayerCountSlider />
      </div>
    </div>
  );
};
