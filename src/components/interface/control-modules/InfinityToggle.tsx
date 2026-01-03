import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import { useHueColors } from "~/lib/composables/useHueColors";
import { infinityMode, motionEnabled, toggleInfinityMode } from "~/lib/store";

import { Icon } from "~/primitives/Icon";

export const InfinityToggle: Component = () => {
  const colors = useHueColors();
  const isActive = useStore(infinityMode);
  const isMotionEnabled = useStore(motionEnabled);

  const shouldSpin = () => {
    if (!isMotionEnabled()) return "";
    return isActive() ? "animate-spin" : "group-hover:animate-spin-once";
  };

  return (
    <button
      type="button"
      class="group flex aspect-square h-full cursor-default items-center justify-center rounded transition-opacity disabled:pointer-events-none"
      style={{ "background-color": colors.dark() }}
      disabled={!isMotionEnabled()}
      onClick={toggleInfinityMode}>
      <Icon
        name="infinity"
        class={`aspect-auto! size-5 w-full cursor-default! ${shouldSpin()}`}
        style={{ color: colors.accent() }}
      />
    </button>
  );
};
