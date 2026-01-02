import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import { motionEnabled, setMotionEnabled } from "~/lib/store";

import { IconButton } from "~/primitives/IconButton";

export const MotionButton: Component = () => {
  const isMotionEnabled = useStore(motionEnabled);

  const handleClick = () => setMotionEnabled(!isMotionEnabled());

  return (
    <IconButton
      icon={isMotionEnabled() ? "pause" : "play"}
      onClick={handleClick}
    />
  );
};
