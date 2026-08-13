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
  assert.match(html, /phlnonprofit@gmail\.com/);
  assert.match(html, /Name your contribution/);
  assert.doesNotMatch(html, /partnerships@projecthighlvl\.org|Reporting begins with our first published cohort|articles-of-incorporation|conflict-of-interest-policy|bylaws|codex-preview|react-loading-skeleton|#DONATE_LINK/i);
});

test("server-renders the founders and purpose on the dedicated About page", async () => {
  const response = await render("/about");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /19Keys/);
  assert.match(html, /B\. Amechi/);
  assert.match(html, /Mission/);
  assert.match(html, /Vision/);
  assert.match(html, /Access is the opening/);
});

test("server-renders the post-donation page", async () => {
  const response = await render("/thank-you");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Your support/);
  assert.match(html, /Make it monthly/);
  assert.match(html, /Join the next Lab/);
});

test("ships the required brand, social, and photo assets plus the partner form script", async () => {
  const paths = [
    "../public/logo.png",
    "../public/favicon.png",
    "../public/og.png",
    "../public/photos/hero-crowd.jpg",
    "../public/photos/proof.jpg",
    "../google-apps-script/Code.gs",
  ];
  await Promise.all(paths.map((path) => access(new URL(path, import.meta.url))));

  const [page, layout, css, packageJson, script] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../google-apps-script/Code.gs", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(page + layout + packageJson, /_sites-preview|react-loading-skeleton|codex-preview/);
  assert.match(layout, /og\.png/);
  assert.match(page, /data-reveal/);
  assert.match(page, /AKfycbz__QqtcSPHK4sUX_mDnqtxKphXPUmH9-xzpBljJk9UwX24S_419NwyZH1qD9RIb1SxuA/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(script, /1SUHqRUlgOdX5-TvpmfcqQAOPOry5K1PE97eSJqB3Ypg/);
  assert.match(script, /phlnonprofit@gmail\.com/);
});
