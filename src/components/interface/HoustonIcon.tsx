import type { Component, JSX } from "solid-js";
import { actions } from "astro:actions";
import { Show, createSignal, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import RocketIcon from "~/assets/icons/rocket.svg?component-solid";

interface HoustonIconProps {
  class?: string | undefined;
  style?: JSX.CSSProperties | undefined;
}

let cachedUrl: string | null = null;
let fetchPromise: Promise<string | null> | null = null;

const [houstonUrl, setHoustonUrl] = createSignal<string | null>(null);

const fetchHoustonWebp = () => {
  if (cachedUrl) {
    setHoustonUrl(cachedUrl);
    return;
  }

  if (!fetchPromise) {
    fetchPromise = actions.getHouston().then(({ data }) => {
      if (data) {
        const uint8Array = new Uint8Array(data);
        const blob = new Blob([uint8Array], { type: "image/webp" });
        cachedUrl = URL.createObjectURL(blob);
        setHoustonUrl(cachedUrl);
      }
      return cachedUrl;
    });
  }
};

export const HoustonIcon: Component<HoustonIconProps> = (props) => {
  onMount(() => {
    if (isServer || import.meta.env.DEV) return;
    fetchHoustonWebp();
  });

  return (
    <Show
      when={houstonUrl()}
      fallback={<RocketIcon class={props.class} style={props.style} />}>
      <div
        class={props.class}
        style={{
          ...props.style,
          "background-color": "currentColor",
          "-webkit-mask-image": `url(${houstonUrl()})`,
          "mask-image": `url(${houstonUrl()})`,
          "-webkit-mask-size": "contain",
          "mask-size": "contain",
          "-webkit-mask-repeat": "no-repeat",
          "mask-repeat": "no-repeat",
          "-webkit-mask-position": "center",
          "mask-position": "center",
        }}
      />
    </Show>
  );
};
