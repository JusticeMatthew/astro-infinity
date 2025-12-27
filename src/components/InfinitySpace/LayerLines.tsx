import { type Component } from "solid-js";

interface LayerLinesProps {
  color: string;
  lineWidth: number;
  cornerRadius: number;
}

export const LayerLines: Component<LayerLinesProps> = (props) => {
  return (
    <div
      class="absolute inset-0"
      style={{
        border: `${props.lineWidth}px solid ${props.color}`,
        "border-radius": `${props.cornerRadius}px`,
      }}
    />
  );
};
