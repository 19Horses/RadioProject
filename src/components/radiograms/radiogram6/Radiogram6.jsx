import React, { useState, useEffect, useRef, useMemo } from "react";
import "./Radiogram6.css";

// CloudFront CDN base URL
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
  { src: `${CDN_BASE}/MY%20HEART.webp`, alt: "MY HEART" },
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
  { src: `${CDN_BASE}/TWO%20BIRDS%20ONE%20KISS.webp`, alt: "TWO BIRDS ONE KISS" },
  { src: `${CDN_BASE}/WAX.webp`, alt: "WAX" },
];

// Grid image component with lazy loading
const GridImage = ({ src, alt, onClick }) => {
  return (
    <div className="inanimate-grid-item" onClick={onClick}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </div>
  );
};

// Fisher-Yates shuffle
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const Radiogram6 = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isTopExpanded, setIsTopExpanded] = useState(false);

  // Randomize grid order on mount
  const shuffledInanimates = useMemo(() => shuffleArray(inanimates), []);

  // Disable scrolling on mount, restore on unmount
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Preload only on desktop (mobile bandwidth is limited)
  useEffect(() => {
    if (!isMobile) {
      inanimates.forEach((image) => {
        const img = new Image();
        img.src = image.src;
      });
    }
  }, [isMobile]);

  const handleImageClick = (image, index) => {
    // Prevent same item from being stacked twice in a row
    if (
      selectedImages.length > 0 &&
      selectedImages[selectedImages.length - 1].gridIndex === index
    ) {
      return;
    }

    // Generate random offset and rotation for natural placement feel
    const randomX = (Math.random() - 0.5) * 60; // -30px to +30px
    const randomY = (Math.random() - 0.5) * 60; // -30px to +30px
    const randomRotation = (Math.random() - 0.5) * 12; // -6deg to +6deg

    // Reset expanded state when adding new image
    setIsTopExpanded(false);

    setSelectedImages((prev) => {
      const newStack = [
        ...prev,
        {
          ...image,
          id: Date.now(),
          gridIndex: index,
          offsetX: randomX,
          offsetY: randomY,
          rotation: randomRotation,
        },
      ];
      // Keep only the last 20 items
      return newStack.slice(-20);
    });
  };

  const handleStackClick = (stackIndex) => {
    // Only toggle expand for the topmost image
    if (stackIndex === selectedImages.length - 1) {
      setIsTopExpanded((prev) => !prev);
    }
  };

  return (
    <div className="radiogram-6-container">
      {/* Left side - Grid of images */}
      <div className="radiogram-6-grid-wrapper">
        <div className="radiogram-6-grid">
          {shuffledInanimates.map((image, index) => (
            <GridImage
              key={index}
              src={image.src}
              alt={image.alt}
              onClick={() => handleImageClick(image, index)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Right side - Stacked selected images */}
      <div className="radiogram-6-stack">
        {selectedImages.map((image, stackIndex) => {
          const isTopImage = stackIndex === selectedImages.length - 1;
          const isExpanded = isTopImage && isTopExpanded;

          // Progressive opacity: top item = 1, items further down fade out
          const positionFromTop = selectedImages.length - 1 - stackIndex;
          const opacity = isTopImage
            ? 1
            : Math.max(0.25, 1 - positionFromTop * 0.04);

          return (
            <div
              key={image.id}
              className={`stacked-image ${isExpanded ? "stacked-image-expanded" : ""}`}
              style={{
                zIndex: isExpanded ? 9999 : stackIndex,
                "--offset-x": `${image.offsetX}px`,
                "--offset-y": `${image.offsetY}px`,
                "--rotation": `${image.rotation}deg`,
                opacity: opacity,
              }}
              onClick={() => handleStackClick(stackIndex)}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="eager"
                decoding="async"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
