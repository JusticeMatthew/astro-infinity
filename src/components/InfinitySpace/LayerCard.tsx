import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import { useHueColors } from "~/lib/composables/useHueColors";
import { hueReady } from "~/lib/store";

export const LayerCard: Component = () => {
  const colors = useHueColors();
  const isHueReady = useStore(hueReady);

  return (
    <div
      class={`absolute inset-4 z-50 transition-opacity duration-300 ${isHueReady() ? "opacity-100" : "opacity-0"}`}>
      <div class="absolute inset-0 z-20 flex items-center justify-center p-12">
        <div class="relative flex items-center justify-center rounded-lg px-24 py-20">
          <div class="relative z-10 flex flex-col items-center justify-center gap-8 subpixel-antialiased">
            <h2
              class="font-astro text-center text-3xl font-bold md:text-5xl"
              style={{ color: colors.accent() }}>
              ASTRO_INFINITY
            </h2>
            <p
              class="max-w-[40ch] text-center opacity-80 md:text-xl"
              style={{ color: colors.subtle() }}>
              This "Infinity Space" is a hobby project to showcase the infinite
              possibilities of web development, powered by Astro & Solid-js
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
