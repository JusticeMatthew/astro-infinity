import type { Component } from "solid-js";
import { For } from "solid-js";

import { type DotPosition } from "~/lib/layerHelpers";

interface LayerDotsProps {
  color: string;
  dotSize: number;
  positions: DotPosition[];
  containerWidth: number;
  containerHeight: number;
}

export const LayerDots: Component<LayerDotsProps> = (props) => {
  const radius = () => props.dotSize / 2;

  return (
    <svg
      viewBox={`0 0 ${props.containerWidth} ${props.containerHeight}`}
      class="absolute inset-0 h-full w-full">
      <For each={props.positions}>
        {(pos) => (
          <circle
            cx={(pos.x / 100) * props.containerWidth}
            cy={(pos.y / 100) * props.containerHeight}
            r={radius()}
            fill={props.color}
          />
        )}
      </For>
    </svg>
  );
};
