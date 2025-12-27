import type { Component } from "solid-js";
import type { DotPosition } from "~/lib/layerHelpers";
import { createEffect } from "solid-js";

interface LayerDotsProps {
  color: string;
  dotPositions: DotPosition[];
  dotSize: number;
  containerWidth: number;
  containerHeight: number;
}

export const LayerDots: Component<LayerDotsProps> = (props) => {
  let canvasRef!: HTMLCanvasElement;

  const draw = () => {
    const ctx = canvasRef.getContext("2d");
    if (!ctx) return;

    const w = props.containerWidth;
    const h = props.containerHeight;
    const r = props.dotSize / 2;

    canvasRef.width = w;
    canvasRef.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = props.color;

    for (const pos of props.dotPositions) {
      const cx = (pos.x / 100) * w;
      const cy = (pos.y / 100) * h;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  createEffect(() => {
    props.color;
    props.dotPositions;
    props.containerWidth;
    props.containerHeight;
    draw();
  });

  return <canvas ref={canvasRef} class="absolute inset-0 h-full w-full" />;
};
