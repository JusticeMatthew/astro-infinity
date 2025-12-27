import type { IconName } from "~/primitives/Icon";
import { type Component } from "solid-js";

import { Icon } from "~/primitives/Icon";

interface LayerIconProps {
  icon: IconName;
  color: string;
  size: number;
  opacity?: number;
  position: { top: string; left: string };
  glideOffset?: { x: number; y: number };
  rotation?: number;
}

export const LayerIcon: Component<LayerIconProps> = (props) => {
  const glideX = () => props.glideOffset?.x ?? 0;
  const glideY = () => props.glideOffset?.y ?? 0;
  const rotation = () => props.rotation ?? 0;

  return (
    <div
      class="max-md:initial absolute max-lg:hidden max-sm:hidden"
      style={{
        top: props.position.top,
        left: props.position.left,
        width: `${props.size}px`,
        height: `${props.size}px`,
        transform: `translate3d(calc(-50% + ${glideX()}vw), calc(-50% + ${glideY()}vh), 0) rotate(${rotation()}deg)`,
        color: props.color,
        opacity: props.opacity ?? 1,
        "backface-visibility": "hidden",
        "shape-rendering": "geometricPrecision",
      }}>
      <Icon name={props.icon} class="h-full w-full" />
    </div>
  );
};
