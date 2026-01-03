import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";
import { Show, createSignal, onCleanup, onMount } from "solid-js";

import { useHueColors } from "~/lib/composables/useHueColors";
import { downloadLoading, hueReady, triggerDownload } from "~/lib/store";

import { Icon } from "~/primitives/Icon";
import { IconButton } from "~/interface/IconButton";
import { MotionButton } from "~/interface/control-modules/MotionButton";
import { HuePanel } from "~/interface/mobile/HuePanel";
import { ViewPanel } from "~/interface/mobile/ViewPanel";

import { InfinityToggle } from "../control-modules/InfinityToggle";

type ExpandedPanel = "hue" | "view" | null;

export const MobileControlBar: Component = () => {
  const colors = useHueColors();
  const isHueReady = useStore(hueReady);
  const isLoading = useStore(downloadLoading);

  const [expandedPanel, setExpandedPanel] = createSignal<ExpandedPanel>(null);

  let containerRef!: HTMLDivElement;

  onMount(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef && !containerRef.contains(e.target as Node)) {
        setExpandedPanel(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    onCleanup(() => {
      document.removeEventListener("click", handleClickOutside);
    });
  });

  const togglePanel = (panel: ExpandedPanel) => {
    setExpandedPanel((current) => (current === panel ? null : panel));
  };

  return (
    <div
      ref={containerRef}
      class={`fixed right-0 bottom-0 left-0 z-50 flex max-h-18 min-h-12 justify-center border-t border-white/5 bg-black transition-opacity duration-300 lg:hidden ${isHueReady() ? "opacity-100" : "opacity-0"}`}
      data-exclude-from-export>
      <div class="absolute right-0 bottom-full left-0">
        <Show when={expandedPanel() === "hue"}>
          <HuePanel />
        </Show>
        <Show when={expandedPanel() === "view"}>
          <ViewPanel />
        </Show>
      </div>

      <div class="flex w-full max-w-xl flex-row items-center justify-center gap-2 p-3">
        <div class="aspect-square h-full flex-1">
          <InfinityToggle />
        </div>

        <div
          class="mx-0.5 h-full w-px"
          style={{ "background-color": colors.dark(30) }}
        />

        <button
          type="button"
          class="flex h-full flex-1 cursor-pointer items-center justify-center gap-2 rounded px-3 transition-opacity"
          style={{
            "background-color":
              expandedPanel() === "hue" ? colors.accent() : colors.dark(),
          }}
          onClick={() => togglePanel("hue")}>
          <Icon
            name="palette"
            class="size-5"
            style={{
              color:
                expandedPanel() === "hue" ? colors.dark() : colors.accent(),
            }}
          />
          <span
            class="font-medium"
            style={{
              color:
                expandedPanel() === "hue" ? colors.dark() : colors.dark(80),
            }}>
            Hue
          </span>
        </button>

        <button
          type="button"
          class="flex h-full flex-1 cursor-pointer items-center justify-center gap-2 rounded px-3 transition-opacity"
          style={{
            "background-color":
              expandedPanel() === "view" ? colors.accent() : colors.dark(),
          }}
          onClick={() => togglePanel("view")}>
          <Icon
            name="eye"
            class="size-5"
            style={{
              color:
                expandedPanel() === "view" ? colors.dark() : colors.accent(),
            }}
          />
          <span
            class="font-medium"
            style={{
              color:
                expandedPanel() === "view" ? colors.dark() : colors.dark(80),
            }}>
            View
          </span>
        </button>

        <div class="h-full flex-1">
          <MotionButton />
        </div>

        <div class="h-full flex-1">
          <IconButton
            icon={isLoading() ? "spinner" : "file-image"}
            onClick={triggerDownload}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
