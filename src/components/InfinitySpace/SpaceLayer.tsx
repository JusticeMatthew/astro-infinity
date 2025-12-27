import type { Component } from "solid-js";
import { Show } from "solid-js";

import { LayerDots } from "./LayerDots";
import { LayerLines } from "./LayerLines";

interface SpaceLayerProps {
  scale: number;
  opacity: number;
  color: string;
  displayMode: "dots" | "lines";
  dotSize: number;
  lineWidth: number;
  cornerRadius: number;
}

export const SpaceLayer: Component<SpaceLayerProps> = (props) => {
  return (
    <div
      class="absolute inset-4 will-change-transform"
      style={{
        transform: `scale3d(${props.scale}, ${props.scale}, 1)`,
        opacity: props.opacity,
      }}>
      <Show
        when={props.displayMode === "dots"}
        fallback={
          <LayerLines
            color={props.color}
            lineWidth={props.lineWidth}
            cornerRadius={props.cornerRadius}
          />
        }>
        <LayerDots
          color={props.color}
          dotSize={props.dotSize}
          cornerRadius={props.cornerRadius}
        />
      </Show>
    </div>
  );
};
