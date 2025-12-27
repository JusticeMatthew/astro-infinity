import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import { hueReady } from "~/lib/store";

import { DisplayMode } from "./control-modules/DisplayMode";
import { DownloadButton } from "./control-modules/DownloadButton";
import { HueSlider } from "./control-modules/HueSlider";
import { LayerCountSlider } from "./control-modules/LayerCountSlider";
import { MotionToggle } from "./control-modules/MotionToggle";
import { RandomColor } from "./control-modules/RandomColor";

export const Header: Component = () => {
  const isHueReady = useStore(hueReady);

  return (
    <header class="fixed top-4 z-50 rounded-xl bg-black p-4 shadow-[0_0_20px_16px_rgba(0,0,0,0.9)]">
      <div
        class={`flex h-8 items-center justify-evenly gap-12 transition-opacity duration-300 ${isHueReady() ? "opacity-100" : "opacity-0"}`}>
        <RandomColor />
        <HueSlider />
        <LayerCountSlider />
        <DisplayMode />
        <MotionToggle />
        <DownloadButton />
      </div>
    </header>
  );
};
