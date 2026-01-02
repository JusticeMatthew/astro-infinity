import type { Accessor, Component } from "solid-js";
import type { IconName } from "~/primitives/Icon";

import { useHueColors } from "~/lib/composables/useHueColors";

import { Icon } from "~/primitives/Icon";

interface OptionToggleProps {
  label?: string;
  options: Record<"left" | "right", { label: string; icon: IconName }>;
  leftSelected: Accessor<boolean>;
  onChange: (value: string) => void;
}

export const OptionToggle: Component<OptionToggleProps> = (props) => {
  const colors = useHueColors();

  const isSecondSelected = () => !props.leftSelected();

  return (
    <div
      class="relative grid h-full w-full grid-cols-2 place-self-center rounded text-center lg:w-fit"
      style={{ color: colors.dark(80), "background-color": colors.dark(5) }}>
      <div
        class="absolute top-0 h-full w-1/2 rounded transition-transform duration-200 ease-in-out"
        style={{
          "background-color": colors.dark(10),
          transform: isSecondSelected() ? "translateX(100%)" : "translateX(0)",
        }}
      />
      <button
        type="button"
        class="relative z-10 flex cursor-pointer items-center gap-1 rounded px-4 font-medium transition-all"
        classList={{
          "opacity-40 hover:opacity-70": isSecondSelected(),
        }}
        onClick={() => props.onChange(props.options.left.label)}>
        <Icon
          name={props.options.left.icon}
          style={{ color: colors.accent() }}
          class="size-5"
        />
        {props.options.left.label}
      </button>
      <button
        type="button"
        class="relative z-10 flex cursor-pointer items-center gap-1 rounded px-4 font-medium transition-all"
        classList={{
          "opacity-40 hover:opacity-70": !isSecondSelected(),
        }}
        onClick={() => props.onChange(props.options.right.label)}>
        <Icon
          name={props.options.right.icon}
          style={{ color: colors.accent() }}
          class="size-5"
        />
        {props.options.right.label}
      </button>
    </div>
  );
};
