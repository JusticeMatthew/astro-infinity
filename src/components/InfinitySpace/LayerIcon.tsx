import type { IconName } from "~/primitives/Icon";
import { useStore } from "@nanostores/solid";
import { type Component } from "solid-js";

import { hueReady } from "~/lib/store";

import { Icon } from "~/primitives/Icon";

interface LayerIconProps {
  icon: IconName;
  color: string;
  size: number;
  opacity?: number;
  position: { top: string; left: string };
  glideOffset: { x: number; y: number };
  rotation: number;
}

export const LayerIcon: Component<LayerIconProps> = (props) => {
  const isHueReady = useStore(hueReady);

  return (
    <div
      class="layer-icon absolute transition-opacity duration-300 max-lg:hidden max-md:hidden max-sm:hidden"
      style={{
        top: props.position.top,
        left: props.position.left,
        width: `${props.size}px`,
        height: `${props.size}px`,
        transform: `translate3d(calc(-50% + ${props.glideOffset.x}vw), calc(-50% + ${props.glideOffset.y}vh), 0) rotate(${props.rotation}deg)`,
        color: props.color,
        opacity: isHueReady() ? (props.opacity ?? 1) : 0,
      }}>
      <Icon name={props.icon} class="h-full w-full" />
    </div>
  );
};
