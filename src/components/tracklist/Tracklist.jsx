import React, { useState, useEffect, useRef } from "react";
import "./Tracklist.css";

export const Tracklist = ({
  selectedGuest,
  isMobile,
  isPlaying,
  currentSection,
}) => {
  const [visibleIndices, setVisibleIndices] = useState(new Set());
  const [hoverColors, setHoverColors] = useState({});
  const [activeHovers, setActiveHovers] = useState(new Set()); // tracks which items are actively hovered (not fading)
  const hoverTimeoutsRef = useRef({});

  // Helper to determine which section an item belongs to based on its index
  const getItemSection = (index) => {
    let currentSec = "a";
    for (let i = 0; i <= index; i++) {
      const title = selectedGuest.tracklist[i]?.title;
      if (title === "RADIO (a)") currentSec = "a";
      else if (title === "PROJECT") currentSec = "+";
      else if (title === "RADIO (b)") currentSec = "b";
    }
    return currentSec;
  };

  // Helper to determine if an item should be dark (already played or currently playing)
  const shouldBeDark = (itemSection) => {
    if (!isPlaying || !currentSection) return false;

    // If in section "a", only "a" items are dark
    if (currentSection === "a") return itemSection === "a";
    // If in section "+", "a" and "+" items are dark
    if (currentSection === "+")
      return itemSection === "a" || itemSection === "+";
    // If in section "b", all items are dark
    if (currentSection === "b") return true;

    return false;
  };

  useEffect(() => {
    // Clear any pending hover timeouts when guest changes
    Object.values(hoverTimeoutsRef.current).forEach((timeout) =>
      clearTimeout(timeout)
    );
    hoverTimeoutsRef.current = {};
    setHoverColors({});
    setActiveHovers(new Set());

    // Create randomized order of indices when guest changes
    const indices = selectedGuest.tracklist.map((_, i) => i);
    const shuffled = [...indices].sort(() => Math.random() - 0.5);
    setVisibleIndices(new Set());

    const itemsPerBatch = 3; // 3 items at a time
    let batchIndex = 0;

    const interval = setInterval(() => {
      const startIdx = batchIndex * itemsPerBatch;
      const endIdx = Math.min(startIdx + itemsPerBatch, shuffled.length);

      if (startIdx >= shuffled.length) {
        clearInterval(interval);
        return;
      }

      setVisibleIndices((prev) => {
        const newSet = new Set(prev);
        for (let i = startIdx; i < endIdx; i++) {
          newSet.add(shuffled[i]);
        }
        return newSet;
      });

      batchIndex++;
    }, 50);

    return () => {
      clearInterval(interval);
      // Clean up timeouts on unmount
      Object.values(hoverTimeoutsRef.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
    };
  }, [selectedGuest]);

  // Generate random colors for hover
  const generateRandomColors = () => {
    const bgColors = [
      // Light pinks
      "rgba(255, 206, 223)", // soft pink
      "rgba(255, 182, 193)", // light pink
      "rgba(255, 160, 180)", // rose pink
      "rgba(255, 140, 160)", // coral pink
      "rgba(255, 120, 150)", // hot pink
      "rgba(255, 170, 200)", // bubblegum
      "rgba(255, 190, 210)", // blush
      "rgba(250, 175, 190)", // dusty rose
      "rgba(255, 150, 170)", // salmon pink
      "rgba(255, 200, 215)", // baby pink
      // Complementary to 255,0,90 (magenta-pink)
      "rgba(255, 0, 90)", // the magenta pink itself
      "rgba(255, 50, 120)", // bright pink
      "rgba(255, 80, 140)", // vivid pink
      "rgba(0, 255, 165)", // spring green (complement)
      "rgba(0, 230, 150)", // mint (complement)
      "rgba(0, 200, 130)", // sea green (complement)
      "rgba(80, 255, 180)", // light spring (complement)
      "rgba(0, 180, 180)", // teal (near complement)
      "rgba(0, 210, 210)", // cyan teal
      "rgba(255, 220, 100)", // golden yellow (triadic)
      "rgba(100, 200, 255)", // sky blue (split complement)
      // Dark colors
      "rgba(30, 30, 40)", // charcoal
      "rgba(45, 25, 60)", // deep purple
      "rgba(20, 40, 60)", // midnight blue
      "rgba(60, 25, 35)", // burgundy
      "rgba(25, 50, 45)", // forest green
      "rgba(50, 35, 25)", // dark brown
      "rgba(40, 20, 50)", // grape
      "rgba(55, 30, 45)", // plum
      "rgba(25, 35, 55)", // navy
      "rgba(45, 45, 45)", // dark grey
      "rgba(70, 20, 40)", // wine
      "rgba(20, 45, 35)", // dark teal
    ];

    // Define which text colors work well with each background
    const colorPairs = {
      // Light pinks - varied text colors
      "rgba(255, 206, 223)": [
        "#FFFFFF",
        "#000000",
        "#1a5c4c",
        "#2d3a66",
        "#6b2d5b",
      ],
      "rgba(255, 182, 193)": [
        "#FFFFFF",
        "#000000",
        "#0d6655",
        "#3d2d66",
        "#1a3d5c",
      ],
      "rgba(255, 160, 180)": [
        "#FFFFFF",
        "#000000",
        "#006655",
        "#2d4d66",
        "#4d1a4d",
      ],
      "rgba(255, 140, 160)": ["#FFFFFF", "#000000", "#007766", "#1a3d5c"],
      "rgba(255, 120, 150)": ["#FFFFFF", "#004d40", "#1a3366"],
      "rgba(255, 170, 200)": ["#FFFFFF", "#000000", "#0d6655", "#3d2d66"],
      "rgba(255, 190, 210)": ["#FFFFFF", "#000000", "#1a5c4c", "#2d3a66"],
      "rgba(250, 175, 190)": ["#FFFFFF", "#000000", "#006655", "#3d2d5c"],
      "rgba(255, 150, 170)": ["#FFFFFF", "#000000", "#007766", "#2d4d66"],
      "rgba(255, 200, 215)": ["#FFFFFF", "#000000", "#1a5c4c", "#4d2d5c"],
      // Complementary colors for 255,0,90
      "rgba(255, 0, 90)": ["#FFFFFF", "#00ffaa", "#000000", "#ccff00"],
      "rgba(255, 50, 120)": ["#FFFFFF", "#00e6aa", "#000000"],
      "rgba(255, 80, 140)": ["#FFFFFF", "#000000", "#00cc99"],
      "rgba(0, 255, 165)": ["#000000", "#FFFFFF", "#660033", "#330066"],
      "rgba(0, 230, 150)": ["#000000", "#FFFFFF", "#4d0033", "#1a0033"],
      "rgba(0, 200, 130)": ["#FFFFFF", "#000000", "#660044"],
      "rgba(80, 255, 180)": ["#000000", "#4d0033", "#1a1a4d"],
      "rgba(0, 180, 180)": ["#FFFFFF", "#000000", "#660033"],
      "rgba(0, 210, 210)": ["#000000", "#FFFFFF", "#4d0033"],
      "rgba(255, 220, 100)": ["#000000", "#4d0033", "#003366"],
      "rgba(100, 200, 255)": ["#000000", "#FFFFFF", "#660033", "#4d1a00"],
      // Dark colors - light/bright text
      "rgba(30, 30, 40)": ["#FFFFFF", "#FFD700", "#00FFFF", "#FF69B4"],
      "rgba(45, 25, 60)": ["#FFFFFF", "#E6E6FA", "#FFB6C1", "#98FB98"],
      "rgba(20, 40, 60)": ["#FFFFFF", "#87CEEB", "#FFD700", "#FF6B6B"],
      "rgba(60, 25, 35)": ["#FFFFFF", "#FFD700", "#FFC0CB", "#98FB98"],
      "rgba(25, 50, 45)": ["#FFFFFF", "#98FB98", "#FFD700", "#FFA07A"],
      "rgba(50, 35, 25)": ["#FFFFFF", "#FFD700", "#FFA07A", "#87CEEB"],
      "rgba(40, 20, 50)": ["#FFFFFF", "#E6E6FA", "#FFB6C1", "#00FFFF"],
      "rgba(55, 30, 45)": ["#FFFFFF", "#FFB6C1", "#E6E6FA", "#98FB98"],
      "rgba(25, 35, 55)": ["#FFFFFF", "#87CEEB", "#FFD700", "#FF69B4"],
      "rgba(45, 45, 45)": ["#FFFFFF", "#00FFFF", "#FFD700", "#FF69B4"],
      "rgba(70, 20, 40)": ["#FFFFFF", "#FFD700", "#FFC0CB", "#87CEEB"],
      "rgba(20, 45, 35)": ["#FFFFFF", "#00FFFF", "#98FB98", "#FFD700"],
    };

    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
    const validTextColors = colorPairs[randomBg] || ["#FFFFFF", "#000000"];
    const randomText =
      validTextColors[Math.floor(Math.random() * validTextColors.length)];

    return { backgroundColor: randomBg, color: randomText };
  };

  const handleMouseEnter = (index) => {
    // Clear any pending timeout for this index
    if (hoverTimeoutsRef.current[index]) {
      clearTimeout(hoverTimeoutsRef.current[index]);
      delete hoverTimeoutsRef.current[index];
    }

    // Mark as actively hovered (instant transition)
    setActiveHovers((prev) => new Set(prev).add(index));

    const colors = generateRandomColors();
    setHoverColors((prev) => ({
      ...prev,
      [index]: {
        backgroundColor: colors.backgroundColor,
        color: colors.color,
      },
    }));
  };

  const handleMouseLeave = (index) => {
    // Remove from active hovers immediately so CSS transition can work
    setActiveHovers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });

    // First, wait for linger period (300ms delay from CSS)
    const lingerTimeout = setTimeout(() => {
      // Then transition to transparent (this triggers the CSS fade out)
      const itemSection = getItemSection(index);
      const isDark = shouldBeDark(itemSection);
      const defaultColor = isPlaying
        ? isDark
          ? "#434a47"
          : "#9a9e9c"
        : "#434a47";
      setHoverColors((prev) => ({
        ...prev,
        [index]: {
          backgroundColor: "transparent",
          color: defaultColor,
        },
      }));

      // Then clean up after the fade transition completes (500ms)
      const cleanupTimeout = setTimeout(() => {
        setHoverColors((prev) => {
          const newColors = { ...prev };
          delete newColors[index];
          return newColors;
        });
        delete hoverTimeoutsRef.current[index];
      }, 500);

      hoverTimeoutsRef.current[index] = cleanupTimeout;
    }, 300);

    hoverTimeoutsRef.current[index] = lingerTimeout;
  };

  return (
    <div
      className={`tracklist-container ${
        isMobile ? "tracklist-container-mobile" : "tracklist-container-desktop"
      }`}
    >
      <div className="tracklist-content">
        {selectedGuest.tracklist.map((mixTrack, index) => {
          const isSectionBreak =
            mixTrack.title === "RADIO (a)" ||
            mixTrack.title === "PROJECT" ||
            mixTrack.title === "RADIO (b)";

          const isVisible = visibleIndices.has(index);
          const isDark = isPlaying && shouldBeDark(getItemSection(index));
          // Greyed out items (playing but not dark) should not have hover effects
          const isGreyedOut = isPlaying && !isDark;

          const hasColors =
            !isMobile && !isGreyedOut && !isSectionBreak && hoverColors[index];
          const isActivelyHovered =
            !isMobile &&
            !isGreyedOut &&
            !isSectionBreak &&
            activeHovers.has(index);
          return (
            <span
              key={index}
              className={
                isVisible
                  ? "tracklist-item-wrapper"
                  : "tracklist-item-wrapper tracklist-item-wrapper-hidden"
              }
            >
              {isSectionBreak && index > 0 && (
                <>
                  <br />
                  <br />
                </>
              )}
              <span
                className={`track-item ${
                  isActivelyHovered ? "track-item-hovered" : ""
                } ${
                  !hasColors
                    ? isPlaying
                      ? isDark
                        ? "track-item-default-color"
                        : "track-item-default-color-playing"
                      : "track-item-default-color"
                    : ""
                }`}
                onMouseEnter={
                  !isMobile && !isGreyedOut && !isSectionBreak
                    ? () => handleMouseEnter(index)
                    : undefined
                }
                onMouseLeave={
                  !isMobile && !isGreyedOut && !isSectionBreak
                    ? () => handleMouseLeave(index)
                    : undefined
                }
                style={{
                  ...(isMobile || isGreyedOut || isSectionBreak
                    ? {}
                    : hoverColors[index]),
                }}
              >
                {!isSectionBreak && (
                  <span className="track-number">{index}</span>
                )}

                <span
                  className={`track-title ${
                    isSectionBreak
                      ? hasColors
                        ? "track-title-section-break-hovered"
                        : isPlaying
                        ? isDark
                          ? "track-title-section-break"
                          : "track-title-section-break-playing"
                        : "track-title-section-break"
                      : ""
                  }`}
                >
                  {mixTrack.title === "RADIO (a)"
                    ? "(a)"
                    : mixTrack.title === "PROJECT"
                    ? "(+)"
                    : mixTrack.title === "RADIO (b)"
                    ? "(b)"
                    : mixTrack.title}{" "}
                </span>
                <span className="track-artist">{mixTrack.artist}</span>
              </span>
              {isSectionBreak && <br />}
            </span>
          );
        })}
      </div>
    </div>
  );
};
