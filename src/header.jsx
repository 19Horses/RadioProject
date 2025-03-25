import { useState } from "react";

const Header = ({ onInfoClick, onArticleClick, onRadioClick }) => {
  const [selected, setSelected] = useState("Radio");
  return (
    <>
      <header className="header-container">
        <nav className="header-nav">
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
              fontWeight: "bold",
              color: selected === "Info" ? "red" : "black",
            }}
          >
            &#9432;
          </a>
        </nav>
      </header>
    </>
  );
};

export default Header;
