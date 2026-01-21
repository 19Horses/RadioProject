import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Logo = ({ isMobile, darkMode, setDarkMode }) => {
  const [headerHover, setHeaderHover] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className={` ${
        isMobile
          ? "header-logo-b header-logo-mob"
          : "header-logo header-logo-norm"
      }`}
    >
      <a
        onClick={() => {
          navigate("/");
        }}
      >
        <img
          onMouseOver={() => {
            setHeaderHover(true);
          }}
          onMouseLeave={() => {
            setHeaderHover(false);
          }}
          style={{ filter: darkMode ? "invert(1)" : "" }}
          className="main"
          src="/transplogo2.png"
          alt="Logo"
        />
      </a>
      {!isMobile && (
        <a>
          <img
            className="second spin"
            style={{
              opacity: headerHover === true ? "1" : "0",
              transform: headerHover === true ? "translateX(-6%)" : "",
            }}
            src="/transplogo.png"
          />
        </a>
      )}
    </div>
  );
};
