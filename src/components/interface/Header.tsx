import type { Component } from "solid-js";

import { DisplayMode } from "./control-modules/DisplayMode";
import { DownloadButton } from "./control-modules/DownloadButton";
import { HueSlider } from "./control-modules/HueSlider";
import { LayerCount } from "./control-modules/LayerCount";
import { MotionToggle } from "./control-modules/MotionToggle";
import { RandomColor } from "./control-modules/RandomColor";

export const Header: Component = () => {
  return (
    <header class="fixed top-4 z-50 rounded-xl bg-black p-4 shadow-[0_0_20px_16px_rgba(0,0,0,0.9)]">
      <div class="flex h-8 items-center justify-evenly gap-12">
        <RandomColor />
        <HueSlider />
        <LayerCount />
        <DisplayMode />
        <MotionToggle />
        <DownloadButton />
      </div>
    </header>
  );
};
