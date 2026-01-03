import type { ParentComponent } from "solid-js";
import { onMount } from "solid-js";

import { initializeRandomHue, prefersReducedMotion } from "~/lib/store";

import { ControlBar } from "~/interface/ControlBar";
import { MobileControlBar } from "~/interface/mobile/MobileControlBar";
import { InfinitySpace } from "~/components/InfinitySpace";

export const Main: ParentComponent = () => {
  onMount(() => {
    initializeRandomHue();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      prefersReducedMotion.set(true);
    }
  });

  return (
    <main class="flex h-svh items-center justify-center shadow-[inset_0_0_60px_30px_rgba(0,0,0,0.8)]">
      <ControlBar />
      <MobileControlBar />
      <div class="relative h-full w-full overflow-hidden rounded-lg bg-black">
        <InfinitySpace />
      </div>
    </main>
  );
};
