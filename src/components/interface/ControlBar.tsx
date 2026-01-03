import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import { displayMode, hueReady } from "~/lib/store";

import { DisplayMode } from "./control-modules/DisplayMode";
import { DownloadButton } from "./control-modules/DownloadButton";
import { HueSlider } from "./control-modules/HueSlider";
import { InfinityToggle } from "./control-modules/InfinityToggle";
import { LayerCountSlider } from "./control-modules/LayerCountSlider";
import { MotionToggle } from "./control-modules/MotionToggle";
import { RandomColor } from "./control-modules/RandomColor";

export const ControlBar: Component = () => {
  const isHueReady = useStore(hueReady);
  const mode = useStore(displayMode);

  const bgColor = () => (mode() === "dots" ? "bg-black/30" : "bg-black/50");

  return (
    <div
      class={`fixed -top-8 z-50 w-fit rounded-b-xl border-x border-b border-white/5 px-5 pt-12 pb-4 backdrop-blur-[6px] ${bgColor()} overflow-clip shadow max-lg:hidden`}>
      <div
        class={`flex w-fit flex-col items-center justify-center gap-4 transition-opacity duration-300 ${isHueReady() ? "opacity-100" : "opacity-0"}`}>
        <div class="z-10 grid h-8 w-full grid-flow-col-dense items-center gap-8">
          <InfinityToggle />
          <DisplayMode />
          <MotionToggle />
          <DownloadButton />
        </div>
        <div class="z-10 grid h-8 w-full grid-cols-[auto_1fr_1fr] items-center gap-8">
          <RandomColor />
          <HueSlider />
          <LayerCountSlider />
        </div>
      </div>
    </div>
  );
};
