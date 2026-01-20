import React, { useEffect, useRef } from "react";
import Comments from "../comments/Comments";
import "./Bookmark.css";

export default function MobileMenuTopBar({
  currentArticle,
  chatUser,
  setChatUser,
  isMobile,
  playingGuest,
  menuOpen,
  setMenuOpen,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Ensure the container maintains its height during menu animation
    if (containerRef.current && menuOpen) {
      const height = containerRef.current.scrollHeight;
      containerRef.current.style.minHeight = `${height}px`;
    }
  }, [menuOpen, currentArticle]);

  if (!currentArticle) return null;

  return (
    <div ref={containerRef} className="mobile-menu-content">
      {/* Comments section for mobile */}
      <Comments
        itemId={currentArticle.url}
        itemType={currentArticle.type}
        chatUser={chatUser}
        setChatUser={setChatUser}
        isMobile={isMobile}
        playingGuest={playingGuest}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </div>
  );
}

