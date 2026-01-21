import React from "react";
import "./CornerFrames.css";

export const CornerFrames = () => {
  return (
    <>
      <img
        src="/frame.svg"
        alt="tl"
        className="corner-frame corner-frame-top-left"
      />
      <img
        src="/frame.svg"
        alt="tr"
        className="corner-frame corner-frame-top-right"
      />
      <img
        src="/frame.svg"
        alt="br"
        className="corner-frame corner-frame-bottom-right"
      />
      <img
        src="/frame.svg"
        alt="bl"
        className="corner-frame corner-frame-bottom-left"
      />
    </>
  );
};

