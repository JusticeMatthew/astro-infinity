import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import { useHueColors } from "~/lib/composables/useHueColors";
import { displayMode, hueReady } from "~/lib/store";

import { Icon } from "~/primitives/Icon";

import { DisplayMode } from "./control-modules/DisplayMode";
import { DownloadButton } from "./control-modules/DownloadButton";
import { HueSlider } from "./control-modules/HueSlider";
import { LayerCountSlider } from "./control-modules/LayerCountSlider";
import { MotionToggle } from "./control-modules/MotionToggle";
import { RandomColor } from "./control-modules/RandomColor";

export const ControlBar: Component = () => {
  const isHueReady = useStore(hueReady);
  const mode = useStore(displayMode);
  const colors = useHueColors();

  const bgColor = () => (mode() === "dots" ? "bg-black/10" : "bg-black/70");

  return (
    <div
      class={`fixed -top-8 z-50 w-fit rounded-b-xl border-x border-b border-white/5 px-5 pt-12 pb-4 backdrop-blur-[6px] ${bgColor()} overflow-clip`}>
      <div
        class={`flex w-fit flex-col items-center justify-center gap-4 transition-opacity duration-300 ${isHueReady() ? "opacity-100" : "opacity-0"}`}>
        <div class="z-10 grid h-8 w-full grid-flow-col-dense items-center gap-8">
          <div
            style={{ "background-color": colors.dark() }}
            class="flex aspect-square h-full cursor-pointer items-center justify-center rounded transition-opacity hover:opacity-75">
            <Icon
              name="infinity"
              class="size-5"
              style={{ color: colors.accent() }}
            />
          </div>
          <DisplayMode />
          <MotionToggle />
          <DownloadButton />
        </div>
        <div class="z-10 grid h-8 w-full grid-flow-col-dense items-center gap-8">
          <RandomColor />
          <HueSlider />
          <LayerCountSlider />
        </div>
      </div>
    </div>
  );
};
