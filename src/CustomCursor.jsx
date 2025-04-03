import React, { useRef, useEffect } from "react";
import { CursorTitle } from "./styles";

export const CustomCursor = ({ hoveredArtist, isLeft, hovered }) => {
  const { rpCount, title, title2, title3, title4, title5, title6 } =
    hoveredArtist;
  const cursor = useRef(null);

  useEffect(() => {
    const moveCursor = (event) => {
      if (!cursor.current) return;

      const { clientX, clientY } = event;
      const offsetX = isLeft ? -16 : 1; // Shift text left or right
      const offsetY = -20; // Small offset to position text slightly below the cursor
      const vw = window.innerWidth / 100;

      cursor.current.style.transform = `translate3d(${
        clientX / vw + offsetX
      }vw, ${clientY + offsetY}px, 0)`;
    };

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, [isLeft]); // Re-run effect when isLeft changes

  return (
    <div
      className={"cursor"}
      ref={cursor}
      style={{ textAlign: isLeft ? "right" : "left" }}
    >
      <CursorTitle
        className="cursor-title"
        hovered={hovered}
        bgColor={"rgb(247, 247, 247);"}
        delay={0.1}
        fontSize="1.9vh"
      >
        {rpCount}
      </CursorTitle>
      <CursorTitle
        className="cursor-title"
        hovered={hovered}
        bgColor="black"
        color="white"
        fontSize="1.9vh"
        delay={0.15}
      >
        <b>{title}</b>
      </CursorTitle>
      <br />
      <CursorTitle
        className="cursor-title "
        hovered={hovered}
        bgColor="black"
        color="white"
        fontSize="2.6vh"
        delay={0.2}
      >
        <b>{title2}</b>
      </CursorTitle>
      <br />
      <CursorTitle
        className="cursor-title "
        hovered={hovered}
        bgColor="black"
        color="white"
        fontSize="2vh"
        delay={0.2}
      >
        <b>{title3}</b>
      </CursorTitle>
      <br />
      <CursorTitle
        className="cursor-title "
        hovered={hovered}
        bgColor="black"
        color="white"
        fontSize="2vh"
        delay={0.2}
      >
        <b>{title4}</b>
      </CursorTitle>
      <br />
      <CursorTitle
        className="cursor-title "
        hovered={hovered}
        bgColor="black"
        color="white"
        fontSize="2vh"
        delay={0.2}
      >
        <b>{title5}</b>
      </CursorTitle>
      <br />
      <CursorTitle
        className="cursor-title "
        hovered={hovered}
        bgColor="black"
        color="white"
        fontSize="2vh"
        delay={0.2}
      >
        <b>{title6}</b>
      </CursorTitle>
    </div>
  );
};
