import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Logo } from "./Logo";

const StyledLink = styled(Link)`
  font-family: Helvetica;
  font-size: 1.8vh;
  color: black;
  font-weight: ${(props) => (props.$isCurrentPath ? "1000" : "100")};
  font-size: ${(props) => (props.$isMobile ? "2.3vh" : "1.8vh")};
  text-decoration: none;
  transition: opacity 0.3s ease-in-out;
  padding-bottom: 0.5vh;
  text-align: ${(props) => (props.$isMobile ? "right" : "left")};
  background-color: ${(props) => (props.$isMobile ? "#f7f7f72" : "")};
  background-color: ${(props) => (props.$isMobile ? "#f7f7f72" : "#f7f7f7")};
  padding-left: 0.5vw;
  padding-right: 0.5vw;
  cursor: pointer;

  &:hover {
    opacity: 0.3;
  }
`;

const NavItem = ({
  text,
  to,
  external,
  menuOpen,
  onMouseEnter,
  onClick,
  isMobile,
}) => {
  const { pathname } = useLocation();
  return (
    <StyledLink
      target={external ? "_blank" : ""}
      to={to}
      $isCurrentPath={pathname === to}
      style={{
        opacity: text === "+ Menu" ? 1 : menuOpen ? 1 : 0,
        pointerEvents: text === "+ Menu" ? "Auto" : menuOpen ? "auto" : "none",
      }}
      className="styledlink"
      onMouseEnter={onMouseEnter} // ← pass it here
      $menuOpen={menuOpen}
      onClick={onClick}
      $isMobile={isMobile}
    >
      {text}
    </StyledLink>
  );
};

const Links = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
      onMouseLeave={() => {
        setMenuOpen(false);
      }}
    >
      {menuOpen && (
        <>
          <NavItem
            text="+ Archive"
            to="/"
            external={false}
            menuOpen={menuOpen}
          />
          <NavItem
            text="+ Visitor Log"
            to="/visitorcheck"
            external={false}
            menuOpen={menuOpen}
          />
          <NavItem
            text="+ Nina"
            to="https://www.ninaprotocol.com/profiles/radio-project"
            external
            menuOpen={menuOpen}
          />
          <NavItem
            text="+ SoundCloud"
            to="https://soundcloud.com/radio_project"
            external
            menuOpen={menuOpen}
          />
          <NavItem
            text="+ Instagram"
            to="https://www.instagram.com/radio__project/"
            external
            menuOpen={menuOpen}
          />
          <NavItem
            text="+ Contact"
            to="mailto:contact@radioproject.live"
            external
            menuOpen={menuOpen}
          />
        </>
      )}

      <NavItem
        text="+ Menu"
        external={false}
        menuOpen={menuOpen}
        onMouseEnter={() => {
          setMenuOpen(true);
          console.log("Menu opened");
        }}
      />
    </div>
  );
};

const MobileLinks = ({ menuOpen, setMenuOpen, isMobile }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <NavItem
        text={`${menuOpen ? "- Menu" : "+ Menu"}`}
        external={false}
        menuOpen={menuOpen}
        onClick={() => {
          console.log("toggling menu");
          setMenuOpen((prev) => !prev);
        }}
        isMobile={isMobile}
        style={{ zIndex: 9999 }}
      />
      <NavItem
        text="+ Archive"
        to="/"
        external={false}
        menuOpen={menuOpen}
        isMobile={isMobile}
        onClick={() => {
          console.log("toggling menu");
          setMenuOpen((prev) => !prev);
        }}
      />
      {/* <NavItem text="Chat" to="/chat" external={false} /> */}

      <NavItem
        text="+ Visitor Log"
        to="/visitorcheck"
        external={false}
        menuOpen={menuOpen}
        isMobile={isMobile}
        onClick={() => {
          console.log("toggling menu");
          setMenuOpen((prev) => !prev);
        }}
      />
      <NavItem
        text="+ Nina"
        to="https://www.ninaprotocol.com/profiles/radio-project"
        external
        menuOpen={menuOpen}
        isMobile={isMobile}
        onClick={() => {
          console.log("toggling menu");
          setMenuOpen((prev) => !prev);
        }}
      />
      <NavItem
        text="+ SoundCloud"
        to="https://soundcloud.com/radio_project"
        external
        menuOpen={menuOpen}
        isMobile={isMobile}
        onClick={() => {
          console.log("toggling menu");
          setMenuOpen((prev) => !prev);
        }}
      />
      <NavItem
        text="+ Instagram"
        to="https://www.instagram.com/radio__project/"
        external
        menuOpen={menuOpen}
        isMobile={isMobile}
        onClick={() => {
          console.log("toggling menu");
          setMenuOpen((prev) => !prev);
        }}
      />
    </div>
  );
};

export const Header = ({ isMobile, isPlaying, headerOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <Logo isMobile />
        <header className="header-container" style={{}}>
          <nav className="header-nav">
            <div
              className={`dropdown-menu slide-in`}
              style={{
                backgroundColor: !menuOpen ? "transparent" : "#f7f7f7f2",
                transition: "all .3s ease-in-out",
                pointerEvents: menuOpen ? "auto" : "none",
                right: isPlaying ? "6vw" : "",
              }}
            >
              <div
                className="dropdown-content"
                style={{ paddingTop: "3vh", marginRight: "4vw" }}
              >
                <MobileLinks
                  menuOpen={menuOpen}
                  setMenuOpen={setMenuOpen}
                  isMobile={isMobile}
                />
              </div>
            </div>
          </nav>
        </header>
      </>
    );
  }

  return (
    <>
      <Logo isMobile={isMobile} />

      <nav className="header-nav" style={{ zIndex: "99999999" }}>
        <Links />
      </nav>
    </>
  );
};
