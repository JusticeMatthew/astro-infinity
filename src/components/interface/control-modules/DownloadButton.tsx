import type { Component } from "solid-js";

import { useHueColors } from "~/lib/composables/useHueColors";
import { triggerDownload } from "~/lib/store";

import { Icon } from "~/primitives/Icon";

export const DownloadButton: Component = () => {
  const colors = useHueColors();

  return (
    <button
      type="button"
      class="flex h-full cursor-pointer items-center gap-1 rounded px-4 font-medium text-white transition-opacity hover:opacity-75"
      style={{ "background-color": colors.dark() }}
      onClick={triggerDownload}>
      <Icon
        name="file-image"
        class="h-5 w-5"
        style={{ color: colors.accent() }}
      />
      <span style={{ color: colors.dark(80) }}>Export</span>
    </button>
  );
};
