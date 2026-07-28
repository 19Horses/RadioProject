import React, { useRef, useEffect, useState } from "react";
import "./Radiogram6.css";
import receiveALetter from "./RECEIVE A LETTER.webp";
import handFilter from "./hand-filter.png";

// Finger hotspots as % of image dimensions (width x height)
// Left hand, palm facing viewer: from right to left — thumb, index, middle, ring, pinky
const FINGER_ZONES = [
  { cat: "a", label: "a", cx: 83, cy: 54 }, // thumb (lower-right)
  { cat: "b", label: "b", cx: 70, cy:  8 }, // pointer / index finger
  { cat: "c", label: "c", cx: 53, cy:  4 }, // middle finger
];

const HandFilter = ({ activeCategory, onCategoryClick }) => {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="radiogram-6-hand-filter">
      <img src={handFilter} alt="filter hand" className="radiogram-6-hand-img" draggable={false} />
      {FINGER_ZONES.map(({ cat, label, cx, cy }) => {
        const isActive = activeCategory === cat;
        const isHovered = hovered === cat;
        return (
          <button
            key={cat}
            className={`radiogram-6-finger-btn${isActive ? " radiogram-6-finger-btn--active" : ""}${isHovered ? " radiogram-6-finger-btn--hovered" : ""}`}
            style={{ left: `${cx}%`, top: `${cy}%` }}
            onClick={() => onCategoryClick(cat)}
            onMouseEnter={() => setHovered(cat)}
            onMouseLeave={() => setHovered(null)}
            title={label}
          >
            {(isActive || isHovered) && (
              <span className="radiogram-6-finger-label">{label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

const CDN_BASE = "https://d21zv5r7rdb0xb.cloudfront.net";
const FORMSPREE_ID = "mnjrqrqz";

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
].map((item, i) => ({ ...item, cat: ["a", "b", "c"][i % 3] }));

const STACK_ROTS = [8, -12, 5, -9, 13, -6, 10, -14, 3, -7, 11, -4];
const stackRot = (i) => STACK_ROTS[i % STACK_ROTS.length];

// ── Infinite lerp grid ──────────────────────────────────────────────────
// A fixed pool of tiles lives inside a translated layer. Panning only moves
// that layer; whenever the pan crosses a cell boundary the tiles that fell
// off one edge are recycled to the opposite one, so the lattice never ends.
const TILE_DESKTOP = { w: 150, h: 195, gapX: 132, gapY: 108 };
const TILE_MOBILE = { w: 104, h: 135, gapX: 72, gapY: 58 };
const BUFFER = 1; // extra ring of tiles kept just outside the viewport
const PAN_LERP = 0.075; // how heavily the grid trails the pointer
const ZOOM_LERP = 0.07;
const WHEEL_MULT = 1.1;
const FLICK = 130; // px of glide per (px/ms) of release velocity
const FLICK_MAX = 1100;
const DRAG_SLOP = 5; // px of travel before a press stops counting as a click
const EXPAND_ZOOM = 1.18; // grid pushes outward while a letter is open
const MAX_TILT = 26;
const HOVER_SCALE = 1.24;
const FADE_MS = 260;
const FADE_STAGGER = 22;

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// Row-to-row stride through the image list. Coprime with the list length so a
// column walks the whole set before repeating — stops the lattice banding.
const strideFor = (n) => {
  for (let k = Math.round(Math.sqrt(n)) + 1; k < n; k++) {
    if (gcd(k, n) === 1) return k;
  }
  return 1;
};

const shuffled = (arr) => [...arr].sort(() => Math.random() - 0.5);

const ExpandedCard = ({ src, alt, from, getToRect, onClose, onStartClose }) => {
  const imgRef = useRef(null);
  const closingRef = useRef(false);
  const ease = "cubic-bezier(0.4, 0, 0.2, 1)";

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const sidebarLeft =
      window.innerWidth > 768 ? window.innerWidth * 0.04 + 284 : 0;
    const availW = window.innerWidth - sidebarLeft;
    const availH = window.innerHeight;
    const aspect = from.width / from.height;
    const targetH = Math.min(availH * 0.9, (availW * 0.9) / aspect);
    const targetW = targetH * aspect;
    const targetTop = (availH - targetH) / 2;
    const targetLeft = sidebarLeft + (availW - targetW) / 2;

    // Initial position already applied via JSX style prop — just start the transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const tr = `top 0.52s ${ease}, left 0.52s ${ease}, width 0.52s ${ease}, height 0.52s ${ease}, transform 0.52s ${ease}`;
        Object.assign(img.style, {
          transition: tr,
          top: `${targetTop}px`,
          left: `${targetLeft}px`,
          width: `${targetW}px`,
          height: `${targetH}px`,
          transform: "none",
        });
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    onStartClose();
    const img = imgRef.current;
    if (!img) {
      onClose();
      return;
    }
    const to = getToRect();
    // Fade to invisible in the last 80ms so the unmount pop is invisible
    const tr = `top 0.45s ${ease}, left 0.45s ${ease}, width 0.45s ${ease}, height 0.45s ${ease}, transform 0.45s ${ease}, opacity 0.08s ease 0.37s`;
    Object.assign(img.style, {
      transition: tr,
      top: `${to.top}px`,
      left: `${to.left}px`,
      width: `${to.width}px`,
      height: `${to.height}px`,
      transform: `rotate(${to.rotation}deg)`,
      opacity: "0",
    });
    setTimeout(onClose, 450);
  };

  return (
    <div className="radiogram-6-expanded" onClick={handleClose}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{
          position: "fixed",
          top: `${from.top}px`,
          left: `${from.left}px`,
          width: `${from.width}px`,
          height: `${from.height}px`,
          transform: `rotate(${from.rotation}deg)`,
          objectFit: "contain",
          maxWidth: "none",
          margin: "0",
        }}
      />
    </div>
  );
};

export const Radiogram6 = () => {
  const containerRef = useRef(null);
  const [stack, setStack] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [expandedFrom, setExpandedFrom] = useState(null);
  const [snailMailOpen, setSnailMailOpen] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [btnMousePos, setBtnMousePos] = useState({ x: 0, y: 0 });
  const [snailMailForm, setSnailMailForm] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
  });
  const [submitState, setSubmitState] = useState(null); // null | 'sending' | 'sent' | 'error'
  const topCardRef = useRef(null);
  const selectedRef = useRef(false);
  useEffect(() => {
    selectedRef.current = expanded;
  }, [expanded]);

  const [dims, setDims] = useState({ w: 0, h: 0, tileW: TILE_DESKTOP.w, tileH: TILE_DESKTOP.h });
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Grid state — all in refs so the RAF closure always sees current values
  const zoomLayerRef = useRef(null);
  const gridRef = useRef(null);
  const poolRef = useRef([]);
  const geomRef = useRef({
    tileW: TILE_DESKTOP.w,
    tileH: TILE_DESKTOP.h,
    stepX: TILE_DESKTOP.w + TILE_DESKTOP.gapX,
    stepY: TILE_DESKTOP.h + TILE_DESKTOP.gapY,
    cols: 0,
    rows: 0,
  });
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef({ cur: 1, target: 1 });
  const lastStartRef = useRef({ col: null, row: null });
  const rafRef = useRef(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    vx: 0,
    vy: 0,
  });
  const hoverRef = useRef(null);
  // Delegated tile clicks fire from a listener bound once, so route them
  // through a ref that always points at the latest handleSelect
  const selectRef = useRef(() => {});
  const imagesRef = useRef(shuffled(inanimates));
  const strideRef = useRef(strideFor(inanimates.length));
  const selectedSrcsRef = useRef(new Set());

  const [activeCategory, setActiveCategory] = useState(null);
  const filterTimeoutRef = useRef(null);

  // ── Tile plumbing ─────────────────────────────────────────────────────
  const resetTileArt = (tile) => {
    tile.hovered = false;
    tile.el.style.zIndex = "";
    tile.img.style.transform = "";
    tile.img.style.filter = "";
  };

  // Points a pooled tile at a new lattice cell. Only touches the DOM for the
  // properties that actually changed — this runs for every tile that crosses
  // an edge, so it stays on the hot path.
  const assignTile = (tile, col, row) => {
    const images = imagesRef.current;
    if (!images.length) return;
    const { stepX, stepY } = geomRef.current;

    if (tile.col !== col || tile.row !== row) {
      tile.el.style.transform = `translate3d(${col * stepX}px, ${row * stepY}px, 0)`;
      tile.col = col;
      tile.row = row;
    }

    const n = images.length;
    const idx = (((row * strideRef.current + col) % n) + n) % n;
    const item = images[idx];
    if (tile.src !== item.src) {
      tile.img.src = item.src;
      tile.img.alt = item.alt;
      tile.src = item.src;
    }

    if (tile.hovered) resetTileArt(tile);
    tile.el.style.opacity = selectedSrcsRef.current.has(item.src) ? "0.4" : "1";
  };

  const reposition = (force) => {
    const g = geomRef.current;
    const pool = poolRef.current;
    if (!pool.length) return;
    const startCol = Math.floor(-posRef.current.x / g.stepX) - BUFFER;
    const startRow = Math.floor(-posRef.current.y / g.stepY) - BUFFER;
    if (
      !force &&
      startCol === lastStartRef.current.col &&
      startRow === lastStartRef.current.row
    ) {
      return;
    }
    lastStartRef.current = { col: startCol, row: startRow };
    let i = 0;
    for (let r = 0; r < g.rows; r++) {
      for (let c = 0; c < g.cols; c++) {
        const tile = pool[i++];
        if (tile) assignTile(tile, startCol + c, startRow + r);
      }
    }
  };

  const applyTransform = () => {
    if (gridRef.current) {
      gridRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
    }
    if (zoomLayerRef.current) {
      zoomLayerRef.current.style.transform = `scale(${zoomRef.current.cur})`;
    }
    reposition(false);
  };

  const startLoop = () => {
    if (rafRef.current) return;
    const step = () => {
      const p = posRef.current;
      const t = targetRef.current;
      const z = zoomRef.current;
      p.x += (t.x - p.x) * PAN_LERP;
      p.y += (t.y - p.y) * PAN_LERP;
      z.cur += (z.target - z.cur) * ZOOM_LERP;
      applyTransform();

      const moving =
        dragRef.current.active ||
        Math.abs(t.x - p.x) > 0.05 ||
        Math.abs(t.y - p.y) > 0.05 ||
        Math.abs(z.target - z.cur) > 0.0004;

      if (moving) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        p.x = t.x;
        p.y = t.y;
        z.cur = z.target;
        applyTransform();
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  // ── Pool construction / resize ────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const grid = gridRef.current;
    if (!container || !grid) return;

    const pool = poolRef.current;

    const makeTile = () => {
      const el = document.createElement("div");
      el.className = "radiogram-6-tile";
      const img = document.createElement("img");
      img.className = "radiogram-6-tile-img";
      img.draggable = false;
      el.appendChild(img);
      grid.appendChild(el);
      return { el, img, col: null, row: null, src: null, hovered: false };
    };

    const update = () => {
      const r = container.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const t = r.width <= 768 ? TILE_MOBILE : TILE_DESKTOP;
      const stepX = t.w + t.gapX;
      const stepY = t.h + t.gapY;
      const cols = Math.ceil(r.width / stepX) + BUFFER * 2 + 1;
      const rows = Math.ceil(r.height / stepY) + BUFFER * 2 + 1;
      const first = geomRef.current.cols === 0;
      geomRef.current = { tileW: t.w, tileH: t.h, stepX, stepY, cols, rows };

      const need = cols * rows;
      while (pool.length > need) {
        const gone = pool.pop();
        gone.el.remove();
      }
      while (pool.length < need) pool.push(makeTile());
      pool.forEach((tile) => {
        tile.el.style.width = `${t.w}px`;
        tile.el.style.height = `${t.h}px`;
      });

      // Start with a letter centred rather than a cell corner at the origin
      if (first) {
        posRef.current = { x: (r.width - t.w) / 2, y: (r.height - t.h) / 2 };
        targetRef.current = { ...posRef.current };
      }

      lastStartRef.current = { col: null, row: null };
      applyTransform();
      setDims({ w: r.width, h: r.height, tileW: t.w, tileH: t.h });
    };

    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      pool.forEach((tile) => tile.el.remove());
      pool.length = 0;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pan: drag, wheel, touch ───────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const grid = gridRef.current;
    if (!container || !grid) return;

    const sampleVelocity = (x, y) => {
      const d = dragRef.current;
      const now = performance.now();
      const dt = now - d.lastT;
      if (dt > 0 && dt < 80) {
        d.vx = d.vx * 0.5 + ((x - d.lastX) / dt) * 0.5;
        d.vy = d.vy * 0.5 + ((y - d.lastY) / dt) * 0.5;
      }
      d.lastX = x;
      d.lastY = y;
      d.lastT = now;
    };

    const beginDrag = (x, y) => {
      const d = dragRef.current;
      d.active = true;
      d.moved = false;
      d.startX = x;
      d.startY = y;
      d.originX = targetRef.current.x;
      d.originY = targetRef.current.y;
      d.lastX = x;
      d.lastY = y;
      d.lastT = performance.now();
      d.vx = 0;
      d.vy = 0;
      container.classList.add("radiogram-6-container--grabbing");
      startLoop();
    };

    const moveDrag = (x, y) => {
      const d = dragRef.current;
      if (!d.active) return;
      sampleVelocity(x, y);
      if (Math.abs(x - d.startX) > DRAG_SLOP || Math.abs(y - d.startY) > DRAG_SLOP) {
        d.moved = true;
      }
      targetRef.current.x = d.originX + (x - d.startX);
      targetRef.current.y = d.originY + (y - d.startY);
      startLoop();
    };

    const endDrag = () => {
      const d = dragRef.current;
      if (!d.active) return;
      d.active = false;
      container.classList.remove("radiogram-6-container--grabbing");
      // Flick: fold the release velocity into the target and let the lerp glide
      const fx = Math.max(-FLICK_MAX, Math.min(FLICK_MAX, d.vx * FLICK));
      const fy = Math.max(-FLICK_MAX, Math.min(FLICK_MAX, d.vy * FLICK));
      targetRef.current.x += fx;
      targetRef.current.y += fy;
      startLoop();
    };

    const onMouseDown = (e) => {
      if (selectedRef.current || e.button !== 0) return;
      clearHover();
      beginDrag(e.clientX, e.clientY);
    };
    const onMouseMove = (e) => moveDrag(e.clientX, e.clientY);
    const onMouseUp = () => endDrag();

    const onWheel = (e) => {
      if (selectedRef.current) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1;
      targetRef.current.x -= e.deltaX * unit * WHEEL_MULT;
      targetRef.current.y -= e.deltaY * unit * WHEEL_MULT;
      startLoop();
    };

    const onTouchStart = (e) => {
      if (selectedRef.current || e.touches.length !== 1) return;
      beginDrag(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e) => {
      if (!dragRef.current.active || e.touches.length !== 1) return;
      e.preventDefault();
      moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => endDrag();

    // ── Hover tilt, delegated so the pool can stay plain DOM ─────────────
    const clearHover = () => {
      if (hoverRef.current) {
        resetTileArt(hoverRef.current);
        hoverRef.current = null;
      }
    };

    const tileFor = (target) => {
      const el = target?.closest?.(".radiogram-6-tile");
      if (!el) return null;
      return poolRef.current.find((tile) => tile.el === el) || null;
    };

    const onGridMove = (e) => {
      if (dragRef.current.active || selectedRef.current || dims.w <= 768) return;
      const tile = tileFor(e.target);
      if (!tile) {
        clearHover();
        return;
      }
      if (hoverRef.current && hoverRef.current !== tile) resetTileArt(hoverRef.current);
      hoverRef.current = tile;
      tile.hovered = true;
      tile.el.style.zIndex = "3";

      const r = tile.el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      tile.img.style.transform = `perspective(600px) rotateX(${(-ny * MAX_TILT).toFixed(2)}deg) rotateY(${(nx * MAX_TILT).toFixed(2)}deg) scale(${HOVER_SCALE})`;
      tile.img.style.filter = "drop-shadow(0 16px 32px rgba(0,0,0,0.35))";
    };

    const onGridLeave = () => clearHover();

    const onGridClick = (e) => {
      if (dragRef.current.moved) return;
      const tile = tileFor(e.target);
      if (tile?.src) selectRef.current(tile.src);
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, { passive: true });
    grid.addEventListener("mousemove", onGridMove);
    grid.addEventListener("mouseleave", onGridLeave);
    grid.addEventListener("click", onGridClick);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
      grid.removeEventListener("mousemove", onGridMove);
      grid.removeEventListener("mouseleave", onGridLeave);
      grid.removeEventListener("click", onGridClick);
    };
  }, [dims.w]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(filterTimeoutRef.current);
    };
  }, []);

  // Dim every copy of a letter that is already sitting in the stack
  useEffect(() => {
    selectedSrcsRef.current = new Set(stack.map((c) => c.src));
    poolRef.current.forEach((tile) => {
      if (!tile.src) return;
      tile.el.style.opacity = selectedSrcsRef.current.has(tile.src) ? "0.4" : "1";
    });
  }, [stack]);

  // Opening a letter pushes the grid outward, closing it settles back
  useEffect(() => {
    zoomRef.current.target = expanded ? EXPAND_ZOOM : 1;
    startLoop();
  }, [expanded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preload all images once up front
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      inanimates.map(
        ({ src }) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = img.onerror = resolve;
            img.src = src;
          }),
      ),
    ).then(() => {
      if (!cancelled) setImagesLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const isMobile = dims.w > 0 && dims.w <= 768;

  // Diagonal wave outward from the top-left of the viewport
  const fadeDelayFor = (tile) => {
    const start = lastStartRef.current;
    if (start.col === null || tile.col === null) return 0;
    return (tile.col - start.col + (tile.row - start.row)) * FADE_STAGGER;
  };

  const handleCategoryClick = (cat) => {
    if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
    const pool = poolRef.current;
    const g = geomRef.current;

    pool.forEach((tile) => {
      tile.el.style.transition = `opacity ${FADE_MS}ms ease ${fadeDelayFor(tile)}ms`;
      tile.el.style.opacity = "0";
    });

    const maxDelay = (g.cols + g.rows) * FADE_STAGGER;
    filterTimeoutRef.current = setTimeout(() => {
      filterTimeoutRef.current = null;
      const next = cat ? inanimates.filter((img) => img.cat === cat) : inanimates;
      imagesRef.current = shuffled(next);
      strideRef.current = strideFor(imagesRef.current.length);
      setActiveCategory(cat);
      setExpanded(false);

      // Re-point every tile at the new set, then wave them back in
      reposition(true);
      pool.forEach((tile) => {
        tile.el.style.opacity = "0";
      });
      void containerRef.current?.offsetHeight;
      pool.forEach((tile) => {
        tile.el.style.transition = `opacity ${FADE_MS}ms ease ${fadeDelayFor(tile)}ms`;
        tile.el.style.opacity = "1";
      });
      setTimeout(() => {
        pool.forEach((tile) => {
          tile.el.style.transition = "";
        });
      }, maxDelay + FADE_MS + 50);
    }, maxDelay + FADE_MS);
  };

  const handleSelect = (src) => {
    const item = inanimates.find((c) => c.src === src);
    setStack((prev) => {
      const existing = prev.find((c) => c.src === src);
      const without = prev.filter((c) => c.src !== src);
      const stackItem = existing ?? {
        ...item,
        rot: stackRot(without.length),
        tx: ((without.length * 37) % 21) - 10,
        ty: ((without.length * 29) % 17) - 8,
      };
      const next = [...without, stackItem];
      return next.length > 12 ? next.slice(next.length - 12) : next;
    });
  };
  selectRef.current = handleSelect;

  return (
    <div ref={containerRef} className="radiogram-6-container">
      <div className="radiogram-6-edge radiogram-6-edge--left" />
      <div className="radiogram-6-edge radiogram-6-edge--right" />
      <div className="radiogram-6-edge radiogram-6-edge--top" />
      <div className="radiogram-6-edge radiogram-6-edge--bottom" />

      {!imagesLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <p style={{ fontFamily: "Helvetica", fontSize: "0.9rem" }}>
            Loading...
          </p>
        </div>
      )}

      <HandFilter activeCategory={activeCategory} onCategoryClick={handleCategoryClick} />

      <div
        className={`radiogram-6-surface${expanded || snailMailOpen ? " dimmed" : ""}`}
        style={!imagesLoaded ? { visibility: "hidden" } : undefined}
      >
        <div ref={zoomLayerRef} className="radiogram-6-zoom">
          {/* Tiles are created and recycled imperatively — see the pool effect */}
          <div ref={gridRef} className="radiogram-6-grid" />
        </div>
      </div>

      {stack.length > 0 && (
        <div
          className={`radiogram-6-stack${expanded ? " radiogram-6-stack--expanded" : ""}${snailMailOpen ? " dimmed" : ""}`}
          style={
            isMobile
              ? { width: dims.tileW * 3.2, height: dims.tileH * 3.2 }
              : undefined
          }
          onClick={() => {
            if (!topCardRef.current) return;
            const rect = topCardRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const w = topCardRef.current.offsetWidth;
            const h = topCardRef.current.offsetHeight;
            const rot = stack[stack.length - 1].rot;
            setExpandedFrom({
              top: cy - h / 2,
              left: cx - w / 2,
              width: w,
              height: h,
              rotation: rot,
            });
            setExpanded(true);
          }}
        >
          {stack.map((item, i) => {
            return (
              <div
                key={item.src}
                ref={i === stack.length - 1 ? topCardRef : null}
                className="radiogram-6-stack-card"
                style={{
                  transform: `rotate(${item.rot}deg) translate(${item.tx}px, ${item.ty}px)`,
                  zIndex: i + 1,
                }}
              >
                <img src={item.src} alt={item.alt} />
              </div>
            );
          })}
        </div>
      )}

      {expanded && expandedFrom && stack.length > 0 && (
        <ExpandedCard
          src={stack[stack.length - 1].src}
          alt={stack[stack.length - 1].alt}
          from={expandedFrom}
          getToRect={() => {
            if (!topCardRef.current) return expandedFrom;
            const rect = topCardRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const w = topCardRef.current.offsetWidth;
            const h = topCardRef.current.offsetHeight;
            const rotation = stack[stack.length - 1].rot;
            return {
              top: cy - h / 2,
              left: cx - w / 2,
              width: w,
              height: h,
              rotation,
            };
          }}
          onStartClose={() => {
            // Settle the grid straight away rather than waiting for the
            // unmount at the end of the fly-back
            zoomRef.current.target = 1;
            startLoop();
          }}
          onClose={() => setExpanded(false)}
        />
      )}

      <button
        className="radiogram-6-snailmail-btn"
        onClick={() => setSnailMailOpen(true)}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        onMouseMove={(e) => setBtnMousePos({ x: e.clientX, y: e.clientY })}
      >
        <img src={receiveALetter} alt="Snail Mail" />
      </button>

      {btnHovered && !isMobile && (
        <div
          className="radiogram-6-btn-label"
          style={{ left: btnMousePos.x + 12, top: btnMousePos.y - 8 }}
        >
          → receive a letter
        </div>
      )}

      {snailMailOpen && (
        <div
          className="radiogram-6-snailmail-overlay"
          onClick={() => setSnailMailOpen(false)}
        >
          <div
            className="radiogram-6-snailmail-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="radiogram-6-snailmail-fields">
              {[
                { key: "name", label: "name..." },
                { key: "street", label: "street address..." },
                { key: "city", label: "city..." },
                { key: "state", label: "state / region..." },
                { key: "postcode", label: "postcode..." },
                { key: "country", label: "country..." },
              ].map(({ key, label }) => (
                <input
                  key={key}
                  className="radiogram-6-snailmail-input"
                  type="text"
                  placeholder={label}
                  value={snailMailForm[key]}
                  onChange={(e) =>
                    setSnailMailForm((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                />
              ))}
            </div>
            <div className="radiogram-6-snailmail-footer">
              <span className="radiogram-6-snailmail-tagline">
                sign up to the narrator's snail mail mailing list
              </span>
              <button
                className="radiogram-6-snailmail-send"
                disabled={submitState === "sending" || submitState === "sent"}
                onClick={async () => {
                  setSubmitState("sending");
                  try {
                    const res = await fetch(
                      `https://formspree.io/f/${FORMSPREE_ID}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Accept: "application/json",
                        },
                        body: JSON.stringify(snailMailForm),
                      },
                    );
                    if (res.ok) {
                      setSubmitState("sent");
                      setTimeout(() => {
                        setSnailMailOpen(false);
                        setSubmitState(null);
                        setSnailMailForm({
                          name: "",
                          street: "",
                          city: "",
                          state: "",
                          postcode: "",
                          country: "",
                        });
                      }, 1500);
                    } else {
                      setSubmitState("error");
                    }
                  } catch {
                    setSubmitState("error");
                  }
                }}
              >
                {submitState === "sending"
                  ? "sending..."
                  : submitState === "sent"
                    ? "sent"
                    : submitState === "error"
                      ? "error"
                      : "send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
