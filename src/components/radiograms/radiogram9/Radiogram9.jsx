import React, { useEffect, useRef } from "react";
import "./Radiogram9.css";

// Web-optimized images (see opt/ — resized to 2000px, WebP).
import DSC00597 from "./opt/DSC00597.webp";
import DSC00635 from "./opt/DSC00635.webp";
import DSC00747 from "./opt/DSC00747.webp";
import DSC00798 from "./opt/DSC00798.webp";
import DSC00872 from "./opt/DSC00872.webp";
import DSC00940 from "./opt/DSC00940.webp";
import DSC00955 from "./opt/DSC00955.webp";
import IMG_0334 from "./opt/IMG_0334.webp";
import IMG_3106 from "./opt/IMG_3106.webp";
import IMG_9806 from "./opt/IMG_9806.webp";
import JWE00705 from "./opt/JWE00705.webp";
import JWE00760 from "./opt/JWE00760.webp";
import JWE00768 from "./opt/JWE00768.webp";
import JWE00851 from "./opt/JWE00851.webp";
import JWE01034 from "./opt/JWE01034.webp";
import JWE06675 from "./opt/JWE06675.webp";
import JWE09759 from "./opt/JWE09759.webp";
import P1050180 from "./opt/P1050180.webp";

const images = [
  DSC00597,
  DSC00635,
  DSC00747,
  DSC00798,
  DSC00872,
  DSC00940,
  DSC00955,
  IMG_0334,
  IMG_3106,
  IMG_9806,
  JWE00705,
  JWE00760,
  JWE00768,
  JWE00851,
  JWE01034,
  JWE06675,
  JWE09759,
  P1050180,
];

export const Radiogram9 = () => {
  const containerRef = useRef(null);

  // Fade each tile in every time it scrolls into view (and out when it leaves).
  useEffect(() => {
    const tiles = containerRef.current?.querySelectorAll(".radiogram-9-tile");
    if (!tiles?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("visible", entry.isIntersecting);
        });
      },
      { threshold: 0.25 },
    );

    tiles.forEach((tile) => observer.observe(tile));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="radiogram-9" ref={containerRef}>
      <div className="radiogram-9-gallery">
        {images.map((src, i) => (
          <figure key={i} className="radiogram-9-tile">
            <img src={src} alt="" loading="lazy" draggable={false} />
          </figure>
        ))}
      </div>
    </div>
  );
};
