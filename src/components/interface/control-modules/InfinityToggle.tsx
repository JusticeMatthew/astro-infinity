import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import { useHueColors } from "~/lib/composables/useHueColors";
import { motionEnabled, toggleInfinityMode } from "~/lib/store";

import { Icon } from "~/primitives/Icon";

export const InfinityToggle: Component = () => {
  const colors = useHueColors();
  const isMotionEnabled = useStore(motionEnabled);

  return (
    <button
      type="button"
      class="group flex aspect-square h-full cursor-default items-center justify-center rounded transition-opacity disabled:pointer-events-none"
      style={{ "background-color": colors.dark() }}
      disabled={!isMotionEnabled()}
      onClick={toggleInfinityMode}>
      <Icon
        name="infinity"
        class="motion-safe:group-hover:animate-spin-once size-5"
        style={{ color: colors.accent() }}
      />
    </button>
  );
};
