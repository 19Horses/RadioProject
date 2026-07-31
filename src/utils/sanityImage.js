// Sanity's CDN resizes and transcodes images on the fly, so we never need to
// ship the full-resolution original. Cover art is uploaded around 1500px square
// PNG (~2MB each); the landing page shows it at roughly 650px tall at most.

const CDN_HOST = "cdn.sanity.io";

/** Widths we ask the CDN for. Capped at the ~1500px originals — no upscaling. */
const DEFAULT_WIDTHS = [400, 640, 900, 1200, 1520];

function isTransformable(url) {
  // A url that already carries a query string was transformed by whoever built
  // it (e.g. the share-meta prerender) — leave it alone.
  return typeof url === "string" && url.includes(CDN_HOST) && !url.includes("?");
}

/**
 * Intrinsic dimensions are encoded in every Sanity asset filename, e.g.
 * `…-1518x1518.png`. Reading them from the url means we know an image's shape
 * before a single byte arrives, so slots can be sized up front.
 *
 * @returns {string|null} a css `aspect-ratio` value, or null if unparseable
 */
export function imageAspectRatio(url) {
  if (typeof url !== "string") return null;
  const match = url.match(/-(\d+)x(\d+)\.\w+(?:\?|$)/);
  if (!match) return null;
  const [, width, height] = match;
  if (!Number(width) || !Number(height)) return null;
  return `${width} / ${height}`;
}

/**
 * A single sized url. `auto=format` lets the CDN serve webp/avif to browsers
 * that accept it, and `fit=max` never scales past the original.
 */
export function sanityImage(url, { width, quality = 72 } = {}) {
  if (!isTransformable(url)) return url;
  const params = new URLSearchParams({ auto: "format", fit: "max", q: quality });
  if (width) params.set("w", width);
  return `${url}?${params}`;
}

/**
 * A `srcSet` covering the usual display sizes. Paired with a `sizes` hint the
 * browser picks a width itself, accounting for device pixel ratio.
 */
export function sanitySrcSet(url, { widths = DEFAULT_WIDTHS, quality } = {}) {
  if (!isTransformable(url)) return undefined;
  return widths
    .map((width) => `${sanityImage(url, { width, quality })} ${width}w`)
    .join(", ");
}
