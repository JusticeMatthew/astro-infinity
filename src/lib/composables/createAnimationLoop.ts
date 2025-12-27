import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

interface CreateAnimationLoopOptions {
  canAnimate: () => boolean;
  onFrame: (deltaTime: number, currentTime: number) => void;
  onResize?: (width: number, height: number) => void;
}

export const createAnimationLoop = (options: CreateAnimationLoopOptions) => {
  const [containerSize, setContainerSize] = createSignal({
    width: 0,
    height: 0,
  });

  const [containerRef, setContainerRef] = createSignal<
    HTMLDivElement | undefined
  >();

  onMount(() => {
    let resizeObserver: ResizeObserver | undefined;

    createEffect(() => {
      const ref = containerRef();
      if (!ref) return;

      resizeObserver?.disconnect();

      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
        options.onResize?.(width, height);
      });

      resizeObserver.observe(ref);
    });

    let animationId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      if (!options.canAnimate()) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      options.onFrame(deltaTime, currentTime);

      animationId = requestAnimationFrame(animate);
    };

    createEffect(() => {
      if (options.canAnimate()) {
        lastTime = performance.now();
        animationId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationId);
      }
    });

    onCleanup(() => {
      resizeObserver?.disconnect();
      cancelAnimationFrame(animationId);
    });
  });

  return {
    containerSize,
    setContainerRef,
  };
};
