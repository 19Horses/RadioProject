import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CursorTitle, MainCursorTitle } from "../../styles";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return dateStr;
  const [day, month, yearShort] = parts;
  const year = 2000 + parseInt(yearShort, 10);
  const date = new Date(year, parseInt(month, 10) - 1, parseInt(day, 10));
  if (isNaN(date.getTime())) return dateStr;

  const dayNum = date.getDate();
  const suffix =
    dayNum % 10 === 1 && dayNum !== 11
      ? "st"
      : dayNum % 10 === 2 && dayNum !== 12
        ? "nd"
        : dayNum % 10 === 3 && dayNum !== 13
          ? "rd"
          : "th";

  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const monthName = date.toLocaleDateString("en-US", { month: "long" });
  return `${weekday} ${monthName} ${dayNum}${suffix}`;
};

export const CustomCursor = ({
  hoveredGuest,
  hoveredForm,
  isLeft,
  hovered,
  isMobile,
  hoveredPlay,
  dimmed,
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
    document.addEventListener("mouseenter", handleMouseEvent, {
      passive: true,
    });
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
    title4,
    length,
    broadcastDate: _broadcastDate,
    username,
    profession,
    starsign: _starsign,
    answer: _answer,
    type,
    releaseDate,
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
        opacity: dimmed ? 0.5 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      {/* Line 1 */}
      <CursorTitle
        className={isPlaying ? "cursor-title-playing" : "cursor-title"}
        $hovered={hovered}
        $bgcolor={isPlaying ? "black" : "#eeeeee"}
        $delay={0.1}
        fontSize={isGuest ? "1.9vh" : "1.9vh"}
        style={{
          fontFamily: isGuest
            ? "NHaasGroteskDSPro-75Bd"
            : "NeueHaasDisplayRoman",
          lineHeight: isGuest ? "2.3vh" : "1.9vh",
          paddingRight: ".1vw",
          paddingLeft: isGuest ? "0" : ".2vw",
          textTransform: !isGuest ? "lowercase" : "",
        }}
        $isMobile={isMobile}
      >
        <span
          style={{
            backgroundColor: isGuest ? "#434a47" : "#eeeeee",
            color: isGuest ? "#eeeeee" : "#434a47",
            paddingLeft: isGuest ? ".2vw" : "0",
            paddingRight: isGuest ? ".2vw" : "0",
          }}
        >
          {isGuest ? `${title2}` : username}
        </span>
        <span>{isGuest && `  →  ${title}`}</span>
      </CursorTitle>
      <br />

      {/* Line 2 */}
      {!isPlaying && (
        <MainCursorTitle
          className="cursor-title"
          $hovered={hovered}
          $bgcolor={isGuest ? "#eeeeee" : "#434a47"}
          color={isGuest ? "#837D7D" : "#eeeeee"}
          fontSize={isGuest ? "1.7vh" : "1.9vh"}
          $delay={0.1}
          style={{
            position: "relative",
            textTransform: isGuest ? "" : "lowercase",
            paddingLeft: ".2vw",
            paddingRight: ".3vw",
            lineHeight: isGuest ? "2.1vh" : "1.9vh",
            paddingBottom: isGuest ? ".2vh" : "0",
            paddingTop: isGuest ? ".2vh" : "0",
          }}
          $isMobile={isMobile}
        >
          {isGuest ? (
            <>
              {type === "mix" ? `${title4} with ` : `${title4} `}
              <span style={{ fontFamily: "NeueHaasDisplayMedium" }}>
                {title3}
              </span>
            </>
          ) : (
            profession
          )}
        </MainCursorTitle>
      )}

      {/* Line 3 - title3 */}
      {!isPlaying && isGuest && title3 && (
        <>
          <br />
          <MainCursorTitle
            className="cursor-title"
            $hovered={hovered}
            $bgcolor="#eeeeee"
            color="#837D7D"
            fontSize="1.7vh"
            $delay={0.1}
            style={{
              position: "relative",
              paddingLeft: ".2vw",
              paddingRight: ".3vw",
              paddingBottom: ".2vh",
              paddingTop: ".2vh",
            }}
            $isMobile={isMobile}
          >
            <span style={{ fontFamily: "NeueHaasDisplayMedium" }}>
              {length}
            </span>{" "}
            → {formatDate(releaseDate)}
          </MainCursorTitle>
        </>
      )}
    </div>,
    document.body,
  );
};
