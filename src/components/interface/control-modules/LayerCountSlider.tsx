import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import { layerCount, setLayerCount } from "~/lib/store";

import { RangeSlider } from "~/components/primitives/RangeSlider";

export const LayerCountSlider: Component = () => {
  const count = useStore(layerCount);

  return (
    <RangeSlider
      value={count()}
      min={5}
      max={30}
      icon="layer-group"
      onChange={setLayerCount}
    />
  );
};
