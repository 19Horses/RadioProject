import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CursorTitle, MainCursorTitle } from "../../styles";

export const CustomCursor = ({
  hoveredGuest,
  hoveredForm,
  isLeft,
  hovered,
  isMobile,
  hoveredPlay,
}) => {
  const cursor = useRef(null);
  const [hasMousePosition, setHasMousePosition] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastX = 0;
    let lastY = 0;

    const updateCursor = () => {
      if (!cursor.current) return;

      const offsetX = isLeft ? -16 : 1;
      const offsetY = -20;
      const vw = window.innerWidth / 100;

      cursor.current.style.transform = `translate3d(${
        lastX / vw + offsetX
      }vw, ${lastY + offsetY}px, 0)`;

      ticking = false;
    };

    const handleMouseEvent = (event) => {
      lastX = event.clientX;
      lastY = event.clientY;

      if (!hasMousePosition) {
        setHasMousePosition(true);
      }

      if (!ticking) {
        requestAnimationFrame(updateCursor);
        ticking = true;
      }
    };

    // Listen to multiple events to capture initial position
    document.addEventListener("mousemove", handleMouseEvent, { passive: true });
    document.addEventListener("mouseenter", handleMouseEvent, { passive: true });
    document.addEventListener("mouseover", handleMouseEvent, { passive: true });
    
    return () => {
      document.removeEventListener("mousemove", handleMouseEvent);
      document.removeEventListener("mouseenter", handleMouseEvent);
      document.removeEventListener("mouseover", handleMouseEvent);
    };
  }, [isLeft, hasMousePosition]);

  const isGuest = !!hoveredGuest;
  const isPlaying = !!hoveredPlay;
  const data = isGuest ? hoveredGuest : hoveredForm || {};

  const {
    rpCount: _rpCount,
    title,
    title2,
    title3,
    broadcastDate: _broadcastDate,
    username,
    profession,
    starsign: _starsign,
    answer: _answer,
    type,
  } = data;

  // Use portal to render cursor at document.body level
  // This ensures it's not affected by parent transforms/filters
  return createPortal(
    <div
      className="cursor"
      ref={cursor}
      style={{
        textAlign: isLeft ? "right" : "left",
        visibility: hasMousePosition ? "visible" : "hidden",
      }}
    >
      {/* Line 1 */}
      <CursorTitle
        className={isPlaying ? "cursor-title-playing" : "cursor-title"}
        $hovered={hovered}
        $bgcolor={isPlaying ? "black" : "rgb(247, 247, 247)"}
        $delay={0.1}
        fontSize="1.9vh"
        style={{
          paddingRight: ".1vw",
          paddingLeft: ".2vw",
          textTransform: "lowercase",
        }}
        $isMobile={isMobile}
      >
        {isGuest
          ? `${title} [${type === "mix" ? "mix" : "article"}]`
          : username}
      </CursorTitle>
      <br />

      {/* Line 2 */}
      {!isPlaying && (
        <MainCursorTitle
          className="cursor-title"
          $hovered={hovered}
          $bgcolor="#434a47"
          color="white"
          fontSize="1.9vh"
          $delay={0.1}
          style={{
            position: "relative",
            textTransform: "lowercase",
            paddingLeft: ".2vw",
            paddingRight: ".3vw",
          }}
          $isMobile={isMobile}
        >
          {isGuest ? title2 : profession}
        </MainCursorTitle>
      )}

      {/* Line 3 - title3 */}
      {!isPlaying && isGuest && title3 && (
        <>
          <br />
          <MainCursorTitle
            className="cursor-title"
            $hovered={hovered}
            $bgcolor="#434a47"
            color="#ececec"
            fontSize="1.9vh"
            $delay={0.1}
            style={{
              position: "relative",
              textTransform: "lowercase",
              paddingLeft: ".2vw",
              paddingRight: ".3vw",
            }}
            $isMobile={isMobile}
          >
            {title3}
          </MainCursorTitle>
        </>
      )}
    </div>,
    document.body
  );
};
