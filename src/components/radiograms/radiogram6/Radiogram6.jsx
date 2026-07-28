import React, { useRef, useEffect, useState } from "react";
import "./Radiogram6.css";
import receiveALetter from "./RECEIVE A LETTER.webp";

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
];

// ── Infinite lerp grid ──────────────────────────────────────────────────
// A fixed pool of tiles lives inside a translated layer. Panning only moves
// that layer; whenever the pan crosses a cell boundary the tiles that fell
// off one edge are recycled to the opposite one, so the lattice never ends.
const TILE_DESKTOP = { w: 150, h: 195, gapX: 132, gapY: 108 };
const TILE_MOBILE = { w: 104, h: 135, gapX: 72, gapY: 58 };
const BUFFER = 1; // extra ring of tiles kept just outside the viewport
const PAN_LERP = 0.075; // how heavily the grid trails the pointer
const CENTER_LERP = 0.12; // snappier, for the programmatic glide to centre
const ZOOM_LERP = 0.07;
const WHEEL_MULT = 1.1;
const FLICK = 130; // px of glide per (px/ms) of release velocity
const FLICK_MAX = 1100;
const DRAG_SLOP = 5; // px of travel before a press stops counting as a click
const EXPAND_ZOOM = 1.18; // grid pushes outward while a letter is open
const MAX_TILT = 26;
const HOVER_SCALE = 1.24;
const COLLAPSE_MS = 480; // matches the tile-image transform transition

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


