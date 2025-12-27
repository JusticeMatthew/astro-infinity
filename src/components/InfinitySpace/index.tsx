import type { Component } from "solid-js";
import type { IconPosition } from "~/constants/config";
import { useStore } from "@nanostores/solid";
import clsx from "clsx";
import { For, createEffect, createMemo, createSignal, on } from "solid-js";

import { createAnimationLoop } from "~/lib/composables/createAnimationLoop";
import { createIconAnimations } from "~/lib/composables/createIconAnimations";
import { createWaveSystem } from "~/lib/composables/createWaveSystem";
import { updateFavicon } from "~/lib/favicon";
import {
  generateDotPositions,
  getEchoOpacity,
  getFixedLayerProgress,
  getLayerSettings,
  isLayerDeeper,
} from "~/lib/layerHelpers";
import {
  accentHue,
  displayMode as displayModeStore,
  downloadTrigger,
  initializeMotionPreference,
  initializeRandomHue,
  layerCount as layerCountStore,
  motionEnabled,
} from "~/lib/store";
import { INFINITY_SPACE_CONFIG as CONFIG } from "~/constants/config";

import { IconEchoLayer } from "./IconEchoLayer";
import { LayerCard } from "./LayerCard";
import { LayerIcon } from "./LayerIcon";
import { SpaceLayer } from "./SpaceLayer";

const LAYER_CONFIG = {
  bufferScale: CONFIG.bufferScale,
  minScale: CONFIG.minScale,
  transitionDuration: CONFIG.transitionDuration,
  dotSize: CONFIG.dotSize,
  lineWidth: CONFIG.lineWidth,
  lineCornerRadius: CONFIG.lineCornerRadius,
};

const ICON_LAYER_CONFIG = {
  bufferScale: CONFIG.bufferScale,
  minScale: CONFIG.minScale,
  transitionDuration: CONFIG.transitionDuration,
  icons: CONFIG.icons,
};

interface InfinitySpaceProps {
  class?: string;
}

