import type { IconName } from "./Icon";
import type { Component } from "solid-js";
import { Slider } from "@kobalte/core/slider";

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
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const RangeSlider: Component<RangeSliderProps> = (props) => {
  const colors = useHueColors();

  return (
    <div
      class="flex h-full w-full items-center gap-1.5"
      style={{ color: colors.dark(80) }}>
      <span
        prop:innerText={
          props.formatValue
            ? props.formatValue(Math.floor(props.value))
            : props.value
        }
        class={`text-right font-medium tabular-nums ${props.icon === "layer-group" ? "min-w-[2ch]" : "min-w-[3.5ch]"}`}
      />
      <Icon
        name={props.icon}
        class="size-5 shrink-0"
        style={{ color: colors.accent() }}
      />
      <Slider
        value={[props.value]}
        minValue={props.min}
        maxValue={props.max}
        step={props.step ?? 1}
        onChange={(values) =>
          values[0] !== undefined && props.onChange(values[0])
        }
        onChangeEnd={() => props.onDragEnd?.()}
        class="relative flex h-full grow cursor-pointer items-center">
        <Slider.Track
          class="h-full w-full rounded p-0.5"
          style={{ "background-color": colors.dark(10) }}
          onPointerDown={() => props.onDragStart?.()}>
          <Slider.Fill
            class="h-full rounded-sm"
            style={{ "background-color": colors.dark(10) }}
          />
        </Slider.Track>
        <Slider.Thumb
          class="block h-9 w-2 cursor-pointer rounded-sm transition-all duration-200 ease-out outline-none md:h-11 lg:h-7"
          style={{ "background-color": colors.accent() }}>
          <Slider.Input />
        </Slider.Thumb>
      </Slider>
    </div>
  );
};
