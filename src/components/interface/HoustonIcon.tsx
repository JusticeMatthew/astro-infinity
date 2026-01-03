import type { Component, JSX } from "solid-js";
import { actions } from "astro:actions";
import { makeTimer } from "@solid-primitives/timer";
import { Show, createEffect, createSignal, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import { darkenHSL } from "~/lib/colorUtils";

import { Icon } from "~/primitives/Icon";

interface HoustonIconProps {
  class?: string | undefined;
  style?: JSX.CSSProperties | undefined;
  color: string | undefined;
}

interface HoustonUrls {
  frame: string;
  face: string;
}

let cachedUrls: HoustonUrls | null = null;
let fetchPromise: Promise<HoustonUrls | null> | null = null;

const [houstonUrls, setHoustonUrls] = createSignal<HoustonUrls | null>(null);
const [showRocket, setShowRocket] = createSignal(true);

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

createEffect(() => {
  if (houstonUrls()) {
    makeTimer(() => setShowRocket(false), 500, setTimeout);
  }
});

export const HoustonIcon: Component<HoustonIconProps> = (props) => {
  const faceColor = () => props.color && darkenHSL(props.color, 0.4);

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
    <div
      class={`overflow-hidden${props.class ? ` ${props.class}` : ""}`}
      style={{ ...props.style, position: "relative" }}>
      <Show when={showRocket()}>
        <Icon
          name="rocket"
          class="absolute inset-0 h-full w-full transition-opacity duration-500 ease-out"
          classList={{ "opacity-0": !!houstonUrls() }}
        />
      </Show>
      <Show when={houstonUrls()}>
        <div
          class="h-full w-full transition-opacity duration-500 ease-in"
          classList={{
            "opacity-0": showRocket(),
            "opacity-100": !showRocket(),
          }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              "background-color": faceColor() ?? "currentColor",
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
    </div>
  );
};
