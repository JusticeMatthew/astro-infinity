// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import solidSvg from "vite-plugin-solid-svg";

export default defineConfig({
  site: "https://astro-infinity.space",
  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [solidJs()],
  vite: {
    plugins: [tailwindcss(), solidSvg()],
  },
});
