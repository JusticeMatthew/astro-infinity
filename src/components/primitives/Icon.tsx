import type { Component, JSX } from "solid-js";

export type IconName =
  | "houston"
  | "astronaut"
  | "file-image"
  | "refresh"
  | "astro"
  | "solid"
  | "layer-group"
  | "droplet";

interface IconProps {
  name: IconName;
  class?: string;
  style?: JSX.CSSProperties;
}

export const Icon: Component<IconProps> = (props) => (
  <svg class={props.class} style={props.style}>
    <use href={`#icon-${props.name}`} />
  </svg>
);
