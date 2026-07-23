/**
 * Build-time prerender for social share metadata.
 *
 * GitHub Pages is static hosting and social crawlers (iMessage, WhatsApp,
 * Facebook, Slack, Twitter) don't run JavaScript — so meta tags set from React
 * are never seen. Instead we emit a real HTML file per mix/article:
 *
 *   dist/mix/<slug>/index.html
 *   dist/article/<slug>/index.html
 *
 * Each is a copy of dist/index.html with the title + OG/Twitter tags rewritten
 * to that item's cover image and details. Crawlers read the static tags; real
 * visitors get the same file and the SPA boots and routes as usual.
 *
 * Run after `vite build`.
 */
import { createClient } from "@sanity/client";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const SITE_URL = (process.env.SITE_URL || "https://radioproject.live").replace(
  /\/$/,
  "",
);
const FALLBACK_IMAGE = `${SITE_URL}/rprprp.png`;
const FALLBACK_DESCRIPTION =
  "RADIOproject strives to empower users with their own visual, auditory, and verbal agency. Broadcasting mixes, conducting interviews and writing articles.";

const client = createClient({
  projectId: "yc1lcir6",
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-01-01",
});

/** Portable Text blocks → plain text. */
function ptToPlainText(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b) => b?._type === "block")
    .map((b) => (b.children || []).map((s) => s.text || "").join(""))
    .join(" ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, max = 200) {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Cover image → an absolute, crawler-friendly URL. Sanity's CDN can resize and
 * transcode on the fly; we force JPEG since some crawlers won't render webp.
 */
function coverImageUrl(src) {
  const raw = Array.isArray(src) ? src[0] : src;
  if (!raw || typeof raw !== "string") return FALLBACK_IMAGE;
  if (!/^https?:\/\//i.test(raw)) return FALLBACK_IMAGE;
  if (raw.includes("cdn.sanity.io") && !raw.includes("?")) {
    return `${raw}?w=1200&fit=max&fm=jpg`;
  }
  return raw;
}

/** Replace the content="" of a single meta tag, matched by its name/property. */
function replaceMeta(html, attr, key, value) {
  const re = new RegExp(
    `(<meta\\s+${attr}="${key}"\\s+content=")([^"]*)(")`,
    "i",
  );
  if (!re.test(html)) {
    console.warn(`  ! meta ${attr}="${key}" not found in index.html`);
    return html;
  }
  return html.replace(re, `$1${escapeAttr(value)}$3`);
}

function buildHtml(template, item) {
  const isMix = item.type === "mix";
  const routeBase = isMix ? "mix" : "article";
  const pageUrl = `${SITE_URL}/${routeBase}/${item.slug}/`;
  const image = coverImageUrl(item.src);

  const byline = item.byline ? ` by ${item.byline}` : "";
  const pageTitle = isMix
    ? `${item.title} | Listen on RADIOproject`
    : `${item.title} | Read on RADIOproject`;
  const shareTitle = `${item.title}${byline}`;
  const description =
    truncate(item.description) || `${shareTitle} — RADIOproject`;

  let html = template;
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeAttr(pageTitle)}</title>`,
  );
  html = replaceMeta(html, "name", "title", shareTitle);
  html = replaceMeta(html, "name", "description", description);

  html = replaceMeta(html, "property", "og:type", "article");
  html = replaceMeta(html, "property", "og:url", pageUrl);
  html = replaceMeta(html, "property", "og:title", shareTitle);
  html = replaceMeta(html, "property", "og:description", description);
  html = replaceMeta(html, "property", "og:image", image);

  html = replaceMeta(html, "name", "twitter:url", pageUrl);
  html = replaceMeta(html, "name", "twitter:title", shareTitle);
  html = replaceMeta(html, "name", "twitter:description", description);
  html = replaceMeta(html, "name", "twitter:image", image);

  return html;
}

async function fetchItems() {
  const [mixes, radiograms] = await Promise.all([
    client.fetch(`*[_type == "mix" && defined(slug.current)]{
      "slug": slug.current,
      "type": "mix",
      title,
      "byline": artistName,
      "src": select(count(coverImages) > 0 => coverImages[].asset->url, coverImage.asset->url),
      "description": description
    }`),
    client.fetch(`*[_type == "radiogram" && defined(slug.current)]{
      "slug": slug.current,
      "type": "radiogram",
      title,
      "byline": authorName,
      "src": coverImage.asset->url,
      "description": summary
    }`),
  ]);

  return [...mixes, ...radiograms].map((item) => ({
    ...item,
    description: ptToPlainText(item.description),
  }));
}

async function main() {
  const templatePath = path.join(DIST, "index.html");
  if (!existsSync(templatePath)) {
    throw new Error(`dist/index.html not found — run \`vite build\` first.`);
  }
  const template = await readFile(templatePath, "utf8");

  const items = await fetchItems();
  if (!items.length) {
    console.warn("No items returned from Sanity — nothing to prerender.");
    return;
  }

  let written = 0;
  for (const item of items) {
    if (!item.slug || !item.title) continue;
    const routeBase = item.type === "mix" ? "mix" : "article";
    const outDir = path.join(DIST, routeBase, item.slug);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "index.html"), buildHtml(template, item));
    written += 1;
  }

  console.log(`Prerendered share metadata for ${written} page(s).`);
}

main().catch((err) => {
  console.error("prerender-share-meta failed:", err);
  process.exit(1);
});
