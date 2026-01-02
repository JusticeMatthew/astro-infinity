import type { Component, JSX } from "solid-js";
import { actions } from "astro:actions";
import { Show, createSignal, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import RocketIcon from "~/assets/icons/rocket.svg?component-solid";

interface HoustonIconProps {
  class?: string | undefined;
  style?: JSX.CSSProperties | undefined;
}

let cachedSvg: string | null | undefined = null;
let fetchPromise: Promise<string | null | undefined> | null = null;

const [houstonSvg, setHoustonSvg] = createSignal<string | null | undefined>(
  null,
);

const fetchHoustonSvg = () => {
  if (cachedSvg) {
    setHoustonSvg(cachedSvg);
    return;
  }

  if (!fetchPromise) {
    fetchPromise = actions.getHoustonSvg().then(({ data }) => {
      cachedSvg = data;
      setHoustonSvg(data);
      return data;
    });
  }
};

export const HoustonIcon: Component<HoustonIconProps> = (props) => {
  onMount(() => {
    if (isServer || import.meta.env.DEV) return;
    fetchHoustonSvg();
  });

  return (
    <Show
      when={houstonSvg()}
      fallback={<RocketIcon class={props.class} style={props.style} />}>
      <div class={props.class} style={props.style} innerHTML={houstonSvg()!} />
    </Show>
  );
};
