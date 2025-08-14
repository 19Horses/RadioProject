import React, { useRef, useEffect } from "react";
import { CursorTitle, MainCursorTitle } from "../styles";

export const CustomCursor = ({
  hoveredGuest,
  hoveredForm,
  isLeft,
  hovered,
  isMobile,
}) => {
  const cursor = useRef(null);

  useEffect(() => {
    const moveCursor = (event) => {
      if (!cursor.current) return;

      const { clientX, clientY } = event;
      const offsetX = isLeft ? -16 : 1;
      const offsetY = -20;
      const vw = window.innerWidth / 100;

      cursor.current.style.transform = `translate3d(${
        clientX / vw + offsetX
      }vw, ${clientY + offsetY}px, 0)`;
    };

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, [isLeft]);

  const isGuest = !!hoveredGuest;
  const data = isGuest ? hoveredGuest : hoveredForm || {};

  const {
    rpCount,
    title,
    title2,
    title3,
    broadcastDate,
    username,
    profession,
    starsign,
    answer,
  } = data;

  return (
    <div
      className="cursor"
      ref={cursor}
      style={{
        textAlign: isLeft ? "right" : "left",
      }}
    >
      {/* Line 1 */}
      <CursorTitle
        className="cursor-title"
        $hovered={hovered}
        $bgcolor={"rgb(247, 247, 247)"}
        $delay={0.1}
        fontSize="1.9vh"
        style={{
          paddingRight: ".3vw",
          paddingLeft: ".2vw",
          textTransform: isGuest ? "" : "lowercase",
        }}
        $isMobile={isMobile}
      >
        {isGuest ? rpCount : username}
      </CursorTitle>
      {!isGuest && <br />}

      {/* Line 2 */}
      <MainCursorTitle
        className="cursor-title"
        $hovered={hovered}
        $bgcolor="black"
        color="white"
        fontSize="1.9vh"
        $delay={0.15}
        style={{
          textTransform: isGuest ? "" : "lowercase",
          paddingLeft: isGuest ? "" : ".2vw",
          paddingRight: isGuest ? "" : ".3vw",
        }}
        $isMobile={isMobile}
      >
        <b>{isGuest ? title : profession}</b>
      </MainCursorTitle>
      <br />
      <div
        style={{
          marginTop: ".5vh",
        }}
      >
        {/* Line 3 */}
        {isGuest && (
          <CursorTitle
            className="cursor-title"
            $hovered={hovered}
            $bgcolor="black"
            color="white"
            fontSize="2.6vh"
            $delay={0.2}
            style={{ paddingBottom: ".3vh" }}
            $isMobile={isMobile}
          >
            <b>{title2}</b>
          </CursorTitle>
        )}
        <br />

        {/* Line 4 */}
        {isGuest && (
          <CursorTitle
            className="cursor-title"
            $hovered={hovered}
            $bgcolor="black"
            color="white"
            fontSize="2vh"
            $delay={0.2}
            $isMobile={isMobile}
          >
            <b>{title3}</b>
          </CursorTitle>
        )}

        {/* Line 5 (only for guests) */}
        {isGuest && (
          <>
            <br />
            <CursorTitle
              className="cursor-title"
              $hovered={hovered}
              $bgcolor="black"
              color="white"
              fontSize="2vh"
              $delay={0.2}
              $isMobile={isMobile}
            >
              <b>{broadcastDate}</b>
            </CursorTitle>
          </>
        )}
      </div>
    </div>
  );
};
