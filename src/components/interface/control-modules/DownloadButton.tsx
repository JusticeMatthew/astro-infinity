import type { Component } from "solid-js";

import { useHueColors } from "~/lib/composables/useHueColors";
import { triggerDownload } from "~/lib/store";

import { Icon } from "~/primitives/Icon";

export const DownloadButton: Component = () => {
  const colors = useHueColors();

  return (
    <button
      type="button"
      class="flex h-full w-fit cursor-pointer items-center gap-1 place-self-end rounded px-4 font-medium transition-opacity hover:opacity-75"
      style={{ "background-color": colors.dark() }}
      onClick={triggerDownload}>
      <Icon
        name="file-image"
        class="size-5"
        style={{ color: colors.accent() }}
      />
      <span style={{ color: colors.dark(80) }}>Export</span>
    </button>
  );
};
