import React, { useEffect, useRef } from "react";
import p5 from "p5";

const SymmetricalPattern = ({ size = 284, fastSpeed = 0.09 }) => {
  const canvasRef = useRef(null);
  const p5Instance = useRef(null);

  useEffect(() => {
    // Create p5 instance
    const sketch = (p) => {
      let grid;
      let cols, rows;
      let resolution = 3;
      let noiseOffsetX, noiseOffsetY;
      let noiseSpeed = 0.001;
      let baseSpeed = 0.005;
      let targetSpeed = 0.005;
      let isSpedUp = false;
      let speedUpEndTime = 0;
      let nextSpeedUpTime = 0;
      let lerpAmount = 0.05; // How quickly to lerp (0.05 = 5% per frame)

      p.setup = () => {
        p.createCanvas(size, size);
        p.noStroke();
        p.frameRate(20); // Reduce frame rate to 30fps for better performance

        cols = p.floor(p.width / resolution);
        rows = p.floor(p.height / resolution);

        grid = make2DArray(cols, rows);

        noiseOffsetX = p.random(1000);
        noiseOffsetY = p.random(1000);

        // Schedule first random speedup (between 2-8 seconds)
        nextSpeedUpTime = p.millis() + p.random(2000, 8000);
      };

      p.draw = () => {
        p.background(244);

        // Handle random speedups
        let currentTime = p.millis();

        if (!isSpedUp && currentTime >= nextSpeedUpTime) {
          // Start speedup
          isSpedUp = true;
          targetSpeed = fastSpeed; // Uses the prop value
          speedUpEndTime = currentTime + 500; // Speed up for 500ms (half second)
        }

        if (isSpedUp && currentTime >= speedUpEndTime) {
          // End speedup and schedule next one
          isSpedUp = false;
          targetSpeed = baseSpeed;
          nextSpeedUpTime = currentTime + p.random(2000, 8000); // Next speedup in 2-8 seconds
        }

        // Smoothly lerp to target speed
        noiseSpeed = p.lerp(noiseSpeed, targetSpeed, lerpAmount);

        noiseOffsetX += noiseSpeed;
        noiseOffsetY += noiseSpeed / 2;

        generatePattern();
        mirrorPattern();
        displayGrid();
      };

      function generatePattern() {
        // Centered and tall
        let centerX = cols / 4; // left side only
        let centerY = rows / 4; // top half only (we'll mirror vertically later)

        for (let i = 0; i < cols / 2; i++) {
          for (let j = 0; j < rows / 2; j++) {
            // smoother decay vertically for taller pattern
            let dx = p.abs(i - centerX);
            let dy = p.abs(j - centerY);
            let distX = p.map(dx, 0, cols / 2, 1, 0);
            let distY = p.map(dy, 0, rows / 2, 1, 0.3); // slower vertical falloff

            let gradient = distX * distY;

            // smooth noise for soft transitions
            let n = p.noise(i * 0.15 + noiseOffsetX, j * 0.15 + noiseOffsetY);

            let combinedValue = gradient * (n + 0.5);

            grid[i][j] = combinedValue > 0.8 ? 1 : 0; // threshold = blot density
          }
        }
      }

      function mirrorPattern() {
        // Horizontal mirroring (left-right)
        for (let i = 0; i < cols / 2; i++) {
          for (let j = 0; j < rows / 2; j++) {
            grid[cols - i - 1][j] = grid[i][j];
          }
        }

        // Vertical mirroring (top-bottom)
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows / 2; j++) {
            grid[i][rows - j - 1] = grid[i][j];
          }
        }
      }

      function displayGrid() {
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            p.fill(grid[i][j] === 1 ? 0 : "#f4f4f4");
            p.rect(i * resolution, j * resolution, resolution, resolution);
          }
        }
      }

      function make2DArray(cols, rows) {
        let arr = new Array(cols);
        for (let i = 0; i < arr.length; i++) {
          arr[i] = new Array(rows).fill(0);
        }
        return arr;
      }
    };

    // Create the p5 instance and attach it to the ref div
    p5Instance.current = new p5(sketch, canvasRef.current);

    // Cleanup on unmount
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, [size, fastSpeed]);

  return (
    <div
      ref={canvasRef}
      style={{
        display: "block",
        lineHeight: 0,
        fontSize: 0,
      }}
    />
  );
};

export default SymmetricalPattern;
