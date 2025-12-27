import type { Component } from "solid-js";
import type { DotPosition } from "~/lib/layerHelpers";
import { For } from "solid-js";

interface LayerDotsProps {
  color: string;
  dotSize: number;
  dotPositions: DotPosition[];
}

export const LayerDots: Component<LayerDotsProps> = (props) => {
  return (
    <div class="absolute inset-0" aria-hidden="true">
      <For each={props.dotPositions}>
        {(pos) => (
          <div
            class="absolute rounded-full"
            style={{
              width: `${props.dotSize}px`,
              height: `${props.dotSize}px`,
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
              "background-color": props.color,
            }}
          />
        )}
      </For>
    </div>
  );
};
