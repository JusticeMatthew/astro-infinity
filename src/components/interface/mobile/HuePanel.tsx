import type { Component } from "solid-js";

import { HueSlider } from "~/interface/control-modules/HueSlider";
import { RandomColor } from "~/interface/control-modules/RandomColor";

export const HuePanel: Component = () => {
  return (
    <div class="flex w-full flex-col items-center gap-3 border-t border-white/5 bg-black pt-3">
      <div class="flex h-10 w-full max-w-xl px-3 md:h-12">
        <RandomColor />
      </div>
      <div class="flex h-10 w-full max-w-xl px-3 md:h-12">
        <HueSlider />
      </div>
    </div>
  );
};
