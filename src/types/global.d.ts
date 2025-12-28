import "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface HTMLAttributes<T> {
      "prop:value"?: string | number;
      "prop:innerText"?: string | number;
    }
  }
}

export {};
