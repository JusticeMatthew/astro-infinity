import "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface InputHTMLAttributes<T> {
      "prop:value"?: string | number;
    }
  }
}

export {};
