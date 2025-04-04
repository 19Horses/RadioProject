import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();
  const { pathname } = useLocation();

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
                className={`dropdown-menu slide-in`}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                <div className="dropdown-content">
                  <a
                    className="header-item"
                    onClick={() => {
                      navigate("/");
                      setMenuOpen(false);
                    }}
                    style={{
                      cursor: "pointer",
                      color: pathname === "/" ? "rgb(255, 0, 90)" : "black",
                    }}
                  >
                    <b>Archive</b>
                  </a>
                  {/* <a
                  className="header-item"
                  onClick={() => {
                    navigate('/articles')
                    setMenuOpen(false);
                  }}
                  style={{
                    cursor: "pointer",
                    //color: "black",
                    color: pathname === '/articles' ? "red" : "black",
                  }}
                  target="_blank"
                >
                  <b>Radiograms</b>
                </a> */}
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
                      navigate("/about");
                      setMenuOpen(false);
                    }}
                    style={{
                      cursor: "pointer",
                      color:
                        pathname === "/about" ? "rgb(255, 0, 90)" : "black",
                    }}
                  >
                    About
                  </a>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <a
              className="header-item"
              onClick={() => {
                navigate("/");
              }}
              style={{
                cursor: "pointer",
                color: pathname === "/" ? "rgb(255, 0, 90)" : "black",
              }}
            >
              <b>Archive</b>
            </a>
            {/* <a
              className="header-item"
              onClick={() => {
                //
                navigate("/articles");
              }}
              style={{
                cursor: "pointer",
                color: pathname === "/articles" ? "rgb(255, 0, 90)" : "black",
                //color: "black",
              }}
              target="_blank"
            >
              <b>Radiograms</b>
            </a> */}
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
                navigate("/about");
              }}
              style={{
                cursor: "pointer",
                color: pathname === "/about" ? "rgb(255, 0, 90)" : "black",
              }}
            >
              About
            </a>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