export const Radiogram6 = () => {
  const containerRef = useRef(null);
  const [expanded, setExpanded] = useState(null); // the { src, alt } being viewed
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

  // Locks out panning/hover from the moment a letter is clicked until it closes
  const lockRef = useRef(false);
  // The letter waiting for the centring glide to land before it blooms
  const pendingRef = useRef(null);
  // Lattice cell of the letter currently blown up, once it has landed
  const focusCellRef = useRef(null);
  // The tile element holding it, and the one currently shrinking back
  const focusTileRef = useRef(null);
  const collapsingRef = useRef(null);

  const [dims, setDims] = useState({ w: 0, h: 0 });
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
  const lerpRef = useRef(PAN_LERP);
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
  const closeRef = useRef(() => {});
  const closeTimerRef = useRef(null);
  const imagesRef = useRef(shuffled(inanimates));
  const strideRef = useRef(strideFor(inanimates.length));

  // ── Tile plumbing ─────────────────────────────────────────────────────
  const resetTileArt = (tile) => {
    tile.hovered = false;
    tile.styled = false;
    tile.focusK = 0;
    tile.el.style.zIndex = "";
    tile.el.style.opacity = "";
    tile.img.style.transform = "";
    tile.img.style.filter = "";
    // Layout overrides left behind by a bloom
    tile.img.style.width = "";
    tile.img.style.height = "";
    tile.img.style.maxWidth = "";
    tile.img.style.maxHeight = "";
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

    // A recycled tile must never carry hover or focus art to its new cell
    if (tile.styled) resetTileArt(tile);
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

  // Blows a tile up in place. Rather than scaling a small image up — which
  // rasterises at the tile size and stretches that texture, softening the
  // handwriting — the image is laid out at its final size and the transform
  // *inverted*, then animated away. It is only ever downscaled, so it stays
  // crisp for the whole bloom and lands pixel-exact at scale(1).
  const blowUp = (tile) => {
    const c = containerRef.current?.getBoundingClientRect();
    if (!c) return;
    const img = tile.img;

    // Measure at the resting layout, so a re-focus never compounds
    img.style.transition = "none";
    img.style.width = "";
    img.style.height = "";
    img.style.maxWidth = "";
    img.style.maxHeight = "";
    img.style.transform = "";
    const w = img.offsetWidth;
    const h = img.offsetHeight;

    // The tile sits on the zoom layer's origin, so divide that factor back out
    const z = zoomRef.current.target || 1;
    const k = Math.min((c.width * 0.86) / (w * z), (c.height * 0.86) / (h * z));
    if (!w || !h || !(k > 1)) {
      img.style.transition = ""; // never leave transitions switched off
      return;
    }

    img.style.maxWidth = "none";
    img.style.maxHeight = "none";
    img.style.width = `${w * k}px`;
    img.style.height = `${h * k}px`;
    img.style.transform = `scale(${(1 / k).toFixed(5)})`;
    void img.offsetWidth; // flush the inverted state before animating out of it

    img.style.transition = "";
    img.style.transform = "scale(1)";
    img.style.filter = "drop-shadow(0 24px 60px rgba(0,0,0,0.32))";
    tile.el.style.zIndex = "100";
    tile.el.style.opacity = "1";
    tile.styled = true;
    tile.focusK = k;
    focusTileRef.current = tile;
  };

  // Shrinks the blown-up tile back, then hands its layout to the stylesheet
  const collapse = () => {
    const tile = focusTileRef.current;
    focusTileRef.current = null;
    if (!tile) return;
    collapsingRef.current = tile;
    tile.img.style.transform = `scale(${(1 / (tile.focusK || 1)).toFixed(5)})`;
    tile.img.style.filter = "";
    tile.el.style.zIndex = "";
    tile.el.style.opacity = "";

    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      collapsingRef.current = null;
      lockRef.current = false;
      if (focusTileRef.current === tile) return; // re-focused in the meantime
      // Swap the oversized layout back for the transform in one flush, or the
      // untransitioned width change would pop against the animating scale
      tile.img.style.transition = "none";
      resetTileArt(tile);
      void tile.img.offsetWidth;
      tile.img.style.transition = "";
    }, COLLAPSE_MS);
  };

  const applyFocus = () => {
    const cell = focusCellRef.current;
    const pool = poolRef.current;
    const target =
      cell && pool.find((t) => t.col === cell.col && t.row === cell.row);

    if (!cell) collapse();

    pool.forEach((tile) => {
      if (tile === target || tile === collapsingRef.current) return;
      if (cell) {
        tile.styled = true;
        tile.el.style.zIndex = "";
        tile.el.style.opacity = "0.28";
        tile.img.style.transform = "";
        tile.img.style.filter = "";
      } else {
        resetTileArt(tile);
      }
    });

    if (target) blowUp(target);
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
      p.x += (t.x - p.x) * lerpRef.current;
      p.y += (t.y - p.y) * lerpRef.current;
      z.cur += (z.target - z.cur) * ZOOM_LERP;
      applyTransform();

      // Once the centring glide is all but landed, snap the last sub-pixel and
      // let the letter bloom. Waiting until here means the pan has stopped
      // recycling tiles, so the focused tile keeps its identity while it grows.
      const pend = pendingRef.current;
      if (pend && Math.abs(t.x - p.x) < 1 && Math.abs(t.y - p.y) < 1) {
        pendingRef.current = null;
        p.x = t.x;
        p.y = t.y;
        applyTransform();
        focusCellRef.current = { col: pend.col, row: pend.row };
        setExpanded(pend.item);
      }

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
        lerpRef.current = PAN_LERP;
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

      // A resize resizes and recycles the pool, which would strand the blown-up
      // tile — and with it the lock. Drop back to the grid first.
      if (focusCellRef.current || pendingRef.current) {
        clearTimeout(closeTimerRef.current);
        if (focusTileRef.current) resetTileArt(focusTileRef.current);
        focusCellRef.current = null;
        pendingRef.current = null;
        focusTileRef.current = null;
        collapsingRef.current = null;
        lockRef.current = false;
        setExpanded(null);
      }

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
      setDims({ w: r.width, h: r.height });
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
      lerpRef.current = PAN_LERP;
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
      if (lockRef.current || e.button !== 0) return;
      clearHover();
      beginDrag(e.clientX, e.clientY);
    };
    const onMouseMove = (e) => moveDrag(e.clientX, e.clientY);
    const onMouseUp = () => endDrag();

    const onWheel = (e) => {
      if (lockRef.current) return;
      e.preventDefault();
      lerpRef.current = PAN_LERP;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1;
      targetRef.current.x -= e.deltaX * unit * WHEEL_MULT;
      targetRef.current.y -= e.deltaY * unit * WHEEL_MULT;
      startLoop();
    };

    const onTouchStart = (e) => {
      if (lockRef.current || e.touches.length !== 1) return;
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
      if (dragRef.current.active || lockRef.current || dims.w <= 768) return;
      const tile = tileFor(e.target);
      if (!tile) {
        clearHover();
        return;
      }
      if (hoverRef.current && hoverRef.current !== tile) resetTileArt(hoverRef.current);
      hoverRef.current = tile;
      tile.hovered = true;
      tile.styled = true;
      tile.el.style.zIndex = "3";

      const r = tile.el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      tile.img.style.transform = `perspective(600px) rotateX(${(-ny * MAX_TILT).toFixed(2)}deg) rotateY(${(nx * MAX_TILT).toFixed(2)}deg) scale(${HOVER_SCALE})`;
      tile.img.style.filter = "drop-shadow(0 16px 32px rgba(0,0,0,0.35))";
    };

    const onGridLeave = () => clearHover();

    const onGridClick = (e) => {
      if (dragRef.current.moved || lockRef.current) return;
      const tile = tileFor(e.target);
      if (tile?.src) selectRef.current(tile);
    };

    // Anywhere on the surface closes an open letter. Only armed once it has
    // actually bloomed, so the click that opened it can't immediately close it.
    const onSurfaceClick = () => {
      if (focusCellRef.current) closeRef.current();
    };

    container.addEventListener("click", onSurfaceClick);
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
      container.removeEventListener("click", onSurfaceClick);
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
      clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Opening a letter pushes the grid outward, closing it settles back.
  // The zoom target is set first — applyFocus divides it out of the scale.
  useEffect(() => {
    zoomRef.current.target = expanded ? EXPAND_ZOOM : 1;
    applyFocus();
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

  const handleSelect = (tile) => {
    const item = inanimates.find((c) => c.src === tile.src);
    if (!item || !containerRef.current) return;

    const g = geomRef.current;
    const c = containerRef.current.getBoundingClientRect();

    // Glide the lattice until the clicked letter sits dead centre, then let the
    // loop bloom it once it lands. Locking now keeps the pan — and so the tile
    // recycling — still for the whole of the glide and the bloom.
    lockRef.current = true;
    lerpRef.current = CENTER_LERP;
    hoverRef.current = null;
    resetTileArt(tile);
    targetRef.current = {
      x: c.width / 2 - (tile.col * g.stepX + g.tileW / 2),
      y: c.height / 2 - (tile.row * g.stepY + g.tileH / 2),
    };
    pendingRef.current = { col: tile.col, row: tile.row, item };
    startLoop();
  };
  selectRef.current = handleSelect;

  // The lock is released by collapse() once the letter has finished shrinking,
  // so a quick drag can't recycle the tile out from under it
  const handleClose = () => {
    focusCellRef.current = null;
    pendingRef.current = null;
    setExpanded(null);
  };
  closeRef.current = handleClose;

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

      {/* The blown-up letter is just one of these tiles, scaled in place */}
      <div
        className={`radiogram-6-surface${snailMailOpen ? " dimmed" : ""}`}
        style={!imagesLoaded ? { visibility: "hidden" } : undefined}
      >
        <div ref={zoomLayerRef} className="radiogram-6-zoom">
          {/* Tiles are created and recycled imperatively — see the pool effect */}
          <div ref={gridRef} className="radiogram-6-grid" />
        </div>
      </div>

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
