import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import { motionEnabled, setMotionEnabled } from "~/lib/store";

import { OptionToggle } from "~/primitives/OptionToggle";

export const MotionToggle: Component = () => {
  const enabled = useStore(motionEnabled);

  return (
    <OptionToggle
      options={["Animated", "Paused"]}
      value={enabled() ? "Animated" : "Paused"}
      onChange={(v) => setMotionEnabled(v === "Animated")}
    />
  );
};
