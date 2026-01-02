import type { Component, JSX } from "solid-js";
import { actions } from "astro:actions";
import clsx from "clsx";
import { Show, createSignal, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import RocketIcon from "~/assets/icons/rocket.svg?component-solid";

interface HoustonIconProps {
  class?: string | undefined;
  style?: JSX.CSSProperties | undefined;
}

interface HoustonUrls {
  frame: string;
  face: string;
}

let cachedUrls: HoustonUrls | null = null;
let fetchPromise: Promise<HoustonUrls | null> | null = null;

const [houstonUrls, setHoustonUrls] = createSignal<HoustonUrls | null>(null);

const fetchHoustonImages = () => {
  if (cachedUrls) {
    setHoustonUrls(cachedUrls);
    return;
  }

  if (!fetchPromise) {
    fetchPromise = actions.getHouston().then(({ data }) => {
      if (data) {
        const frameBlob = new Blob([new Uint8Array(data.frame)], {
          type: "image/webp",
        });
        const faceBlob = new Blob([new Uint8Array(data.face)], {
          type: "image/webp",
        });
        cachedUrls = {
          frame: URL.createObjectURL(frameBlob),
          face: URL.createObjectURL(faceBlob),
        };
        setHoustonUrls(cachedUrls);
      }
      return cachedUrls;
    });
  }
};

export const HoustonIcon: Component<HoustonIconProps> = (props) => {
  onMount(() => {
    if (isServer || import.meta.env.DEV) return;
    fetchHoustonImages();
  });

  const maskStyles = {
    "-webkit-mask-size": "contain",
    "mask-size": "contain",
    "-webkit-mask-repeat": "no-repeat",
    "mask-repeat": "no-repeat",
    "-webkit-mask-position": "center",
    "mask-position": "center",
  } as JSX.CSSProperties;

  return (
    <Show
      when={houstonUrls()}
      fallback={<RocketIcon class={props.class} style={props.style} />}>
      <div
        class={clsx(["overflow-hidden", props.class])}
        style={{ ...props.style, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            "background-color": "currentColor",
            opacity: 0.8,
            filter: "blur(8px)",
            "-webkit-mask-image": `url(${houstonUrls()!.face})`,
            "mask-image": `url(${houstonUrls()!.face})`,
            ...maskStyles,
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            "background-color": "currentColor",
            "-webkit-mask-image": `url(${houstonUrls()!.frame})`,
            "mask-image": `url(${houstonUrls()!.frame})`,
            ...maskStyles,
          }}
        />
      </div>
    </Show>
  );
};
