import type { Runtime } from "@astrojs/cloudflare";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  uploadExport: defineAction({
    input: z.object({
      imageData: z.array(z.number()),
    }),
    handler: async (input, context) => {
      if (import.meta.env.DEV) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Export not available in dev mode",
        });
      }

      const { env } = (context.locals as Runtime<Env>).runtime;
      const key = `exports/${Date.now()}-${crypto.randomUUID()}.png`;
      const imageBuffer = new Uint8Array(input.imageData);

      await env.R2_BUCKET.put(key, imageBuffer, {
        httpMetadata: { contentType: "image/png" },
      });

      return { key };
    },
  }),

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
