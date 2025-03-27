import { useState, useEffect } from "react";

const Header = ({ onInfoClick, onArticleClick, onRadioClick }) => {
  const [selected, setSelected] = useState("Radio");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="header-container">
      <nav className="header-nav">
        {isMobile ? (
          <>
            <div className="menu-toggle-container">
              <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰
              </button>
            </div>
            {menuOpen && (
              <div
                className="dropdown-menu slide-in"
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                <a
                  className="header-item"
                  onClick={() => {
                    onRadioClick();
                    setSelected("Radio");
                    setMenuOpen(false);
                  }}
                  style={{
                    cursor: "pointer",
                    color: selected === "Radio" ? "red" : "black",
                  }}
                >
                  <b>Radio</b>
                </a>
                <a
                  className="header-item"
                  onClick={() => {
                    onArticleClick();
                    setSelected("Articles");
                    setMenuOpen(false);
                  }}
                  style={{
                    cursor: "pointer",
                    color: selected === "Articles" ? "red" : "black",
                  }}
                  target="_blank"
                >
                  <b>Articles</b>
                </a>
                <a
                  className="header-item"
                  target="_blank"
                  href="https://www.ninaprotocol.com/profiles/radio-project"
                >
                  Nina
                </a>
                <a
                  className="header-item"
                  target="_blank"
                  href="https://soundcloud.com/radio_project"
                >
                  SoundCloud
                </a>
                <a
                  className="header-item"
                  target="_blank"
                  href="https://www.instagram.com/radio__project/"
                >
                  Instagram
                </a>
                <a
                  className="header-item"
                  onClick={() => {
                    onInfoClick();
                    setSelected("Info");
                    setMenuOpen(false);
                  }}
                  style={{
                    cursor: "pointer",
                    color: selected === "Info" ? "red" : "black",
                  }}
                >
                  Info
                </a>
              </div>
            )}
          </>
        ) : (
          <>
            <a
              className="header-item"
              onClick={() => {
                onRadioClick();
                setSelected("Radio");
              }}
              style={{
                cursor: "pointer",
                color: selected === "Radio" ? "red" : "black",
              }}
            >
              <b>Radio</b>
            </a>
            <a
              className="header-item"
              onClick={() => {
                onArticleClick();
                setSelected("Articles");
              }}
              style={{
                cursor: "pointer",
                color: selected === "Articles" ? "red" : "black",
              }}
              target="_blank"
            >
              <b>Articles</b>
            </a>
            <a
              className="header-item"
              target="_blank"
              href="https://www.ninaprotocol.com/profiles/radio-project"
            >
              Nina
            </a>
            <a
              className="header-item"
              target="_blank"
              href="https://soundcloud.com/radio_project"
            >
              SoundCloud
            </a>
            <a
              className="header-item"
              target="_blank"
              href="https://www.instagram.com/radio__project/"
            >
              Instagram
            </a>
            <a
              className="header-item"
              onClick={() => {
                onInfoClick();
                setSelected("Info");
              }}
              style={{
                cursor: "pointer",
                color: selected === "Info" ? "red" : "black",
              }}
            >
              Info
            </a>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
