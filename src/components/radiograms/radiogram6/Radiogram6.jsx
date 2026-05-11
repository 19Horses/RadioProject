import React, { useRef, useEffect, useState } from "react";
import "./Radiogram6.css";

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

const FREE_COLS = 6;
const CARD_W = 180;
const CARD_H = 234;
const GAP = 60;
const MAX_TILT = 15;
const LERP = 0.06;
const FRICTION = 0.001;
const WHEEL_MULT = 0.5;

const TiltCard = ({
  src,
  alt,
  isSelected,
  onSelect,
  col,
  dragRef,
  isMobile,
}) => {
  const cardRef = useRef(null);
  const stateRef = useRef({
    rotX: 0,
    rotY: 0,
    tX: 0,
    tY: 0,
    scale: 1,
    shadow: 0,
    rafId: null,
    active: false,
  });
  const originX =
    col === 0 ? "left" : col === FREE_COLS - 1 ? "right" : "center";

  const runLoop = () => {
    const s = stateRef.current;
    const card = cardRef.current;
    if (!card) return;

    s.rotX += (s.tX - s.rotX) * LERP;
    s.rotY += (s.tY - s.rotY) * LERP;
    s.scale += ((s.active ? 1.28 : 1) - s.scale) * LERP;
    s.shadow += ((s.active ? 1 : 0) - s.shadow) * LERP;

    card.style.transform = `perspective(600px) rotateX(${s.rotX}deg) rotateY(${s.rotY}deg) scale(${s.scale})`;
    card.style.filter = `drop-shadow(0 ${s.shadow * 16}px ${s.shadow * 32}px rgba(0,0,0,${s.shadow * 0.35}))`;

    const stillMoving =
      Math.abs(s.tX - s.rotX) > 0.05 ||
      Math.abs(s.tY - s.rotY) > 0.05 ||
      Math.abs((s.active ? 1.28 : 1) - s.scale) > 0.0005 ||
      Math.abs((s.active ? 1 : 0) - s.shadow) > 0.005;

    if (stillMoving) {
      s.rafId = requestAnimationFrame(runLoop);
    } else {
      s.rafId = null;
    }
  };

  const startLoop = () => {
    if (!stateRef.current.rafId) {
      stateRef.current.rafId = requestAnimationFrame(runLoop);
    }
  };

  useEffect(() => {
    const state = stateRef.current;
    return () => {
      cancelAnimationFrame(state.rafId);
    };
  }, []);

  useEffect(() => {
    if (isSelected) {
      stateRef.current.tX = 0;
      stateRef.current.tY = 0;
      stateRef.current.active = false;
      startLoop();
    }
  }, [isSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseMove = (e) => {
    if (isMobile || isSelected || dragRef.current.active) return;
    const { left, top, width, height } =
      cardRef.current.getBoundingClientRect();
    const nx = ((e.clientX - left) / width) * 2 - 1;
    const ny = ((e.clientY - top) / height) * 2 - 1;
    stateRef.current.tX = -ny * MAX_TILT;
    stateRef.current.tY = nx * MAX_TILT;
    stateRef.current.active = true;
    startLoop();
  };

  const handleMouseLeave = () => {
    if (isMobile || isSelected) return;
    stateRef.current.tX = 0;
    stateRef.current.tY = 0;
    stateRef.current.active = false;
    startLoop();
  };

  return (
    <div
      ref={cardRef}
      className={`radiogram-6-card${isSelected ? " radiogram-6-card--selected" : ""}`}
      style={{ transformOrigin: `${originX} center` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (!dragRef.current.moved)
          onSelect(cardRef.current.getBoundingClientRect());
      }}
    >
      <img src={src} alt={alt} />
    </div>
  );
};

const OverlayImage = ({ src, alt }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    img.style.opacity = "0";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        img.style.transition = "opacity 1s ease";
        img.style.opacity = "1";
      });
    });
  }, []);

  return (
    <img ref={imgRef} src={src} alt={alt} className="radiogram-6-overlay-img" />
  );
};

