import React, { useEffect, useMemo, useRef, useState } from "react";
import { AudioProvider } from "./AudioContext.jsx";
import { CustomCursor } from "./CustomCursor.jsx";
import { Guest } from "./Guest.jsx";
import Header from "./header";
import { Info } from "./Info.jsx";
import { writers as items2 } from "./articles.js";
import { djs as items } from "./items.js";
import { Landing } from "./Landing.jsx";
import { Logo } from "./Logo.jsx";
import SoundCloudPlayer from "./soundcloudPlayer";
import { Article } from "./Article.jsx";

export default function ClosedPage() {
  const [hoveredGuest, setHoveredGuest] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [playingGuest, setPlayingGuest] = useState(null);

  const selectedGuest = useMemo(() => {
    if (selectedIndex !== null) {
      return items[selectedIndex];
    } else {
      return null;
    }
  }, [selectedIndex]);

  const [hovered, setHovered] = useState(false);

  const [w, setW] = useState(null);
  const flexContainer = useRef(null);
  const [isLeft, setIsLeft] = useState(false);

  const [infoSelected, setInfoSelected] = useState(false);
  const [articleHeaderSelected, setarticleHeaderSelected] = useState(false);
  const [articleSelected, setArticleSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileIndex] = useState(0);

  const resetInfo = () => {
    setSelectedIndex(null);
    setArticleSelected(null);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (flexContainer.current) {
      setW(flexContainer.current.clientWidth / items.length);
    }
    const handleResize = () => {
      setW(flexContainer.current.clientWidth / items.length);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [flexContainer]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("articleFadeIn");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("p:not(red)");
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  });

  return (
    <>
      <div className={"gradient-overlay-tl"} />
      {playingGuest && (
        <AudioProvider>
          <SoundCloudPlayer playingGuest={playingGuest} />
        </AudioProvider>
      )}
      {hoveredGuest && isMobile === false && (
        <CustomCursor
          hoveredGuest={hoveredGuest}
          isLeft={isLeft}
          hovered={hovered}
        />
      )}
      <Header
        onInfoClick={() => {
          setInfoSelected(true);
          resetInfo();
          setarticleHeaderSelected(false);
          setArticleSelected(null);
          scrollToTop();
        }}
        onArticleClick={() => {
          setInfoSelected(false);
          setarticleHeaderSelected(true);
          setArticleSelected(null);
          resetInfo();
          scrollToTop();
        }}
        onRadioClick={() => {
          setInfoSelected(false);
          setSelectedIndex(null);
          setarticleHeaderSelected(false);
          setArticleSelected(null);
          scrollToTop();
        }}
      />
      <Logo
        onClick={() => {
          resetInfo();
          setInfoSelected(false);
        }}
        isMobile={isMobile}
      />
      {!infoSelected && !articleHeaderSelected && (
        <Landing
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          flexContainer={flexContainer}
          isMobile={isMobile}
          mobileIndex={mobileIndex}
          setHovered={setHovered}
          setHoveredGuest={setHoveredGuest}
          setIsLeft={setIsLeft}
          w={w}
        />
      )}
      {infoSelected == true && <Info isMobile={isMobile} />}
      {selectedIndex != null && (
        <>
          <div
            className={` ${
              isMobile
                ? "selected-artist-container-mob-addon"
                : "selected-artist-container"
            }`}
          >
            <div
              className="all-left-cont"
              style={{
                top: isMobile ? "7%" : "",
              }}
            >
              <div className="description-container">
                <p className="description-header" style={{ fontSize: "3.7vh" }}>
                  <span
                    style={{
                      fontFamily: "Helvetica",
                      fontWeight: "100",
                    }}
                  >
                    {items[selectedIndex]?.rpCount}
                  </span>{" "}
                  <span
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      padding: "2px 5px", // Optional for better visibility
                    }}
                  >
                    <b>{items[selectedIndex]?.title}</b>
                  </span>
                </p>
              </div>

              <div className="artist-pics">
                <a>
                  <img
                    src={items[selectedIndex]?.["2ppSrc"]}
                    className="selected-artist-image"
                  />
                </a>
                <div
                  className="selectTrack"
                  onClick={() => {
                    setPlayingGuest(selectedGuest);
                  }}
                >
                  <FaPlay style={{ fontSize: "1.3vh" }} /> PLAY
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "2vh",
                }}
              >
                <div>
                  <p className="slight-info" style={{ fontSize: "1.2vh" }}>
                    <a
                      style={{
                        fontWeight: "100",
                        fontSize: "2vh",
                        lineHeight: "1.5",
                        textDecoration: "none",
                        cursor: "pointer",
                        color: "black",
                      }}
                      href="https://www.instagram.com/ubiifuruuu/"
                      target="_blank"
                    >
                      <b>{items[selectedIndex]?.title2}</b>
                    </a>
                    <br />
                    <span
                      style={{
                        fontWeight: "100",
                      }}
                    >
                      {items[selectedIndex]?.broadcastDate}
                    </span>
                    <br />
                    <span
                      style={{
                        fontWeight: "100",
                      }}
                    >
                      {items[selectedIndex]?.length}
                    </span>
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "stretch", // Ensures child elements stretch to full height
                    border: "1px solid black",
                    paddingLeft: ".8vh",
                    paddingRight: ".8vh",
                    fontSize: "1.2vh",
                    height: "100%", // Makes the div take full height of the parent
                    margin: "auto",
                    marginRight: "0",
                  }}
                >
                  <p>
                    <b>{items[selectedIndex]?.genre}</b>
                  </p>
                </div>
                <div
                  className="socials"
                  style={{
                    display: "flex",
                    margin: "auto",
                    marginRight: "0",
                  }}
                >
                  <a href={items[selectedIndex]?.scLink} target="_blank">
                    <img src="/sc.svg" className="sc-logo" />
                  </a>
                  <a href={items[selectedIndex]?.npLink} target="_blank">
                    <img src="/np.png" className="sc-logo" />
                  </a>
                  <a href={items[selectedIndex]?.igLink} target="_blank">
                    <img src="/ig.jpg" className="sc-logo" />
                  </a>
                </div>
              </div>
              <p
                style={{
                  fontSize: "2.9vh",
                  fontWeight: "100",
                }}
                dangerouslySetInnerHTML={{
                  __html: items[selectedIndex]?.description,
                }}
              />
              {/* {isMobile ? <div style={{ height: "100px" }} /> : <></>} */}
            </div>
          </div>
          {selectedGuest && !isMobile && (
            <Tracklist selectedGuest={selectedGuest} />
          )}
        </>
      )}
      {articleHeaderSelected && articleSelected === null && (
        <>
          <div
            className={` ${
              isMobile
                ? "selected-artist-container-mob-addon"
                : "selected-article-container_desktop"
            }`}
          >
            <div
              className="all-left-cont"
              style={{
                top: isMobile ? "10%" : "",
                width: "96%",
                height: "100%",
              }}
            >
              {items2.map((pic) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "2vh",
                      height: "9vh",
                    }}
                    onClick={() => {
                      setArticleSelected(pic);
                      scrollToTop();
                    }}
                  >
                    <div
                      className="artist-pics"
                      style={{
                        height: "9vh",
                        width: "9vh",
                      }}
                    >
                      <a target="_blank">
                        <img
                          src={pic.src}
                          className="selected-artist-image"
                          style={{ width: "fit-content", flexShrink: "0" }}
                        />
                      </a>
                    </div>
                    <div style={{ width: "60%", paddingLeft: "1vh" }}>
                      <div className="slight-info" style={{ fontSize: "1vh" }}>
                        <a
                          style={{
                            fontWeight: "100",
                            fontSize: "1vh",
                            textDecoration: "none",
                            cursor: "pointer",
                            color: "black",
                            textTransform: "uppercase",
                          }}
                          target="_blank"
                        >
                          <b>{pic.title}</b>
                        </a>
                      </div>

                      <div
                        className={
                          "scrolling-title-container-mob-article-addon"
                        }
                        style={{ width: "100%" }}
                      >
                        <p>{pic.title2}</p>
                      </div>
                      <div
                        className={
                          "scrolling-title-container-mob-article-addon"
                        }
                        style={{ width: "100%", bottom: 0 }}
                      >
                        <p style={{ fontSize: ".8vh" }}>{pic.releaseDate}</p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "stretch", // Ensures child elements stretch to full height
                        border: "1px solid black",
                        paddingLeft: ".8vh",
                        paddingRight: ".8vh",
                        fontSize: ".8vh",
                        height: "25%",
                        margin: "auto",
                        marginRight: "0",
                        marginLeft: "0",
                        width: "15%",
                      }}
                    >
                      <p
                        style={{
                          textAlign: "center",
                          justifyContent: "center",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <b>{pic?.tag}</b>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      {/* Selected Article */}
      {articleSelected != null && (
        <>
          {!isMobile ? (
            <div className="article-content__desktop">
              <p
                className="article-content-text__desktop"
                dangerouslySetInnerHTML={{
                  __html: articleSelected?.description,
                }}
              />
            </div>
          ) : null}
          <div
            className={` ${
              isMobile
                ? "mobile-article-container"
                : "selected-article-container"
            }`}
          >
            <div className="description-container">
              <p className="description-header" style={{ fontSize: "3.7vh" }}>
                <span
                  style={{
                    fontFamily: "Helvetica",
                    fontWeight: "100",
                  }}
                >
                  {articleSelected?.rpCount}
                </span>{" "}
                <span
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    padding: "2px 5px", // Optional for better visibility
                  }}
                >
                  <b>{articleSelected?.title2}</b>
                </span>
              </p>
            </div>

            <div className="artist-pics">
              <a onClick={() => resetInfo()} target="_blank">
                <img
                  src={articleSelected?.src}
                  className="selected-artist-image"
                />
              </a>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "2vh",
              }}
            >
              {" "}
              <div>
                <p className="slight-info" style={{ fontSize: "1.2vh" }}>
                  <a
                    style={{
                      fontWeight: "100",
                      fontSize: "2vh",
                      lineHeight: "1.5",
                      textDecoration: "none",
                      cursor: "pointer",
                      color: "black",
                    }}
                    href={articleSelected?.igLink}
                    target="_blank"
                  >
                    <b>{articleSelected.title}</b>
                  </a>
                  <br />
                  <span
                    style={{
                      fontWeight: "100",
                    }}
                  >
                    {articleSelected?.releaseDate}
                  </span>
                  <br />
                  <span
                    style={{
                      fontWeight: "100",
                    }}
                  >
                    {articleSelected?.length}
                  </span>
                </p>
              </div>
              <div className="article-tag__mobile">
                <p className="article-tag-text__mobile">
                  {articleSelected?.tag}
                </p>
              </div>
              <div className="article-socials__desktop">
                <a href={articleSelected?.igLink} target="_blank">
                  <img src="/ig.jpg" className="sc-logo" />
                </a>
              </div>
            </div>
            {isMobile ? (
              <>
                <p
                  className="article-content-text__mobile"
                  dangerouslySetInnerHTML={{
                    __html: articleSelected?.description,
                  }}
                />
              </>
            ) : null}
          </div>
        </>
      )}
      <Article
        articleHeaderSelected={articleHeaderSelected}
        articleSelected={articleSelected}
        isMobile={isMobile}
        setArticleSelected={setArticleSelected}
        scrollToTop={scrollToTop}
        resetInfo={resetInfo}
      />
    </>
  );
}
