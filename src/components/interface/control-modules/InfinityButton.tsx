import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import { useHueColors } from "~/lib/composables/useHueColors";
import { infinityBreathing, triggerInfinityBreathe } from "~/lib/store";

import { Icon } from "~/primitives/Icon";

export const InfinityButton: Component = () => {
  const colors = useHueColors();
  const isBreathing = useStore(infinityBreathing);

  return (
    <button
      type="button"
      class="group flex aspect-square h-full cursor-default items-center justify-center rounded transition-opacity"
      style={{ "background-color": colors.dark() }}
      disabled={isBreathing()}
      onClick={triggerInfinityBreathe}>
      <Icon
        name="infinity"
        class="group-hover:animate-spin-once size-5"
        style={{ color: colors.accent() }}
      />
    </button>
  );
};
