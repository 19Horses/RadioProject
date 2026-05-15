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
].map((item, i) => ({ ...item, cat: ["a", "b", "c"][i % 3] }));

const CARD_W = 100;
const CARD_H = 130;
const MAX_TILT = 15;
const LERP = 0.06;
const SPIN_FRICTION = 0.95;
const WHEEL_SPIN = 0.001;

const STACK_ROTS = [8, -12, 5, -9, 13, -6, 10, -14, 3, -7, 11, -4];
const stackRot = (i) => STACK_ROTS[i % STACK_ROTS.length];

const TiltCard = ({ src, alt, isSelected, onSelect, isMobile }) => {
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
    if (isMobile || isSelected) return;
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
      style={{ transformOrigin: "center center" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
    >
      <img src={src} alt={alt} />
    </div>
  );
};

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
  const cellRefs = useRef([]);
  const [stack, setStack] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [expandedFrom, setExpandedFrom] = useState(null);
  const topCardRef = useRef(null);
  const selectedRef = useRef(false);
  useEffect(() => {
    selectedRef.current = expanded;
  }, [expanded]);

  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Spin state — all in refs so RAF closures always see current values
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const spinRafRef = useRef(null);
  // Layout metrics — updated on resize, read by RAF and render
  const layoutRef = useRef({
    cx: 0,
    cy: 0,
    radius: 0,
    cardW: CARD_W,
    cardH: CARD_H,
  });
  const baseRadiusRef = useRef(0);
  const radiusAnimRafRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState(null);
  const [filterGen, setFilterGen] = useState(0);
  const filterTimeoutRef = useRef(null);

  const pickCards = (cat) => {
    const pool = cat ? inanimates.filter((img) => img.cat === cat) : inanimates;
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 12);
  };

  const [cards, setCards] = useState(() => pickCards(null));

  // Moves every cell to match the current angle without a React re-render
  const applyPositions = (angle) => {
    const { cx, cy, radius, cardW, cardH } = layoutRef.current;
    cellRefs.current.forEach((cell, i) => {
      if (!cell) return;
      const a = (i / 12) * 2 * Math.PI - Math.PI / 2 + angle;
      cell.style.left = `${cx + radius * Math.cos(a) - cardW / 2}px`;
      cell.style.top = `${cy + radius * Math.sin(a) - cardH / 2}px`;
    });
  };

  const startSpin = () => {
    if (spinRafRef.current) return;
    const loop = () => {
      velocityRef.current *= SPIN_FRICTION;
      angleRef.current += velocityRef.current;
      applyPositions(angleRef.current);
      if (Math.abs(velocityRef.current) > 0.0001) {
        spinRafRef.current = requestAnimationFrame(loop);
      } else {
        velocityRef.current = 0;
        spinRafRef.current = null;
      }
    };
    spinRafRef.current = requestAnimationFrame(loop);
  };

  // Resize observer
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const isMob = r.width <= 768;
      const cardW = isMob ? 120 : CARD_W;
      const cardH = isMob ? 156 : CARD_H;
      const radius = (r.height * 0.95 - cardH) / 2;
      baseRadiusRef.current = radius;
      layoutRef.current = {
        cx: r.width / 2,
        cy: r.height / 2,
        radius,
        cardW,
        cardH,
      };
      setDims({ w: r.width, h: r.height });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Wheel + touch spin
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      if (selectedRef.current) return;
      e.preventDefault();
      velocityRef.current += e.deltaY * WHEEL_SPIN;
      startSpin();
    };

    let touchLastY = 0;
    const onTouchStart = (e) => {
      touchLastY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (selectedRef.current) return;
      const dy = touchLastY - e.touches[0].clientY;
      touchLastY = e.touches[0].clientY;
      velocityRef.current += dy * WHEEL_SPIN;
      startSpin();
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => cancelAnimationFrame(spinRafRef.current);
  }, []);

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

  const animateRadius = (toExpanded, doubleRaf = false) => {
    cancelAnimationFrame(radiusAnimRafRef.current);
    const target = toExpanded ? baseRadiusRef.current * 1.4 : baseRadiusRef.current;
    const start = () => {
      const loop = () => {
        const cur = layoutRef.current.radius;
        const next = cur + (target - cur) * 0.07;
        layoutRef.current.radius = next;
        applyPositions(angleRef.current);
        if (Math.abs(target - next) > 0.3) {
          radiusAnimRafRef.current = requestAnimationFrame(loop);
        } else {
          layoutRef.current.radius = target;
          applyPositions(angleRef.current);
          radiusAnimRafRef.current = null;
        }
      };
      radiusAnimRafRef.current = requestAnimationFrame(loop);
    };
    if (doubleRaf) {
      radiusAnimRafRef.current = requestAnimationFrame(() => requestAnimationFrame(start));
    } else {
      start();
    }
  };

  // Reset spin when cards change
  useEffect(() => {
    cancelAnimationFrame(spinRafRef.current);
    spinRafRef.current = null;
    angleRef.current = 0;
    velocityRef.current = 0;
  }, [cards]);

  const isMobile = dims.w > 0 && dims.w <= 768;
  const { cx, cy, radius, cardW, cardH } = layoutRef.current;

  const handleCategoryClick = (cat) => {
    if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
    const stagger = 20;
    const fadeDur = 250;

    // CSS animation (fill-mode:both) blocks transitions on the same property —
    // cancel it and pin opacity:1 first, then force a reflow so the browser
    // registers the explicit value before we start transitioning to 0.
    cellRefs.current.forEach((cell) => {
      if (!cell) return;
      cell.style.animation = "none";
      cell.style.opacity = "1";
    });
    void containerRef.current?.offsetHeight;

    cellRefs.current.forEach((cell, i) => {
      if (!cell) return;
      cell.style.transition = `opacity ${fadeDur}ms ease ${i * stagger}ms`;
      cell.style.opacity = "0";
    });

    const delay = (cards.length - 1) * stagger + fadeDur + 50;
    filterTimeoutRef.current = setTimeout(() => {
      filterTimeoutRef.current = null;
      setActiveCategory(cat);
      setCards(pickCards(cat));
      setExpanded(false);
      setFilterGen((g) => g + 1);
    }, delay);
  };

  const handleSelect = (src) => {
    const item = cards.find((c) => c.src === src);
    setStack((prev) => {
      if (prev.some((c) => c.src === src))
        return prev.filter((c) => c.src !== src);
      const next = [...prev, item];
      return next.length > 12 ? next.slice(next.length - 12) : next;
    });
  };

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

      <div className="radiogram-6-filters">
        {["a", "b", "c"].map((cat) => (
          <button
            key={cat}
            className={`radiogram-6-filter-btn${activeCategory === cat ? " radiogram-6-filter-btn--active" : ""}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div
        className={`radiogram-6-surface${expanded ? " dimmed" : ""}`}
        style={!imagesLoaded ? { visibility: "hidden" } : undefined}
      >
        {dims.w > 0 &&
          cards.map((img, i) => {
            const a = (i / 12) * 2 * Math.PI - Math.PI / 2 + angleRef.current;
            const x = cx + radius * Math.cos(a) - cardW / 2;
            const y = cy + radius * Math.sin(a) - cardH / 2;
            return (
              <div
                key={`${filterGen}-${img.src}`}
                ref={(el) => {
                  cellRefs.current[i] = el;
                }}
                className="radiogram-6-cell"
                style={{
                  left: x,
                  top: y,
                  width: cardW,
                  height: cardH,
                  animationDelay: `${i * 30}ms`,
                }}
              >
                <TiltCard
                  src={img.src}
                  alt={img.alt}
                  isSelected={stack.some((c) => c.src === img.src)}
                  onSelect={() => handleSelect(img.src)}
                  isMobile={isMobile}
                />
              </div>
            );
          })}
      </div>

      {stack.length > 0 && (
        <div
          className={`radiogram-6-stack${expanded ? " radiogram-6-stack--expanded" : ""}`}
          onClick={() => {
            if (!topCardRef.current) return;
            const rect = topCardRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const w = topCardRef.current.offsetWidth;
            const h = topCardRef.current.offsetHeight;
            const rot = stackRot(stack.length - 1);
            setExpandedFrom({ top: cy - h / 2, left: cx - w / 2, width: w, height: h, rotation: rot });
            setExpanded(true);
            animateRadius(true, true);
          }}
        >
          {stack.map((item, i) => {
            const rot = stackRot(i);
            const tx = ((i * 37) % 21) - 10;
            const ty = ((i * 29) % 17) - 8;
            return (
              <div
                key={item.src}
                ref={i === stack.length - 1 ? topCardRef : null}
                className="radiogram-6-stack-card"
                style={{
                  transform: `rotate(${rot}deg) translate(${tx}px, ${ty}px)`,
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
            const rotation = stackRot(stack.length - 1);
            return { top: cy - h / 2, left: cx - w / 2, width: w, height: h, rotation };
          }}
          onStartClose={() => animateRadius(false)}
          onClose={() => setExpanded(false)}
        />
      )}
    </div>
  );
};
