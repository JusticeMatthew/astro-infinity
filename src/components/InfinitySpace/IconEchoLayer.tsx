import type { Component } from "solid-js";
import type { IconName } from "~/primitives/Icon";
import { For } from "solid-js";

import { LayerIcon } from "./LayerIcon";

interface IconData {
  icon: IconName;
  position: { top: string; left: string };
  opacity: number;
  glideOffset: { x: number; y: number };
  rotation: number;
  hideOnMobile?: boolean;
}

interface IconEchoLayerProps {
  scale: number;
  opacity: number;
  color: string;
  icons: IconData[];
  zIndex: number;
  iconSize: number;
}

export const IconEchoLayer: Component<IconEchoLayerProps> = (props) => {
  return (
    <div
      class="pointer-events-none absolute inset-4 will-change-transform"
      style={{
        transform: `translateZ(${props.zIndex}px) scale3d(${props.scale}, ${props.scale}, 1)`,
        opacity: props.opacity,
      }}>
      <For each={props.icons}>
        {(iconData) => (
          <LayerIcon
            icon={iconData.icon}
            color={props.color}
            size={props.iconSize}
            opacity={iconData.opacity}
            position={iconData.position}
            glideOffset={iconData.glideOffset}
            rotation={iconData.rotation}
            hideOnMobile={iconData.hideOnMobile}
          />
        )}
      </For>
    </div>
  );
};
