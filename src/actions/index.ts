import type { Runtime } from "@astrojs/cloudflare";
import { defineAction } from "astro:actions";

export const server = {
  getHouston: defineAction({
    handler: async (_input, context) => {
      if (import.meta.env.DEV) return null;

      const { env } = (context.locals as Runtime<Env>).runtime;
      const object = await env.R2_BUCKET.get("houston.webp");
      if (!object) return null;

      const arrayBuffer = await object.arrayBuffer();
      return Array.from(new Uint8Array(arrayBuffer));
    },
  }),
};
