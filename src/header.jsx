const Header = () => {
  return (
    <>
      <header className="header-container">
        <nav className="header-nav">
          <a className="header-item">Info</a>
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
          <a className="header-item" target="_blank">
            Articles
          </a>
        </nav>
      </header>
    </>
  );
};

export default Header;
