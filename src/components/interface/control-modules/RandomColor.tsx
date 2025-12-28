import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";
import { For, Index, createSignal } from "solid-js";

import { getAccentHSL, toHSLString } from "~/lib/colorUtils";
import { useHueColors } from "~/lib/composables/useHueColors";
import { hueHistory, randomizeHue, setHue } from "~/lib/store";

import { Icon } from "~/primitives/Icon";

const SWATCH_COUNT = 5;

export const RandomColor: Component = () => {
  const colors = useHueColors();
  const history = useStore(hueHistory);
  const [spinKey, setSpinKey] = createSignal(0);

  const swatches = () => {
    const current = colors.hue();
    const hist = history();
    const all = [current, ...hist];
    return Array.from({ length: SWATCH_COUNT }, (_, i) => all[i] ?? null);
  };

  const handleClick = () => {
    setSpinKey((k) => k + 1);
    randomizeHue();
  };

  return (
    <div class="flex h-full items-center gap-1.5 rounded">
      <button
        type="button"
        class="flex aspect-square h-full cursor-pointer items-center justify-center rounded transition-opacity hover:opacity-75"
        style={{ "background-color": colors.dark() }}
        onClick={handleClick}>
        <For each={[spinKey()]}>
          {() => (
            <Icon
              name="refresh"
              class="animate-spin-once size-5"
              style={{ color: colors.accent() }}
            />
          )}
        </For>
      </button>
      <div class="flex h-full items-center gap-1.5">
        <Index each={swatches()}>
          {(swatchHue, index) => {
            const isCurrent = index === 0;
            const swatchColor = () => {
              const h = swatchHue();
              return h !== null
                ? toHSLString(getAccentHSL(h))
                : colors.dark(10);
            };
            return (
              <button
                type="button"
                class="h-7.5 w-4 rounded transition-opacity active:not-first:scale-95"
                classList={{
                  "cursor-pointer hover:opacity-65":
                    swatchHue() !== null && !isCurrent,
                }}
                style={{ "background-color": swatchColor() }}
                disabled={swatchHue() === null || isCurrent}
                onClick={() => {
                  const h = swatchHue();
                  if (h !== null && !isCurrent) setHue(h, true);
                }}
              />
            );
          }}
        </Index>
      </div>
    </div>
  );
};
