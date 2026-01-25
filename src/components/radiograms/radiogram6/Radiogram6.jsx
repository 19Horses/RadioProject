import React, { useState, useEffect, useRef, useMemo } from "react";
import "./Radiogram6.css";

// Static imports for better performance
import image1 from "./inanimates/1) IS YOUR KISS STUCK IN TRAFFIC_.png";
import image2 from "./inanimates/2) YES IT IS STUCK IN TRAFFIC.png";
import afterLetter from "./inanimates/AFTER A LETTER DELIVERED.png";
import timesStranger from "./inanimates/AM I TIMES STRANGER_.png";
import beloved1 from "./inanimates/BELOVED PART 1.png";
import beloved2 from "./inanimates/BELOVED PART 2.png";
import beloved3 from "./inanimates/BELOVED PART 3.png";
import confessional1 from "./inanimates/CONFESSIONAL 1.png";
import confessional2 from "./inanimates/CONFESSIONAL 2.png";
import elisabeth from "./inanimates/ELISABETH CALL.png";
import flower from "./inanimates/FLOWER INTERROGATION.png";
import bird from "./inanimates/I FOUND YOU IN A BIRD.png";
import ghost from "./inanimates/IS SHE HIS GHOST_.png";
import nocturnal from "./inanimates/LOVE_S NOCTURAL SHAPE.png";
import heart from "./inanimates/THAT_S MY HEART.png";
import formalities from "./inanimates/THE FORMALITIES OF A LOVER ARRIVED.png";
import headache from "./inanimates/THE HEADACHE.png";
import secondArrow from "./inanimates/THE SECOND ARROW.png";
import wax from "./inanimates/WAX.png";

const inanimates = [
  { src: image1, alt: "IS YOUR KISS STUCK IN TRAFFIC?" },
  { src: image2, alt: "YES IT IS STUCK IN TRAFFIC" },
  { src: afterLetter, alt: "AFTER A LETTER DELIVERED" },
  { src: timesStranger, alt: "AM I TIMES STRANGER?" },
  { src: beloved1, alt: "BELOVED PART 1" },
  { src: beloved2, alt: "BELOVED PART 2" },
  { src: beloved3, alt: "BELOVED PART 3" },
  { src: confessional1, alt: "CONFESSIONAL 1" },
  { src: confessional2, alt: "CONFESSIONAL 2" },
  { src: elisabeth, alt: "ELISABETH CALL" },
  { src: flower, alt: "FLOWER INTERROGATION" },
  { src: bird, alt: "I FOUND YOU IN A BIRD" },
  { src: ghost, alt: "IS SHE HIS GHOST?" },
  { src: nocturnal, alt: "LOVE'S NOCTURNAL SHAPE" },
  { src: heart, alt: "THAT'S MY HEART" },
  { src: formalities, alt: "THE FORMALITIES OF A LOVER ARRIVED" },
  { src: headache, alt: "THE HEADACHE" },
  { src: secondArrow, alt: "THE SECOND ARROW" },
  { src: wax, alt: "WAX" },
];

// Grid image component
const GridImage = ({ src, alt, onClick }) => {
  return (
    <div className="inanimate-grid-item" onClick={onClick}>
      <img src={src} alt={alt} />
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

  // Preload all images on mount to prevent lag
  useEffect(() => {
    inanimates.forEach((image) => {
      const img = new Image();
      img.src = image.src;
    });
  }, []);

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
              <img src={image.src} alt={image.alt} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
