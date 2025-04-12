import React, { useRef, useEffect } from "react";
import { CursorTitle } from "../styles";

export const CustomCursor = ({ hoveredGuest, isLeft, hovered }) => {
  const { rpCount, title, title2, title3, broadcastDate } = hoveredGuest;
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

  return (
    <div
      className={"cursor"}
      ref={cursor}
      style={{ textAlign: isLeft ? "right" : "left" }}
    >
      <CursorTitle
        className="cursor-title"
        $hovered={hovered}
        $bgcolor={"rgb(247, 247, 247);"}
        $delay={0.1}
        fontSize="1.9vh"
      >
        {rpCount}
      </CursorTitle>
      <CursorTitle
        className="cursor-title"
        $hovered={hovered}
        $bgcolor="black"
        color="white"
        fontSize="1.9vh"
        $delay={0.15}
      >
        <b>{title}</b>
      </CursorTitle>
      <br />
      <CursorTitle
        className="cursor-title "
        $hovered={hovered}
        $bgcolor="black"
        color="white"
        fontSize="2.6vh"
        $delay={0.2}
      >
        <b>{title2}</b>
      </CursorTitle>
      <br />
      <CursorTitle
        className="cursor-title "
        $hovered={hovered}
        $bgcolor="black"
        color="white"
        fontSize="1.7vh"
        $delay={0.2}
      >
        <b>{title3}</b>
      </CursorTitle>
      <br />
      <CursorTitle
        className="cursor-title "
        $hovered={hovered}
        $bgcolor="black"
        color="white"
        fontSize="2vh"
        $delay={0.2}
      >
        <b>{broadcastDate}</b>
      </CursorTitle>
      <br />
    </div>
  );
};
