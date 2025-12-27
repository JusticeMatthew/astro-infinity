// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import solidSvg from "vite-plugin-solid-svg";

export default defineConfig({
  site: "https://astro-infinity.matthewajustice.workers.dev",
  adapter: cloudflare(),
  integrations: [solidJs()],
  vite: {
    plugins: [tailwindcss(), solidSvg()],
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
