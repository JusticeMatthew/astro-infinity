import type { Component } from "solid-js";
import type { IconPosition } from "~/constants/config";
import spaceGroteskWoff2 from "@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2?url";
import { useStore } from "@nanostores/solid";
import clsx from "clsx";
import { toPng } from "html-to-image";
import { For, createEffect, createMemo, createSignal, on } from "solid-js";

import { createAnimationLoop } from "~/lib/composables/createAnimationLoop";
import { createIconAnimations } from "~/lib/composables/createIconAnimations";
import { createWaveSystem } from "~/lib/composables/createWaveSystem";
import { updateFavicon } from "~/lib/favicon";
import {
  generateDotPositions,
  getEchoOpacity,
  getFixedLayerProgress,
  getLinearLayerSettings,
  isLayerDeeper,
} from "~/lib/layerHelpers";
import {
  accentHue,
  displayMode as displayModeStore,
  downloadTrigger,
  hueReady,
  initializeMotionPreference,
  initializeRandomHue,
  layerCount as layerCountStore,
  motionEnabled,
} from "~/lib/store";
import { INFINITY_SPACE_CONFIG as CONFIG } from "~/constants/config";

import { IconEchoLayer } from "./IconEchoLayer";
import { LayerIcon } from "./LayerIcon";
import { SpaceLayer } from "./SpaceLayer";
import { TextContent } from "./TextContent";

interface InfinitySpaceProps {
  class?: string;
}

export const InfinitySpace: Component<InfinitySpaceProps> = (props) => {
  initializeRandomHue();
  initializeMotionPreference();

  let containerRef!: HTMLDivElement;

  const initialLayerCount = layerCountStore.get();
  const [layerProgresses, setLayerProgresses] = createSignal<number[]>(
    Array.from({ length: initialLayerCount }, (_, i) => i / initialLayerCount),
  );

  const currentDisplayMode = useStore(displayModeStore);
  const currentLayerCount = useStore(layerCountStore);
  const currentDownloadTrigger = useStore(downloadTrigger);
  const currentMotionEnabled = useStore(motionEnabled);
  const currentHue = useStore(accentHue);
  const isHueReady = useStore(hueReady);

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
      const layerRatio = Math.max(
        1,
        currentLayerCount() / CONFIG.baseLayerCount,
      );
      const adjustedFlowSpeed = CONFIG.flowSpeed * layerRatio;
      const increment = deltaTime / adjustedFlowSpeed;
      setLayerProgresses((prev) => prev.map((p) => (p + increment) % 1));
      waveSystem.advanceWaves(deltaTime, layerRatio);
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

    const fontResponse = await fetch(spaceGroteskWoff2);
    const fontBlob = await fontResponse.blob();
    const fontBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(fontBlob);
    });

    const fontEmbedCSS = `
      @font-face {
        font-family: 'Space Grotesk Variable';
        font-style: normal;
        font-weight: 300 700;
        src: url(${fontBase64}) format('woff2-variations');
      }
    `;

    const dataUrl = await toPng(containerRef, {
      pixelRatio: 2,
      backgroundColor: "#000000",
      fontEmbedCSS,
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

  const getIconLayer = (depthRatio: number) =>
    Math.round(depthRatio * currentLayerCount());

  const getIconEchoesForLayer = (layerProgress: number) => {
    const layerCount = currentLayerCount();
    return CONFIG.iconPositions
      .map((iconConfig: IconPosition, iconIndex: number) => {
        const iconLayer = getIconLayer(iconConfig.depthRatio);
        const slotProgress = getFixedLayerProgress(iconLayer, layerCount);
        if (!isLayerDeeper(layerProgress, slotProgress)) return null;

        return {
          icon: iconConfig.icon,
          position: { top: iconConfig.top, left: iconConfig.left },
          opacity: getEchoOpacity(layerProgress, slotProgress, layerCount),
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
        class={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 will-change-auto ${isHueReady() ? "opacity-100" : "opacity-0"}`}
        style={{ "transform-style": "preserve-3d" }}>
        <For each={layers()}>
          {(layerIndex) => {
            const progress = () => layerProgresses()[layerIndex] ?? 0;
            const settings = () =>
              getLinearLayerSettings(
                progress() * currentLayerCount(),
                currentLayerCount(),
                CONFIG,
              );
            const color = () => waveSystem.getLayerColor(progress());
            const zIndex = () =>
              currentLayerCount() -
              Math.floor(progress() * currentLayerCount());
            const iconEchoes = createMemo(() =>
              getIconEchoesForLayer(progress()),
            );
            return (
              <>
                <SpaceLayer
                  scale={settings().scale}
                  opacity={settings().opacity}
                  color={color()}
                  displayMode={currentDisplayMode()}
                  dotSize={CONFIG.dotSize}
                  dotPositions={dotPositions()}
                  lineWidth={CONFIG.lineWidth}
                  cornerRadius={CONFIG.lineCornerRadius}
                />
                <IconEchoLayer
                  scale={settings().scale}
                  opacity={settings().opacity}
                  color={color()}
                  icons={iconEchoes()}
                  zIndex={zIndex()}
                  iconSize={CONFIG.icons.size}
                />
              </>
            );
          }}
        </For>
      </div>

      <For each={CONFIG.iconPositions}>
        {(iconConfig, iconIndex) => {
          const iconSlot = () => getIconLayer(iconConfig.depthRatio);
          const settings = () =>
            getLinearLayerSettings(iconSlot(), currentLayerCount(), CONFIG);
          const iconProgress = () => iconSlot() / currentLayerCount();
          const color = () => waveSystem.getLayerColor(iconProgress());
          const zIndex = () => currentLayerCount() - iconSlot();
          return (
            <div
              class="pointer-events-none absolute inset-4 will-change-transform"
              style={{
                transform: `translateZ(${zIndex()}px) scale3d(${settings().scale}, ${settings().scale}, 1)`,
                "transform-origin": "center",
                opacity: settings().opacity,
              }}>
              <div class="relative h-full w-full">
                <LayerIcon
                  icon={iconConfig.icon}
                  color={color()}
                  size={CONFIG.icons.size}
                  position={{ top: iconConfig.top, left: iconConfig.left }}
                  glideOffset={iconAnimations.getGlideOffset(iconIndex())}
                  rotation={iconAnimations.getIconRotation(iconIndex())}
                />
              </div>
            </div>
          );
        }}
      </For>

      <TextContent />
    </div>
  );
};
