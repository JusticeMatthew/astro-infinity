import type { Component } from "solid-js";
import { For } from "solid-js";

import { type DotPosition } from "~/lib/layerHelpers";

interface LedDotProps {
  color: string;
  size: number;
}

const LedDot: Component<LedDotProps> = (props) => (
  <div
    class="rounded-full"
    style={{
      width: `${props.size}px`,
      height: `${props.size}px`,
      background: props.color,
    }}
  />
);

interface LayerDotsProps {
  color: string;
  dotSize: number;
  positions: DotPosition[];
}

export const LayerDots: Component<LayerDotsProps> = (props) => {
  return (
    <div class="absolute inset-0">
      <For each={props.positions}>
        {(pos) => (
          <div
            class="absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
            }}>
            <LedDot color={props.color} size={props.dotSize} />
          </div>
        )}
      </For>
    </div>
  );
};
