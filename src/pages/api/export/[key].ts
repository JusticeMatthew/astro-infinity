import type { Runtime } from "@astrojs/cloudflare";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  const key = params.key;
  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  const fullKey = `exports/${key}`;
  const { env } = (locals as Runtime<Env>).runtime;
  const object = await env.R2_BUCKET.get(fullKey);

  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", "image/png");
  headers.set("Content-Disposition", `attachment; filename="${key}"`);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
};
