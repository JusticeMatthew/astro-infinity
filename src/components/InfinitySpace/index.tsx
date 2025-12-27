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
  getLayerSettings,
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

    console.log(
      getComputedStyle(document.body).getPropertyValue("--astro-font"),
    );

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
            const layerProgress = () =>
              canAnimate()
                ? (layerProgresses()[layerIndex] ?? 0)
                : getFixedLayerProgress(layerIndex, currentLayerCount());
            const color = () => waveSystem.getLayerColor(layerProgress());
            const zIndex = () => currentLayerCount() - layerIndex;
            const iconEchoes = createMemo(() =>
              getIconEchoesForLayer(layerProgress()),
            );
            return (
              <>
                <SpaceLayer
                  layerProgress={layerProgress()}
                  color={color()}
                  displayMode={currentDisplayMode()}
                  config={LAYER_CONFIG}
                  dotPositions={dotPositions()}
                  containerWidth={containerSize().width}
                  containerHeight={containerSize().height}
                />
                <IconEchoLayer
                  layerProgress={layerProgress()}
                  color={color()}
                  icons={iconEchoes()}
                  zIndex={zIndex()}
                  config={ICON_LAYER_CONFIG}
                />
              </>
            );
          }}
        </For>
      </div>

      <For each={CONFIG.iconPositions}>
        {(iconConfig, iconIndex) => {
          const iconLayer = () => getIconLayer(iconConfig.depthRatio);
          const slotProgress = () =>
            getFixedLayerProgress(iconLayer(), currentLayerCount());
          const layer = () => getLayerSettings(slotProgress(), CONFIG);
          const color = () => waveSystem.getLayerColor(slotProgress());
          const zIndex = () => currentLayerCount() - iconLayer();
          return (
            <div
              class="pointer-events-none absolute inset-4 will-change-transform"
              style={{
                transform: `translateZ(${zIndex()}px) scale3d(${layer().scale}, ${layer().scale}, 1)`,
                "transform-origin": "center",
                opacity: layer().opacity,
              }}>
              <div class="relative h-full w-full">
                <LayerIcon
                  icon={iconConfig.icon}
                  color={color()}
                  size={layer().iconSize}
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
