// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://astro-infinity.matthewajustice.workers.dev",
  integrations: [solidJs()],
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Poppins",
        cssVariable: "--astro-font",
        weights: [400, 700],
        styles: ["normal"],
        subsets: ["latin"],
      },
    ],
  },
});
