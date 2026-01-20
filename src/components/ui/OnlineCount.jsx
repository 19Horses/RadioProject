import React from "react";
import "./OnlineCount.css";

export const OnlineCount = ({ onlineCount, isMobile }) => {
  if (isMobile) return null;

  return (
    <div className="online-count">
      <span>({onlineCount})</span>
    </div>
  );
};