export const Radiogram6 = () => {
  const containerRef = useRef(null);
  const surfaceRef = useRef(null);
  const [selected, setSelected] = useState(null);

  const selectedRef = useRef(null);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const [imagesLoaded, setImagesLoaded] = useState(false);

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

  const panRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });
  const rafRef = useRef(null);

  const isMobile = window.innerWidth <= 768;
  const cardW = isMobile ? 110 : CARD_W;
  const cardH = isMobile ? 143 : CARD_H;
  const gap = GAP;

  useEffect(() => {
    const container = containerRef.current;
    const surface = surfaceRef.current;
    if (!container || !surface) return;

    const ROWS = Math.ceil(inanimates.length / FREE_COLS);
    const totalW = FREE_COLS * (cardW + gap) - gap;
    const totalH = ROWS * (cardH + gap) - gap;

    const TOP_PAD = isMobile ? 50 : 30;
    const P = 30;

    const initialX = (container.clientWidth - totalW) / 2;
    const initialY = Math.min(TOP_PAD, (container.clientHeight - totalH) / 2);
    panRef.current.x = initialX;
    panRef.current.y = initialY;
    surface.style.transform = `translate(${initialX}px, ${initialY}px)`;

    const getBounds = () => {
      const cW = container.clientWidth;
      const cH = container.clientHeight;
      return {
        maxX: Math.max(P, (cW - totalW) / 2),
        minX: Math.min(-P, cW - totalW - P),
        maxY: Math.max(TOP_PAD, (cH - totalH) / 2),
        minY: Math.min(-P, cH - totalH - P),
      };
    };

    const tick = () => {
      const { maxX, minX, maxY, minY } = getBounds();
      const p = panRef.current;
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.x += p.vx;
      p.y += p.vy;
      let dirty = Math.abs(p.vx) > 0.01 || Math.abs(p.vy) > 0.01;
      if (p.x > maxX) {
        p.x = maxX;
        p.vx = 0;
        dirty = true;
      }
      if (p.x < minX) {
        p.x = minX;
        p.vx = 0;
        dirty = true;
      }
      if (p.y > maxY) {
        p.y = maxY;
        p.vy = 0;
        dirty = true;
      }
      if (p.y < minY) {
        p.y = minY;
        p.vy = 0;
        dirty = true;
      }
      if (dirty) {
        surface.style.transform = `translate(${p.x}px, ${p.y}px)`;
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    const startTick = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    startTick();

    const getXY = (e) =>
      e.touches
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: e.clientX, y: e.clientY };

    const onDown = (e) => {
      if (selectedRef.current) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      const { x, y } = getXY(e);
      dragRef.current = {
        active: true,
        moved: false,
        startX: x,
        startY: y,
        lastX: x,
        lastY: y,
      };
      panRef.current.vx = 0;
      panRef.current.vy = 0;
      container.style.cursor = "grabbing";
    };

    const onMove = (e) => {
      if (!dragRef.current.active) return;
      if (e.type === "mousemove" && e.buttons === 0) {
        onUp();
        return;
      }
      const { x, y } = getXY(e);
      const dx = x - dragRef.current.lastX;
      const dy = y - dragRef.current.lastY;
      const { maxX, minX, maxY, minY } = getBounds();
      const newX = Math.min(maxX, Math.max(minX, panRef.current.x + dx));
      const newY = Math.min(maxY, Math.max(minY, panRef.current.y + dy));
      panRef.current.vx = newX - panRef.current.x;
      panRef.current.vy = newY - panRef.current.y;
      panRef.current.x = newX;
      panRef.current.y = newY;
      surface.style.transform = `translate(${panRef.current.x}px, ${panRef.current.y}px)`;
      dragRef.current.lastX = x;
      dragRef.current.lastY = y;
      if (
        Math.abs(x - dragRef.current.startX) > 4 ||
        Math.abs(y - dragRef.current.startY) > 4
      ) {
        dragRef.current.moved = true;
      }
    };

    const onUp = () => {
      dragRef.current.active = false;
      container.style.cursor = "grab";
      startTick();
      setTimeout(() => {
        dragRef.current.moved = false;
      }, 50);
    };

    container.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    container.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    const stopWheel = (e) => {
      if (dragRef.current.active || selectedRef.current) return;
      e.stopPropagation();
      const { maxX, minX, maxY, minY } = getBounds();
      const newX = Math.min(
        maxX,
        Math.max(minX, panRef.current.x - e.deltaX * WHEEL_MULT),
      );
      const newY = Math.min(
        maxY,
        Math.max(minY, panRef.current.y - e.deltaY * WHEEL_MULT),
      );
      panRef.current.vx = newX - panRef.current.x;
      panRef.current.vy = newY - panRef.current.y;
      panRef.current.x = newX;
      panRef.current.y = newY;
      surface.style.transform = `translate(${panRef.current.x}px, ${panRef.current.y}px)`;
      startTick();
    };
    container.addEventListener("wheel", stopWheel, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      container.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      container.removeEventListener("wheel", stopWheel);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (i, rect) => {
    if (dragRef.current.moved) return;
    setSelected((prev) =>
      prev?.src === inanimates[i].src ? null : { ...inanimates[i], rect },
    );
  };

  return (
    <div
      ref={containerRef}
      className="radiogram-6-container"
      style={{ cursor: "grab" }}
    >
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
      <div
        ref={surfaceRef}
        className={`radiogram-6-surface${selected ? " dimmed" : ""}`}
        style={!imagesLoaded ? { visibility: "hidden" } : undefined}
      >
        {inanimates.map((img, i) => {
          const col = i % FREE_COLS;
          const row = Math.floor(i / FREE_COLS);
          return (
            <div
              key={i}
              className="radiogram-6-cell"
              style={{
                left: col * (cardW + gap),
                top: row * (cardH + gap),
                width: cardW,
                height: cardH,
              }}
            >
              <TiltCard
                src={img.src}
                alt={img.alt}
                isSelected={selected?.src === img.src}
                onSelect={(rect) => handleSelect(i, rect)}
                col={col}
                dragRef={dragRef}
                isMobile={isMobile}
              />
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="radiogram-6-overlay" onClick={() => setSelected(null)}>
          <OverlayImage src={selected.src} alt={selected.alt} />
        </div>
      )}
    </div>
  );
};
