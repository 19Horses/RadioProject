import React, { useState, useMemo, useRef, useEffect } from "react";
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

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const Radiogram6 = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isTopExpanded, setIsTopExpanded] = useState(false);
  const shuffledInanimates = useMemo(() => shuffleArray(inanimates), []);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const itemRefsRef = useRef([]); // direct DOM refs to each ring item
  const rafRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const N = shuffledInanimates.length;
  // Pre-compute each item's spread angle in radians once
  const spreadAngles = useMemo(
    () => shuffledInanimates.map((_, i) => (i / N) * 360),
    [shuffledInanimates, N]
  );
  const RADIUS = 420;

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      velocityRef.current += (e.deltaY + e.deltaX) * 0.04;
      if (!isAnimatingRef.current) startLoop();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startLoop = () => {
    isAnimatingRef.current = true;
    const loop = () => {
      velocityRef.current *= 0.92;
      rotationRef.current += velocityRef.current;
      const rot = rotationRef.current;
      const items = itemRefsRef.current;

      for (let i = 0; i < items.length; i++) {
        if (!items[i]) continue;
        const spread = spreadAngles[i];
        // Full final transform computed in JS — no CSS variable inheritance
        items[i].style.transform =
          `rotate(${spread}deg) translateY(-${RADIUS}px) rotate(${-spread - rot}deg)`;
      }

      if (Math.abs(velocityRef.current) > 0.01) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        isAnimatingRef.current = false;
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const handleImageClick = (image, index) => {
    if (
      selectedImages.length > 0 &&
      selectedImages[selectedImages.length - 1].gridIndex === index
    ) return;

    setIsTopExpanded(false);
    setSelectedImages((prev) => [
      ...prev,
      {
        ...image,
        id: Date.now(),
        gridIndex: index,
        offsetX: (Math.random() - 0.5) * 60,
        offsetY: (Math.random() - 0.5) * 60,
        rotation: (Math.random() - 0.5) * 12,
      },
    ].slice(-20));
  };

  const handleStackClick = (stackIndex) => {
    if (stackIndex === selectedImages.length - 1) {
      setIsTopExpanded((prev) => !prev);
    }
  };

  return (
    <div className="radiogram-6-container">
      <div className="radiogram-6-ring">
        {shuffledInanimates.map((image, index) => {
          const angle = (index / shuffledInanimates.length) * 360;
          return (
            <div
              key={index}
              className="inanimate-ring-item"
              ref={(el) => { itemRefsRef.current[index] = el; }}
              style={{ transform: `rotate(${angle}deg) translateY(-${RADIUS}px) rotate(${-angle}deg)` }}
              onClick={() => handleImageClick(image, index)}
            >
              <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
            </div>
          );
        })}
      </div>

      <div className="radiogram-6-stack">
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
      </div>
    </div>
  );
};
