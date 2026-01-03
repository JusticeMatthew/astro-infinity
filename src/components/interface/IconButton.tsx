import type { IconName } from "../primitives/Icon";
import type { Component } from "solid-js";

import { useHueColors } from "~/lib/composables/useHueColors";

import { Icon } from "../primitives/Icon";

interface IconButtonProps {
  icon: IconName;
  onClick: () => void;
  isActive?: boolean;
  class?: string;
}

export const IconButton: Component<IconButtonProps> = (props) => {
  const colors = useHueColors();

  return (
    <button
      type="button"
      class={`flex h-full cursor-pointer items-center justify-center rounded transition-opacity max-lg:w-full lg:aspect-square ${props.class ?? ""}`}
      style={{ "background-color": colors.dark() }}
      onClick={props.onClick}>
      <Icon
        name={props.icon}
        class={`size-5`}
        style={{ color: colors.accent() }}
      />
    </button>
  );
};
