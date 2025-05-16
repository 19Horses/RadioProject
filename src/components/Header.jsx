import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Logo } from "./Logo";

const StyledLink = styled(Link)`
  font-family: Helvetica;
  font-size: ${(props) => (props.$isCurrentPath ? "2.5vh" : "1.6vh")};
  color: black;
  font-weight: ${(props) => (props.$isCurrentPath ? "1000" : "100")};
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  margin-left: 2.5vw;
  margin-right: 1.5vw;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: black;
    color: white;
    font-size: 2.5vh;
  }
`;

const NavItem = ({ text, to, external }) => {
  const { pathname } = useLocation();
  return (
    <StyledLink
      target={external ? "_blank" : ""}
      to={to}
      $isCurrentPath={pathname === to}
    >
      {text}
    </StyledLink>
  );
};

const Links = () => (
  <>
    <NavItem text="Archive" to="/" external={false} />
    <NavItem text="Chat" to="/chat" external={false} />
    <NavItem
      text="Nina"
      to="https://www.ninaprotocol.com/profiles/radio-project"
      external
    />
    <NavItem
      text="SoundCloud"
      to="https://soundcloud.com/radio_project"
      external
    />
    <NavItem
      text="Instagram"
      to="https://www.instagram.com/radio__project/"
      external
    />
    <NavItem text="About" to="/about" external={false} />
  </>
);

export const Header = ({ isMobile }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <Logo isMobile />
        <header className="header-container">
          <nav className="header-nav">
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
                    setTimeout(() => {
                      setMenuOpen(false);
                    }, 50);
                  }}
                >
                  <div className="dropdown-content">
                    <Links />
                  </div>
                </div>
              )}
            </>
          </nav>
        </header>
      </>
    );
  }

  return (
    <>
      <Logo isMobile={isMobile} />
      <header className="header-container">
        <nav className="header-nav">
          <Links />
        </nav>
      </header>
    </>
  );
};
