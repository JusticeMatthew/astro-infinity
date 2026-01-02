import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";
import { Show, createSignal, onCleanup, onMount } from "solid-js";

import { useHueColors } from "~/lib/composables/useHueColors";
import {
  hueReady,
  infinityMode,
  toggleInfinityMode,
  triggerDownload,
} from "~/lib/store";

import { Icon } from "~/primitives/Icon";
import { IconButton } from "~/primitives/IconButton";

import { MotionButton } from "./control-modules/MotionButton";
import { HuePanel } from "./mobile/HuePanel";
import { ViewPanel } from "./mobile/ViewPanel";

type ExpandedPanel = "hue" | "view" | null;

export const MobileControlBar: Component = () => {
  const colors = useHueColors();
  const isHueReady = useStore(hueReady);
  const isInfinityActive = useStore(infinityMode);

  const [expandedPanel, setExpandedPanel] = createSignal<ExpandedPanel>(null);

  let containerRef!: HTMLDivElement;

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setExpandedPanel(null);
    }
  };

  onMount(() => {
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
      class={`fixed right-0 bottom-0 left-0 z-50 transition-opacity duration-300 lg:hidden ${isHueReady() ? "opacity-100" : "opacity-0"}`}
      data-exclude-from-export>
      <Show when={expandedPanel() === "hue"}>
        <HuePanel />
      </Show>
      <Show when={expandedPanel() === "view"}>
        <ViewPanel />
      </Show>

      <div class="flex items-center justify-center gap-3 border-t border-white/5 bg-black p-3">
        <div class="h-8">
          <IconButton
            icon="infinity"
            onClick={toggleInfinityMode}
            isActive={isInfinityActive()}
            spinWhenActive
            class="!cursor-default"
          />
        </div>

        <div class="h-6 w-px" style={{ "background-color": colors.dark(30) }} />

        <button
          type="button"
          class="flex h-8 items-center gap-1.5 rounded px-2 transition-opacity"
          style={{ "background-color": colors.dark() }}
          onClick={() => togglePanel("hue")}>
          <Icon
            name="palette"
            class="size-4"
            style={{ color: colors.accent() }}
          />
          <span class="text-sm" style={{ color: colors.dark(80) }}>
            Hue
          </span>
        </button>

        <button
          type="button"
          class="flex h-8 items-center gap-1.5 rounded px-2 transition-opacity"
          style={{ "background-color": colors.dark() }}
          onClick={() => togglePanel("view")}>
          <Icon name="eye" class="size-4" style={{ color: colors.accent() }} />
          <span class="text-sm" style={{ color: colors.dark(80) }}>
            View
          </span>
        </button>

        <div class="h-8">
          <MotionButton />
        </div>

        <div class="h-8">
          <IconButton icon="file-image" onClick={triggerDownload} />
        </div>
      </div>
    </div>
  );
};
