import React, { useState, useRef, useEffect } from "react";

// 4x4 ordered Bayer threshold matrix (values 0-15).
const bayerMatrix = [
  [15, 7, 13, 5],
  [3, 11, 1, 9],
  [12, 4, 14, 6],
  [0, 8, 2, 10],
];

// The source is downscaled so its longest edge is at most this many pixels
// before dithering. Because the result is scaled back up with
// `image-rendering: pixelated`, the 4x4 pattern reads as chunky retro dots
// instead of an invisibly fine texture on a high-res image.
const DITHER_MAX_EDGE = 500;
// Spreads the 0-15 matrix across the 0-255 grayscale range (16 * 15 ≈ 255).
const DITHER_SCALE = 16;
// Colour of the "dark" dots (#434a47); lit pixels stay white.
const TINT = [67, 74, 71];

// Dithers an already-loaded <img> element straight onto an offscreen canvas
// and returns a data-URL. Reuses the bitmap the browser has already
// downloaded/decoded, so there's no second network request.
function ditherToDataURL(imgEl) {
  const scale = Math.min(
    1,
    DITHER_MAX_EDGE / Math.max(imgEl.naturalWidth, imgEl.naturalHeight),
  );
  const w = Math.max(1, Math.round(imgEl.naturalWidth * scale));
  const h = Math.max(1, Math.round(imgEl.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(imgEl, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  const px = imageData.data;
  const n = 4;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (x + y * w) * 4;
      const gray = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
      const threshold = bayerMatrix[y % n][x % n] * DITHER_SCALE;
      const lit = gray >= threshold;
      px[i] = lit ? 255 : TINT[0];
      px[i + 1] = lit ? 255 : TINT[1];
      px[i + 2] = lit ? 255 : TINT[2];
    }
  }
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}

/**
 * Renders the normal <img> plus a Bayer-dithered overlay that fades in while
 * the item is unfocused. The dither is generated once, from the base image the
 * browser has already loaded, then cached as a data-URL. Desktop only.
 */
export default function DitheredImage({
  src,
  className,
  isFocused,
  isMobile,
  ...imgProps
}) {
  const [ditherUrl, setDitherUrl] = useState(null);
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (isMobile || !src) return;
    const el = imgRef.current;
    if (!el) return;

    let cancelled = false;
    const process = () => {
      if (cancelled) return;
      try {
        setDitherUrl(ditherToDataURL(el));
      } catch (err) {
        // Tainted canvas (missing CORS headers) — skip the overlay and fall
        // back to the plain image.
        console.warn("DitheredImage: could not read pixels for", src, err);
      }
    };

    if (el.complete && el.naturalWidth) {
      // Already loaded/decoded (e.g. cache hit) — dither immediately.
      process();
    } else {
      el.addEventListener("load", process, { once: true });
    }

    return () => {
      cancelled = true;
      el.removeEventListener("load", process);
    };
  }, [src, isMobile]);

  // Dither is a desktop-only effect — on mobile just render the plain image.
  if (isMobile) {
    return <img src={src} className={className} {...imgProps} />;
  }

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "block",
        width: "fit-content",
        height: "100%",
      }}
    >
      <img
        ref={imgRef}
        src={src}
        crossOrigin="anonymous"
        className={className}
        {...imgProps}
      />

      {ditherUrl && (
        <img
          src={ditherUrl}
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            imageRendering: "pixelated",
            pointerEvents: "none",
            opacity: isFocused ? 0 : hovered ? 0.4 : 0.25,
            transition: "opacity 0.4s ease-out",
          }}
        />
      )}
    </span>
  );
}
