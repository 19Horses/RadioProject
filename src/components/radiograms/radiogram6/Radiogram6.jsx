import React, { useState, useMemo, useRef, useEffect } from "react";
import p5 from "p5";
import "./Radiogram6.css";
import receiveALetter from "./RECEIVE A LETTER.webp";

const CDN_BASE = "https://d21zv5r7rdb0xb.cloudfront.net";

const inanimates = [
  {
    src: `${CDN_BASE}/1)%20IS%20YOUR%20KISS%20STUCK%20IN%20TRAFFIC_.webp`,
    alt: "IS YOUR KISS STUCK IN TRAFFIC?",
  },
  {
    src: `${CDN_BASE}/2)%20YES%20IT%20IS%20STUCK%20IN%20TRAFFIC.webp`,
    alt: "YES IT IS STUCK IN TRAFFIC",
  },
  { src: `${CDN_BASE}/3.webp`, alt: "3" },
  {
    src: `${CDN_BASE}/AFTER%20A%20LETTER%20DELIVERED.webp`,
    alt: "AFTER A LETTER DELIVERED",
  },
  {
    src: `${CDN_BASE}/AM%20I%20TIMES%20STRANGER_.webp`,
    alt: "AM I TIMES STRANGER?",
  },
  {
    src: `${CDN_BASE}/AMBER%20LIVES%20TO%20100.webp`,
    alt: "AMBER LIVES TO 100",
  },
  { src: `${CDN_BASE}/BELOVED%20PART%201.webp`, alt: "BELOVED PART 1" },
  { src: `${CDN_BASE}/BELOVED%20PART%202.webp`, alt: "BELOVED PART 2" },
  { src: `${CDN_BASE}/BELOVED%20PART%203.webp`, alt: "BELOVED PART 3" },
  { src: `${CDN_BASE}/CONFESSIONAL%201.webp`, alt: "CONFESSIONAL 1" },
  { src: `${CDN_BASE}/CONFESSIONAL%202.webp`, alt: "CONFESSIONAL 2" },
  { src: `${CDN_BASE}/ELISABETH%20CALL.webp`, alt: "ELISABETH CALL" },
  { src: `${CDN_BASE}/FINALE.webp`, alt: "FINALE" },
  {
    src: `${CDN_BASE}/FLOWER%20INTERROGATION.webp`,
    alt: "FLOWER INTERROGATION",
  },
  {
    src: `${CDN_BASE}/I%20FOUND%20YOU%20IN%20A%20BIRD.webp`,
    alt: "I FOUND YOU IN A BIRD",
  },
  { src: `${CDN_BASE}/IS%20SHE%20HIS%20GHOST_.webp`, alt: "IS SHE HIS GHOST?" },
  { src: `${CDN_BASE}/JUST%20IN%20CASE.webp`, alt: "JUST IN CASE" },
  { src: `${CDN_BASE}/LET%20IT%20BE.webp`, alt: "LET IT BE" },
  { src: `${CDN_BASE}/LET%20IT%20BE%20(2).webp`, alt: "LET IT BE (2)" },
  { src: `${CDN_BASE}/LIFE%20IS%20FOR%20JOY.webp`, alt: "LIFE IS FOR JOY" },
  { src: `${CDN_BASE}/LOVE%20IN%20SOCKS.webp`, alt: "LOVE IN SOCKS" },
  {
    src: `${CDN_BASE}/LOVE_S%20NOCTURAL%20SHAPE.webp`,
    alt: "LOVE'S NOCTURNAL SHAPE",
  },
  { src: `${CDN_BASE}/MARGATE%20FORTUNE.webp`, alt: "MARGATE FORTUNE" },
  { src: `${CDN_BASE}/SNAIL%20BY%20MILES.webp`, alt: "SNAIL BY MILES" },
  { src: `${CDN_BASE}/THAT_S%20MY%20HEART.webp`, alt: "THAT'S MY HEART" },
  {
    src: `${CDN_BASE}/THE%20BUTTERFLY%20DREAMT.webp`,
    alt: "THE BUTTERFLY DREAMT",
  },
  {
    src: `${CDN_BASE}/THE%20FORMALITIES%20OF%20A%20LOVER%20ARRIVED.webp`,
    alt: "THE FORMALITIES OF A LOVER ARRIVED",
  },
  { src: `${CDN_BASE}/THE%20HEADACHE.webp`, alt: "THE HEADACHE" },
  { src: `${CDN_BASE}/THE%20SECOND%20ARROW.webp`, alt: "THE SECOND ARROW" },
  { src: `${CDN_BASE}/TOGETHER.webp`, alt: "TOGETHER" },
  {
    src: `${CDN_BASE}/TWO%20BIRDS%20ONE%20KISS.webp`,
    alt: "TWO BIRDS ONE KISS",
  },
  { src: `${CDN_BASE}/WAX.webp`, alt: "WAX" },
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const IMG_WIDTH = 120;
const HIT_RADIUS = 80;

export const Radiogram6 = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isTopExpanded, setIsTopExpanded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const onLoadedRef = useRef(null);
  onLoadedRef.current = () => setImagesLoaded(true);
  const shuffledInanimates = useMemo(() => shuffleArray(inanimates), []);
  const N = shuffledInanimates.length;
  const spreadAngles = useMemo(
    () => shuffledInanimates.map((_, i) => (i / N) * 360),
    [shuffledInanimates, N],
  );

  const canvasContainerRef = useRef(null);
  const p5Instance = useRef(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  // Live refs so p5 can read React state without stale closures
  const onClickRef = useRef(null);
  const stackRef = useRef([]);
  const isExpandedRef = useRef(false);
  const toggleExpandRef = useRef(null);
  stackRef.current = selectedImages;
  isExpandedRef.current = isTopExpanded;
  toggleExpandRef.current = () => setIsTopExpanded((prev) => !prev);

  onClickRef.current = (image, index) => {
    if (
      selectedImages.length > 0 &&
      selectedImages[selectedImages.length - 1].gridIndex === index
    )
      return;
    setIsTopExpanded(false);
    setSelectedImages((prev) =>
      [
        ...prev,
        {
          ...image,
          id: Date.now(),
          gridIndex: index,
          offsetX: (Math.random() - 0.5) * 60,
          offsetY: (Math.random() - 0.5) * 60,
          rotation: (Math.random() - 0.5) * 12,
        },
      ].slice(-10),
    );
  };

  // Wheel → velocity (window-level so it always fires)
  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      velocityRef.current += (e.deltaY + e.deltaX) * 0.04;
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // p5 sketch
  useEffect(() => {
    const images = shuffledInanimates;
    const angles = spreadAngles;

    const sketch = (p) => {
      // Use native Image (no CORS) instead of p5.loadImage (Fetch API → CORS blocked)
      let imgs = new Array(images.length).fill(null);
      let loadedCount = 0;
      let RADIUS = 420;
      const STACK_W = 350;
      // 0 = top of canvas, 1 = bottom — tune this to move the stack up/down
      const STACK_Y_FRAC = 0.62;
      // 0 = collapsed, 1 = fully expanded — lerped each frame for smooth transition
      let expandProgress = 0;

      p.setup = () => {
        const container = canvasContainerRef.current;
        p.pixelDensity(2); // Avoid 4× memory on Retina — imperceptible for this sketch
        p.createCanvas(container.offsetWidth, window.innerHeight);
        RADIUS = p.height * 0.88;
        p.noStroke();
        p.frameRate(60);
        for (let i = 0; i < images.length; i++) {
          const idx = i;
          const el = new Image();
          el.onload = () => {
            // Pre-decode off the main thread so drawImage never blocks
            el.decode()
              .then(() => {
                imgs[idx] = el;
                loadedCount++;
                if (loadedCount === images.length) onLoadedRef.current();
              })
              .catch(() => {
                imgs[idx] = el;
                loadedCount++;
                if (loadedCount === images.length) onLoadedRef.current();
              });
          };
          el.src = images[idx].src;
        }
      };

      p.draw = () => {
        p.clear();

        // Loading text — visible until all images are ready
        if (loadedCount < images.length) {
          const ctx = p.drawingContext;
          ctx.save();
          ctx.font = "13px NeueHaasDisplayRoman, sans-serif";
          ctx.fillStyle = "rgba(0,0,0,0.4)";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            `loading ${loadedCount} / ${images.length}`,
            p.width / 2,
            p.height / 2,
          );
          ctx.restore();
          return;
        }

        velocityRef.current *= 0.92;
        rotationRef.current += velocityRef.current;

        const cx = p.width / 2;
        const cy = p.height;
        const ctx = p.drawingContext;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.globalAlpha = 1 - expandProgress * 0.85;

        for (let i = 0; i < images.length; i++) {
          const img = imgs[i];
          if (!img || !img.complete || img.naturalWidth === 0) continue;
          const angle = (angles[i] + rotationRef.current) * (Math.PI / 180);
          const ix = Math.sin(angle) * RADIUS;
          const iy = -Math.cos(angle) * RADIUS;
          // Skip images below the canvas (cy = p.height, so iy > 0 means off-screen)
          if (iy > 0) continue;
          const aspect = img.naturalHeight / img.naturalWidth;
          const h = IMG_WIDTH * aspect;

          ctx.save();
          ctx.translate(ix, iy);
          ctx.drawImage(img, -IMG_WIDTH / 2, -h / 2, IMG_WIDTH, h);
          ctx.restore();
        }

        ctx.globalAlpha = 1;
        ctx.restore();

        // Gradient band centered at mid-screen: transparent → #ececec → transparent
        const gradTop = p.height * 0.25;
        const gradBot = p.height * 0.75;
        const grad = ctx.createLinearGradient(0, gradTop, 0, gradBot);
        grad.addColorStop(0, "rgba(236,236,236,0)");
        grad.addColorStop(0.4, "#ececec");
        grad.addColorStop(1, "#ececec");
        ctx.fillStyle = grad;
        ctx.fillRect(0, gradTop, p.width, gradBot - gradTop);

        // Lerp expand progress toward target each frame (0=collapsed, 1=expanded)
        const expandTarget = isExpandedRef.current ? 1 : 0;
        expandProgress += (expandTarget - expandProgress) * 0.14;

        // Draw image stack — rendered above gradient, centered on screen
        const stack = stackRef.current;
        const scx = p.width / 2;
        const scy = p.height * STACK_Y_FRAC;

        for (let s = 0; s < stack.length; s++) {
          const item = stack[s];
          const simg = imgs[item.gridIndex];
          if (!simg || !simg.complete || simg.naturalWidth === 0) continue;
          const isTop = s === stack.length - 1;
          const posFromTop = stack.length - 1 - s;
          const baseOpacity = isTop
            ? 1
            : Math.max(0.25, 1 - posFromTop * 0.04) *
              (1 - expandProgress * 0.9);
          const fadeIn = Math.min(1, (Date.now() - item.id) / 400);
          const opacity = baseOpacity * fadeIn;
          const ep = isTop ? expandProgress : 0;
          const aspect = simg.naturalHeight / simg.naturalWidth;
          const collapsedW = STACK_W;
          const expandedH = p.height * 0.9;
          const expandedW = expandedH / aspect;
          const drawW = collapsedW + (expandedW - collapsedW) * ep;
          const drawH = drawW * aspect;
          const ox = item.offsetX * (1 - ep);
          const oy = item.offsetY * (1 - ep);
          const rot = item.rotation * (Math.PI / 180) * (1 - ep);

          // When expanded, shift centre toward true vertical midpoint (0.5)
          const itemScy = isTop
            ? p.height * (STACK_Y_FRAC + (0.5 - STACK_Y_FRAC) * ep)
            : scy;

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.translate(scx + ox, itemScy + oy);
          ctx.rotate(rot);
          ctx.shadowColor = "rgba(0,0,0,0.22)";
          ctx.shadowBlur = 18;
          ctx.shadowOffsetY = 8;
          ctx.drawImage(simg, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        ctx.shadowColor = "transparent";

        // Cursor: zoom-in/out over stack, pointer over ring
        let cursor = "default";
        const curStack = stackRef.current;
        if (curStack.length > 0) {
          const top = curStack[curStack.length - 1];
          const simg = imgs[top.gridIndex];
          if (simg && simg.complete && simg.naturalWidth > 0) {
            const aspect = simg.naturalHeight / simg.naturalWidth;
            const expandedH = p.height * 0.9;
            const expandedW = expandedH / aspect;
            const drawW = STACK_W + (expandedW - STACK_W) * expandProgress;
            const drawH = drawW * aspect;
            const ox = top.offsetX * (1 - expandProgress);
            const oy = top.offsetY * (1 - expandProgress);
            const tsx = p.width / 2 + ox;
            const tsy =
              p.height *
                (STACK_Y_FRAC + (0.5 - STACK_Y_FRAC) * expandProgress) +
              oy;
            if (
              p.mouseX >= tsx - drawW / 2 &&
              p.mouseX <= tsx + drawW / 2 &&
              p.mouseY >= tsy - drawH / 2 &&
              p.mouseY <= tsy + drawH / 2
            ) {
              cursor = isExpandedRef.current ? "zoom-out" : "zoom-in";
            }
          }
        }
        if (cursor === "default") {
          const mx = p.mouseX - p.width / 2;
          const my = p.mouseY - p.height;
          for (let i = 0; i < images.length; i++) {
            const angle = (angles[i] + rotationRef.current) * (Math.PI / 180);
            const ix = Math.sin(angle) * RADIUS;
            const iy = -Math.cos(angle) * RADIUS;
            if (Math.hypot(mx - ix, my - iy) < HIT_RADIUS) {
              cursor = "pointer";
              break;
            }
          }
        }
        p.canvas.style.cursor = cursor;
      };

      p.mousePressed = () => {
        // Check top stack image first
        const stack = stackRef.current;
        if (stack.length > 0) {
          const top = stack[stack.length - 1];
          const simg = imgs[top.gridIndex];
          if (simg && simg.complete && simg.naturalWidth > 0) {
            const aspect = simg.naturalHeight / simg.naturalWidth;
            const expandedW = (p.height * 0.9) / aspect;
            const drawW = STACK_W + (expandedW - STACK_W) * expandProgress;
            const drawH = drawW * aspect;
            const ox = top.offsetX * (1 - expandProgress);
            const oy = top.offsetY * (1 - expandProgress);
            const cx = p.width / 2 + ox;
            const cy =
              p.height *
                (STACK_Y_FRAC + (0.5 - STACK_Y_FRAC) * expandProgress) +
              oy;
            if (
              p.mouseX >= cx - drawW / 2 &&
              p.mouseX <= cx + drawW / 2 &&
              p.mouseY >= cy - drawH / 2 &&
              p.mouseY <= cy + drawH / 2
            ) {
              toggleExpandRef.current();
              return false;
            }
          }
        }

        // Then check ring
        const mx = p.mouseX - p.width / 2;
        const my = p.mouseY - p.height;
        for (let i = images.length - 1; i >= 0; i--) {
          const angle = (angles[i] + rotationRef.current) * (Math.PI / 180);
          const ix = Math.sin(angle) * RADIUS;
          const iy = -Math.cos(angle) * RADIUS;
          if (Math.hypot(mx - ix, my - iy) < HIT_RADIUS) {
            onClickRef.current(images[i], i);
            return false;
          }
        }
      };

      p.windowResized = () => {
        const container = canvasContainerRef.current;
        if (container) {
          p.resizeCanvas(container.offsetWidth, window.innerHeight);
          RADIUS = p.height * 0.88;
        }
      };
    };

    p5Instance.current = new p5(sketch, canvasContainerRef.current);
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="radiogram-6-container">
      <div ref={canvasContainerRef} className="radiogram-6-canvas" />
      {imagesLoaded && (
        <div className="radiogram-6-letter-wrap">
          <img
            src={receiveALetter}
            alt="Receive a Letter"
            className="radiogram-6-letter"
          />
          <span className="radiogram-6-letter-label"> → Receive a Letter</span>
        </div>
      )}

      {/* <div className="radiogram-6-stack">
        {selectedImages.length === 0 && (
          <div className="stack-placeholder">click to inspect inanimates</div>
        )}
        {selectedImages.map((image, stackIndex) => {
          const isTopImage = stackIndex === selectedImages.length - 1;
          const isExpanded = isTopImage && isTopExpanded;
          const positionFromTop = selectedImages.length - 1 - stackIndex;
          const opacity = isTopImage ? 1 : Math.max(0.25, 1 - positionFromTop * 0.04);

          return (
            <div
              key={image.id}
              className={`stacked-image ${isExpanded ? "stacked-image-expanded" : ""}`}
              style={{
                zIndex: isExpanded ? 9999 : stackIndex,
                "--offset-x": `${image.offsetX}px`,
                "--offset-y": `${image.offsetY}px`,
                "--rotation": `${image.rotation}deg`,
                opacity,
              }}
              onClick={() => handleStackClick(stackIndex)}
            >
              <img src={image.src} alt={image.alt} loading="eager" decoding="async" />
            </div>
          );
        })}
      </div> */}
    </div>
  );
};
