import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import { useHueColors } from "~/lib/composables/useHueColors";
import { infinityMode, motionEnabled, toggleInfinityMode } from "~/lib/store";

import { Icon } from "~/primitives/Icon";

export const InfinityToggle: Component = () => {
  const colors = useHueColors();
  const isActive = useStore(infinityMode);
  const isMotionEnabled = useStore(motionEnabled);

  const shouldSpin = () => isActive() && isMotionEnabled();

  return (
    <button
      type="button"
      class="group flex aspect-square h-full cursor-default items-center justify-center rounded transition-opacity"
      style={{ "background-color": colors.dark() }}
      onClick={toggleInfinityMode}>
      <Icon
        name="infinity"
        class={`size-5 ${shouldSpin() ? "animate-spin" : "group-hover:animate-spin-once"}`}
        style={{ color: colors.accent() }}
      />
    </button>
  );
};
