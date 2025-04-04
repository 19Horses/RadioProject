import React, { useState } from "react";

export const Logo = ({ onClick, isMobile }) => {
  const [headerHover, setHeaderHover] = useState(false);
  return (
    <div
      className={`header-logo ${
        isMobile ? "header-logo-mob" : "header-logo-norm"
      }`}
    >
      <a
        onClick={() => {
          onClick();
        }}
      >
        <img
          onMouseOver={() => {
            setHeaderHover(true);
          }}
          onMouseLeave={() => {
            setHeaderHover(false);
          }}
          className="main"
          src="./transplogo.png"
          alt="Logo"
        />
      </a>
      {!isMobile && (
        <a>
          <img
            className="second"
            style={{
              opacity: headerHover === true ? "1" : "0",
              transform: headerHover === true ? "translateX(10%)" : "",
            }}
            src="./transplogo2.png"
          />
        </a>
      )}
    </div>
  );
};
