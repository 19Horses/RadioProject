import React, { useState, useRef, useEffect } from "react";
import Sketch from "react-p5";

const bayerMatrix = [
  [15, 7, 13, 5],
  [3, 11, 1, 9],
  [12, 4, 14, 6],
  [0, 8, 2, 10],
];

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function applyBayerDither(p5, img, scaleFactor) {
  img.loadPixels();
  const matrixSize = 4;

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const index = (x + y * img.width) * 4;
      const r = img.pixels[index];
      const g = img.pixels[index + 1];
      const b = img.pixels[index + 2];

      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const threshold =
        bayerMatrix[y % matrixSize][x % matrixSize] * scaleFactor;
      const newValue = gray < threshold ? 0 : 255;

      img.pixels[index] = newValue;
      img.pixels[index + 1] = newValue;
      img.pixels[index + 2] = newValue;
    }
  }

  img.updatePixels();
}

export default function DitheredImageCanvas({
  imageUrl,
  isMobile,
  deviceType,
}) {
  const [p5Image, setP5Image] = useState(null);
  const currentScaleRef = useRef(15);
  const animationStartTime = useRef(Date.now());
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 640, height: 480 });

  // Observe container size
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (deviceType === "mobile") {
          setDimensions({ width: "480", height: "640" });
        }
        const { width } = entry.contentRect;

        let height = 0;
        if (deviceType === "mobile") {
          height = width * (4 / 3);
        } else {
          height = width * (3 / 4); // 4:3 aspect ratio
        }

        setDimensions({ width, height });
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(dimensions.width, dimensions.height).parent(
      canvasParentRef
    );
    p5.background(0);

    p5.loadImage(imageUrl, (img) => {
      img.resize(dimensions.width, dimensions.height);
      setP5Image(img);
    });
  };

  const draw = (p5) => {
    if (!p5Image) return;

    p5.resizeCanvas(dimensions.width, dimensions.height); // in case container resizes
    p5.background(0);

    const duration = 2000;
    const now = Date.now();
    const elapsed = now - animationStartTime.current;
    const t = Math.min(elapsed / duration, 1);

    const minScale = 10;
    const maxScale = 15;

    const mouseX = p5.mouseX + p5.canvas.getBoundingClientRect().left;
    const clampedMouseX = Math.max(0, Math.min(mouseX, window.innerWidth));
    const targetScale =
      minScale + ((maxScale - minScale) * clampedMouseX) / window.innerWidth;

    currentScaleRef.current += (targetScale - currentScaleRef.current) * 0.1;

    const imgCopy = p5Image.get();
    applyBayerDither(p5, imgCopy, currentScaleRef.current);
    p5.image(imgCopy, 0, 0, p5.width, p5.height);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: isMobile
          ? deviceType === "mobile"
            ? "100%"
            : "100%"
          : deviceType === "mobile"
          ? "30vw"
          : "50vw",
        aspectRatio: deviceType === "mobile" ? "3 / 4" : "4 / 3",
        position: "relative",
      }}
    >
      <Sketch setup={setup} draw={draw} />
    </div>
  );
}
