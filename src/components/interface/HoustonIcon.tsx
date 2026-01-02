import type { Component, JSX } from "solid-js";
import { actions } from "astro:actions";
import { Show, createResource } from "solid-js";
import { isServer } from "solid-js/web";

import RocketIcon from "~/assets/icons/rocket.svg?component-solid";

interface HoustonIconProps {
  class?: string | undefined;
  style?: JSX.CSSProperties | undefined;
}

const fetchHoustonSvg = async () => {
  if (import.meta.env.DEV) return null;
  const { data } = await actions.getHoustonSvg();
  return data;
};

export const HoustonIcon: Component<HoustonIconProps> = (props) => {
  const [svgContent] = createResource(
    () => !isServer,
    (shouldFetch) => {
      if (!shouldFetch) return null;
      return fetchHoustonSvg();
    },
  );

  return (
    <Show
      when={svgContent()}
      fallback={<RocketIcon class={props.class} style={props.style} />}>
      <div class={props.class} style={props.style} innerHTML={svgContent()!} />
    </Show>
  );
};
