import type { Component } from "solid-js";
import type { IconName } from "~/primitives/Icon";
import { For } from "solid-js";

import { getLayerSettings } from "~/lib/layerHelpers";

import { LayerIcon } from "./LayerIcon";

interface IconData {
  icon: IconName;
  position: { top: string; left: string };
  opacity: number;
  glideOffset: { x: number; y: number };
  rotation: number;
}

interface IconEchoLayerProps {
  layerProgress: number;
  color: string;
  icons: IconData[];
  zIndex: number;
  config: {
    bufferScale: number;
    minScale: number;
    transitionDuration: number;
    icons: { size: number };
  };
}

export const IconEchoLayer: Component<IconEchoLayerProps> = (props) => {
  const layer = () => getLayerSettings(props.layerProgress, props.config);

  return (
    <div
      class="pointer-events-none absolute inset-4"
      style={{
        transform: `scale(${layer().scale})`,
        opacity: layer().opacity,
        "z-index": props.zIndex,
        transition: `transform ${props.config.transitionDuration}ms ease-out`,
      }}>
      <For each={props.icons}>
        {(iconData) => (
          <LayerIcon
            icon={iconData.icon}
            color={props.color}
            size={layer().iconSize}
            opacity={iconData.opacity}
            position={iconData.position}
            glideOffset={iconData.glideOffset}
            rotation={iconData.rotation}
          />
        )}
      </For>
    </div>
  );
};
