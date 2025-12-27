import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import { accentHue, clearAllWaves, setHue } from "~/lib/store";

import { RangeSlider } from "~/primitives/RangeSlider";

export const HueSlider: Component = () => {
  const hue = useStore(accentHue);

  const handleChange = (value: number) => {
    clearAllWaves();
    setHue(value, false);
  };

  return (
    <RangeSlider
      value={hue()}
      min={0}
      max={360}
      icon="droplet"
      formatValue={(v) => `${v}°`}
      onChange={handleChange}
    />
  );
};
