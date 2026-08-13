import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Project High-Lvl homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Project High-Lvl — AI Literacy Is the New Financial Literacy/i);
  assert.match(html, /Rise above/);
  assert.match(html, /33-2614564/);
  assert.match(html, /High Lvl Lab/);
  assert.match(html, /partnerships@projecthighlvl\.org/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|#DONATE_LINK/);
});

test("server-renders the post-donation page", async () => {
  const response = await render("/thank-you");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Your seat/);
  assert.match(html, /Make it monthly/);
  assert.match(html, /Join the next Lab/);
});

test("ships the required brand, social, photo, and governance assets", async () => {
  const paths = [
    "../public/logo.png",
    "../public/favicon.png",
    "../public/og.png",
    "../public/photos/hero-crowd.jpg",
    "../public/photos/founder.jpg",
    "../public/docs/articles-of-incorporation.pdf",
    "../public/docs/bylaws.pdf",
    "../public/docs/conflict-of-interest-policy.pdf",
  ];
  await Promise.all(paths.map((path) => access(new URL(path, import.meta.url))));

  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(page + layout + packageJson, /_sites-preview|react-loading-skeleton|codex-preview/);
  assert.match(layout, /og\.png/);
  assert.match(page, /data-reveal/);
  assert.match(css, /prefers-reduced-motion/);
});
