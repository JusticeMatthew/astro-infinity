import type { Component, JSX } from "solid-js";

import AstroIcon from "~/assets/icons/astro.svg?component-solid";
import AstronautIcon from "~/assets/icons/astronaut.svg?component-solid";
import DropletIcon from "~/assets/icons/droplet.svg?component-solid";
import FileImageIcon from "~/assets/icons/file-image.svg?component-solid";
import HoustonIcon from "~/assets/icons/houston.svg?component-solid";
import LayerGroupIcon from "~/assets/icons/layer-group.svg?component-solid";
import RefreshIcon from "~/assets/icons/refresh.svg?component-solid";
import SolidIcon from "~/assets/icons/solid.svg?component-solid";

export type IconName =
  | "houston"
  | "astronaut"
  | "file-image"
  | "refresh"
  | "astro"
  | "solid"
  | "layer-group"
  | "droplet";

const ICONS: Record<
  IconName,
  Component<JSX.SvgSVGAttributes<SVGSVGElement>>
> = {
  houston: HoustonIcon,
  astronaut: AstronautIcon,
  "file-image": FileImageIcon,
  refresh: RefreshIcon,
  astro: AstroIcon,
  solid: SolidIcon,
  "layer-group": LayerGroupIcon,
  droplet: DropletIcon,
};

interface IconProps {
  name: IconName;
  class?: string;
  style?: JSX.CSSProperties;
}

export const Icon: Component<IconProps> = (props) => {
  const IconComponent = ICONS[props.name];
  return <IconComponent class={props.class} style={props.style} />;
};
