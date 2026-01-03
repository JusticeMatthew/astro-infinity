import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import { useHueColors } from "~/lib/composables/useHueColors";
import { downloadLoading, triggerDownload } from "~/lib/store";

import { Icon } from "~/primitives/Icon";

export const DownloadButton: Component = () => {
  const colors = useHueColors();
  const isLoading = useStore(downloadLoading);

  return (
    <button
      type="button"
      class="flex h-full w-fit cursor-pointer items-center gap-1 place-self-end rounded px-4 font-medium transition-opacity hover:opacity-75 disabled:cursor-wait disabled:opacity-50"
      style={{ "background-color": colors.dark() }}
      disabled={isLoading()}
      onClick={triggerDownload}>
      <Icon
        name={isLoading() ? "spinner" : "file-image"}
        class={`size-5 ${isLoading() ? "animate-spin" : ""}`}
        style={{ color: colors.accent() }}
      />
      <span style={{ color: colors.dark(80) }}>Export</span>
    </button>
  );
};
