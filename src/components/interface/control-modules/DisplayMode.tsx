import type { Component } from "solid-js";
import type { DisplayMode as DisplayModeType } from "~/lib/store";
import { useStore } from "@nanostores/solid";

import { displayMode, setDisplayMode } from "~/lib/store";

import { OptionToggle } from "~/primitives/OptionToggle";

export const DisplayMode: Component = () => {
  const mode = useStore(displayMode);

  const handleChange = (value: string) => {
    setDisplayMode(value as DisplayModeType);
  };

  return (
    <OptionToggle
      options={["Dots", "Lines"]}
      value={mode() === "dots" ? "Dots" : "Lines"}
      onChange={(v) => handleChange(v.toLowerCase())}
    />
  );
};
