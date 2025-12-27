import type { IconName } from "./Icon";
import type { Component } from "solid-js";

import { useHueColors } from "~/lib/composables/useHueColors";

import { Icon } from "./Icon";

interface RangeSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  icon: IconName;
  formatValue?: (value: number) => string;
  onChange: (value: number) => void;
}

export const RangeSlider: Component<RangeSliderProps> = (props) => {
  const colors = useHueColors();

  const displayValue = () =>
    props.formatValue ? props.formatValue(props.value) : String(props.value);

  const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    props.onChange(parseInt(target.value, 10));
  };

  return (
    <div
      class="flex h-full grow items-center gap-1.5"
      style={{ color: colors.dark(80) }}>
      <span class="w-12 text-right font-medium">{displayValue()}</span>
      <Icon
        name={props.icon}
        class="size-5 shrink-0"
        style={{ color: colors.accent() }}
      />
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        value={props.value}
        onInput={handleInput}
        class="h-full cursor-pointer appearance-none rounded p-0.5"
        style={{ "background-color": colors.dark(10), color: colors.accent() }}
      />
    </div>
  );
};
