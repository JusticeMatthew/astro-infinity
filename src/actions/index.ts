import type { Runtime } from "@astrojs/cloudflare";
import { defineAction } from "astro:actions";

export const server = {
  getHouston: defineAction({
    handler: async (_input, context) => {
      if (import.meta.env.DEV) return null;

      const { env } = (context.locals as Runtime<Env>).runtime;
      const [frameObject, faceObject] = await Promise.all([
        env.R2_BUCKET.get("houston-frame.webp"),
        env.R2_BUCKET.get("houston-face.webp"),
      ]);

      if (!frameObject || !faceObject) return null;

      const [frameBuffer, faceBuffer] = await Promise.all([
        frameObject.arrayBuffer(),
        faceObject.arrayBuffer(),
      ]);

      return {
        frame: Array.from(new Uint8Array(frameBuffer)),
        face: Array.from(new Uint8Array(faceBuffer)),
      };
    },
  }),
};