export const InfinitySpace: Component<InfinitySpaceProps> = (props) => {
  initializeRandomHue();
  initializeMotionPreference();

  let containerRef!: HTMLDivElement;

  const [layerProgresses, setLayerProgresses] = createSignal<number[]>(
    Array.from({ length: CONFIG.layerCount }, (_, i) => i / CONFIG.layerCount),
  );

  const currentDisplayMode = useStore(displayModeStore);
  const currentLayerCount = useStore(layerCountStore);
  const currentDownloadTrigger = useStore(downloadTrigger);
  const currentMotionEnabled = useStore(motionEnabled);
  const currentHue = useStore(accentHue);

  const canAnimate = () => currentMotionEnabled();

  const getFrontmostLayerProgress = () => Math.min(...layerProgresses());

  const waveSystem = createWaveSystem({
    flowSpeed: CONFIG.flowSpeed,
    getFrontmostProgress: getFrontmostLayerProgress,
  });

  const iconAnimations = createIconAnimations({
    iconCount: CONFIG.iconPositions.length,
    spinConfig: CONFIG.icons.spin,
    glideConfig: CONFIG.icons.glide,
    canAnimate,
  });

  createEffect(() => {
    updateFavicon(currentHue());
  });

  const { containerSize, setContainerRef } = createAnimationLoop({
    canAnimate,
    onFrame: (deltaTime, currentTime) => {
      const increment = deltaTime / CONFIG.flowSpeed;
      setLayerProgresses((prev) => prev.map((p) => (p + increment) % 1));
      waveSystem.advanceWaves(deltaTime);
      iconAnimations.updateAnimations(deltaTime, currentTime);
    },
  });

  createEffect(() => {
    setContainerRef(containerRef);
  });

  createEffect(() => {
    const newCount = currentLayerCount();
    setLayerProgresses((prev) => {
      if (newCount === prev.length) return prev;

      const newSpacing = 1 / newCount;
      const frontmost = Math.min(...prev);

      return Array.from({ length: newCount }, (_, i) => {
        const newProgress = frontmost + i * newSpacing;
        return newProgress % 1;
      });
    });
  });

  createEffect(
    on(
      currentDownloadTrigger,
      (trigger) => {
        if (trigger > 0) handleDownload();
      },
      { defer: true },
    ),
  );

  const handleDownload = async () => {
    if (!containerRef) return;

    const { toPng } = await import("html-to-image");

    const dataUrl = await toPng(containerRef, {
      pixelRatio: 2,
      backgroundColor: "#000000",
      skipFonts: true,
      filter: (node) => {
        if (!(node instanceof HTMLElement)) return true;
        if (node.dataset.excludeFromExport !== undefined) return false;
        if (node.tagName === "HEADER") return false;
        return true;
      },
    });

    const link = document.createElement("a");
    link.download = `infinity-space-${new Date().toLocaleDateString()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const layers = createMemo(() =>
    Array.from({ length: currentLayerCount() }, (_, i) => i),
  );

  const dotPositions = createMemo(() =>
    generateDotPositions(
      containerSize().width,
      containerSize().height,
      CONFIG.dotPixelSpacing,
    ),
  );

  const getIconEchoesForLayer = (layerProgress: number) => {
    return CONFIG.iconPositions
      .map((iconConfig: IconPosition, iconIndex: number) => {
        const slotProgress = getFixedLayerProgress(
          iconConfig.layer,
          CONFIG.layerCount,
        );
        if (!isLayerDeeper(layerProgress, slotProgress)) return null;

        return {
          icon: iconConfig.icon,
          position: { top: iconConfig.top, left: iconConfig.left },
          opacity: getEchoOpacity(
            layerProgress,
            slotProgress,
            CONFIG.layerCount,
          ),
          glideOffset: iconAnimations.getGlideOffset(iconIndex),
          rotation: iconAnimations.getIconRotation(iconIndex),
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  };

  return (
    <div
      ref={containerRef}
      class={clsx("absolute inset-0 overflow-hidden", props.class)}
      style={{ perspective: `${CONFIG.perspectiveDistance}px` }}>
      <div
        class="absolute inset-0 flex items-center justify-center will-change-auto"
        style={{ "transform-style": "preserve-3d" }}>
        <For each={layers()}>
          {(layerIndex) => {
            const layerProgress = () =>
              canAnimate()
                ? (layerProgresses()[layerIndex] ?? 0)
                : getFixedLayerProgress(layerIndex, currentLayerCount());
            const color = () => waveSystem.getLayerColor(layerProgress());
            return (
              <SpaceLayer
                layerProgress={layerProgress()}
                color={color()}
                displayMode={currentDisplayMode()}
                config={LAYER_CONFIG}
                dotPositions={dotPositions()}
                containerWidth={containerSize().width}
                containerHeight={containerSize().height}
              />
            );
          }}
        </For>

        <For each={layers()}>
          {(layerIndex) => {
            const layerProgress = () =>
              canAnimate()
                ? (layerProgresses()[layerIndex] ?? 0)
                : getFixedLayerProgress(layerIndex, currentLayerCount());
            const color = () => waveSystem.getLayerColor(layerProgress());
            const zIndex = () =>
              Math.round((1 - layerProgress()) * CONFIG.layerCount);
            const iconEchoes = createMemo(() =>
              getIconEchoesForLayer(layerProgress()),
            );
            return (
              <IconEchoLayer
                layerProgress={layerProgress()}
                color={color()}
                icons={iconEchoes()}
                zIndex={zIndex()}
                config={ICON_LAYER_CONFIG}
              />
            );
          }}
        </For>
      </div>

      <For each={CONFIG.iconPositions}>
        {(iconConfig, iconIndex) => {
          const slotProgress = getFixedLayerProgress(
            iconConfig.layer,
            CONFIG.layerCount,
          );
          const layer = getLayerSettings(slotProgress, CONFIG);
          const color = () => waveSystem.getLayerColor(slotProgress);
          const zIndex = CONFIG.layerCount - iconConfig.layer;
          return (
            <div
              class="pointer-events-none absolute inset-4 will-change-transform"
              style={{
                transform: `translateZ(${zIndex}px) scale3d(${layer.scale}, ${layer.scale}, 1)`,
                "transform-origin": "center",
                opacity: layer.opacity,
                transition: `transform ${CONFIG.transitionDuration}ms ease-out`,
              }}>
              <div class="relative h-full w-full">
                <LayerIcon
                  icon={iconConfig.icon}
                  color={color()}
                  size={layer.iconSize}
                  position={{ top: iconConfig.top, left: iconConfig.left }}
                  glideOffset={iconAnimations.getGlideOffset(iconIndex())}
                  rotation={iconAnimations.getIconRotation(iconIndex())}
                />
              </div>
            </div>
          );
        }}
      </For>

      <LayerCard />
    </div>
  );
};
