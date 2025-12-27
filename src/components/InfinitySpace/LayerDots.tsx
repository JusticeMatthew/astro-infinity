import { type Component } from "solid-js";

interface LayerDotsProps {
  color: string;
  dotSize: number;
  cornerRadius: number;
}

export const LayerDots: Component<LayerDotsProps> = (props) => {
  return (
    <div
      class="absolute inset-0"
      style={{
        border: `${props.dotSize}px dotted ${props.color}`,
        "border-radius": `${props.cornerRadius}px`,
      }}
    />
  );
};
