import type { Component } from "solid-js";
import type { DotPosition } from "~/lib/layerHelpers";
import { Show } from "solid-js";

import { getLayerSettings } from "~/lib/layerHelpers";

import { LayerDots } from "./LayerDots";
import { LayerLines } from "./LayerLines";

interface SpaceLayerProps {
  layerProgress: number;
  color: string;
  displayMode: "dots" | "lines";
  config: {
    bufferScale: number;
    minScale: number;
    transitionDuration: number;
    dotSize: number;
    lineWidth: number;
    lineCornerRadius: number;
  };
  dotPositions: DotPosition[];
  containerWidth: number;
  containerHeight: number;
}

export const SpaceLayer: Component<SpaceLayerProps> = (props) => {
  const layer = () => getLayerSettings(props.layerProgress, props.config);

  return (
    <div
      class="absolute inset-4 will-change-transform"
      style={{
        transform: `scale3d(${layer().scale}, ${layer().scale}, 1)`,
        opacity: layer().opacity,
      }}>
      <Show
        when={props.displayMode === "dots"}
        fallback={
          <LayerLines
            color={props.color}
            lineWidth={props.config.lineWidth}
            cornerRadius={props.config.lineCornerRadius}
          />
        }>
        <LayerDots
          color={props.color}
          dotPositions={props.dotPositions}
          dotSize={props.config.dotSize}
          containerWidth={props.containerWidth}
          containerHeight={props.containerHeight}
        />
      </Show>
    </div>
  );
};
