import type { Component } from "solid-js";

import { useHueColors } from "~/lib/composables/useHueColors";

interface OptionToggleProps {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
}

export const OptionToggle: Component<OptionToggleProps> = (props) => {
  const colors = useHueColors();

  const isSecondSelected = () => props.value === props.options[1];

  return (
    <div
      class="relative grid h-full grid-cols-2 rounded text-center"
      style={{ color: colors.dark(80), "background-color": colors.dark(3) }}>
      <div
        class="absolute top-0 h-full w-1/2 rounded transition-transform duration-200 ease-in-out"
        style={{
          "background-color": colors.dark(10),
          transform: isSecondSelected() ? "translateX(100%)" : "translateX(0)",
        }}
      />
      <button
        type="button"
        class="relative z-10 cursor-pointer rounded px-4 font-medium transition-colors"
        classList={{
          "opacity-40": isSecondSelected(),
        }}
        onClick={() => props.onChange(props.options[0])}>
        {props.options[0]}
      </button>
      <button
        type="button"
        class="relative z-10 cursor-pointer rounded px-4 font-medium transition-colors"
        classList={{
          "opacity-40": !isSecondSelected(),
        }}
        onClick={() => props.onChange(props.options[1])}>
        {props.options[1]}
      </button>
    </div>
  );
};
