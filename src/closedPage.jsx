import React, { useEffect, useRef, useState } from "react";
import { djs as items } from "./items.js";
import { writers as items2 } from "./articles.js";
import SoundCloudPlayer from "./soundcloudPlayer";
import Header from "./header";
import { useLocation } from "react-router-dom"; // Import this hook
import { FaPlay } from "react-icons/fa";
import { AudioProvider } from "./AudioContext.jsx";
import { CursorTitle, GridContainer, PhotoContainer } from "./styles.js";
import { CustomCursor } from "./CustomCursor.jsx";

export default function ClosedPage() {
  const [hoveredArtist, setHoveredArtist] = useState(null);

  const [hovered, setHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [w, setW] = useState(null);
  const flexContainer = useRef(null);
  const [isLeft, setIsLeft] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");
  const [selectedTracklist, setSelectedTracklist] = useState([]);
  const [selectedPic, setSelectedPic] = useState("");
  const location = useLocation();
  const [headerHover, setHeaderHover] = useState(false);
  const [infoSelected, setInfoSelected] = useState(false);
  const [articleHeaderSelected, setarticleHeaderSelected] = useState(false);
  const [articleSelected, setArticleSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const containerRef = useRef(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const audioRef = useRef(null);

  const handleTrackSelection = (index) => {
    setSelectedTrack(items[index]?.mixId); // Example of setting selected track
    // Other state updates related to selected track
  };

  useEffect(() => {
    if (selectedTrack && audioRef.current) {
      const playAudio = async () => {
        try {
          await audioRef.current.play(); // Attempt to autoplay
          console.log("Audio autoplay started");
        } catch (error) {
          console.error("Error starting autoplay:", error);
        }
      };

      playAudio();
    }
  }, [selectedTrack]); // Runs when `selectedTrack` changes

  const resetInfo = () => {
    setSelectedTracklist(null);
    setSelectedIndex(null);
    setArticleSelected(null);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    console.log({ isLeft });
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
    if (location.pathname === "/rp1-ubi") {
      // Set specific states for rp1
      setSelectedIndex(0); // Example: Select the first DJ
      setSelectedTrack(items[0]?.mixId); // Set the track to first DJ's mix
      setSelectedChapters(items[0]?.chapters || []);
      setSelectedTracklist(items[0]?.tracklist || []);
      setSelectedTitle(items[0]?.rpCount + items[0]?.title);
      setSelectedArtist(items[0]?.title2);
      setSelectedPic(items[0]?.src);
      if (location.pathname === "/rp1-ubi") {
        if ("mediaSession" in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: '"games that touch the arts"',
            artist: "RADIO Project • ubi", // Adjust artist name
            album: "RADIO Project", // Adjust album name
            artwork: [
              {
                src: items[0]?.ipSrc,
                sizes: "512x512",
                type: "image/png",
              },
            ],
          });
        }
      }
    }
  }, [location.pathname]); // Runs once when pathname changes

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
      {selectedTracklist != "" && (
        <AudioProvider>
          <SoundCloudPlayer
            pic={selectedPic}
            track={selectedTrack}
            chapters={selectedChapters}
            title={selectedTitle}
            artist={selectedArtist}
            tracklist={selectedTracklist}
          />
        </AudioProvider>
      )}
      {hoveredArtist && isMobile === false && (
        <CustomCursor
          hoveredArtist={hoveredArtist}
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
          setSelectedTracklist(null);
          scrollToTop();
        }}
      />
      <div
        className={`header-logo ${
          isMobile ? "header-logo-mob" : "header-logo-norm"
        }`}
      >
        <a
          onClick={() => {
            resetInfo();
            setInfoSelected(false);
          }}
        >
          <img
            onMouseOver={() => {
              setHeaderHover(true);
            }}
            onMouseLeave={() => {
              setHeaderHover(false);
            }}
            className="main"
            src="./transplogo.png"
            alt="Logo"
          />
        </a>
        {isMobile ? null : (
          <a>
            <img
              className="second"
              style={{
                opacity: headerHover === true ? "1" : "0",
                transform: headerHover === true ? "translateX(10%)" : "",
              }}
              src="./transplogo2.png"
            />
          </a>
        )}
      </div>
      {!infoSelected && !articleHeaderSelected && (
        <div
          className="center-wrapper"
          style={{
            pointerEvents: selectedIndex === null ? "" : "none",
          }}
        >
          <div className={"total-container "}>
            {isMobile ? (
              <>
                <div>
                  <div
                    ref={flexContainer}
                    className={`${
                      isMobile ? "flex-container-mob" : "flex-container"
                    } ${selectedIndex != null ? "fadeOutGrid" : ""}`}
                  >
                    {items.map((pic, i) => {
                      const isLeft = i < items.length / 2;
                      return (
                        <GridContainer
                          key={i}
                          $total={items.length}
                          $selectedIndex={selectedIndex}
                          $contents={i}
                          $isLeft={isLeft}
                        >
                          <PhotoContainer
                            className="pc"
                            key={i}
                            $contents={i}
                            $selectedIndex={selectedIndex}
                            $parentWidth={w}
                            $total={items.length}
                            $isLeft={isLeft}
                            $isMobile={isMobile}
                          >
                            <img
                              src={pic.src}
                              alt={pic.title}
                              className="image"
                              onClick={() => {
                                setSelectedIndex(pic.id);
                                setSelectedTitle(pic.title);
                                setSelectedArtist(pic.title2);
                                // setSelectedTrack(items[pic.id]?.mixId);
                                setSelectedChapters(pic?.chapters || []);
                                setSelectedTracklist(pic?.tracklist || []);
                                setSelectedPic(pic?.src);
                                if ("mediaSession" in navigator) {
                                  navigator.mediaSession.metadata =
                                    new MediaMetadata({
                                      title: [pic?.title],
                                      artist: "RADIO Project • " + pic?.title2, // Adjust artist name
                                      album: "RADIO Project", // Adjust album name
                                      artwork: [
                                        {
                                          src: pic?.ipSrc,
                                          sizes: "512x512",
                                          type: "image/png",
                                        },
                                      ],
                                    });
                                }
                              }}
                              style={{
                                transition: "filter 0.3s ease-in-out",
                              }}
                            />
                          </PhotoContainer>
                        </GridContainer>
                      );
                    })}
                  </div>
                </div>
                <div
                  className={`cursor-mobile ${
                    selectedIndex != null ? "fadeOutGrid" : ""
                  }`}
                  style={{ left: 0 }}
                  onClick={() => {
                    setSelectedIndex(items[mobileIndex]?.id);
                    setSelectedChapters(items[mobileIndex]?.chapters || []);
                    setSelectedTracklist(items[mobileIndex]?.tracklist || []);
                    setSelectedTitle(items[mobileIndex]?.title);
                    setSelectedArtist(items[mobileIndex]?.title2);

                    //setSelectedTrack(items[mobileIndex]?.mixId);

                    setSelectedTitle([
                      items[mobileIndex]?.rpCount + items[mobileIndex]?.title,
                    ]);
                    setSelectedArtist(items[mobileIndex]?.title2);
                    setSelectedPic(items[mobileIndex]?.src);
                    if ("mediaSession" in navigator) {
                      navigator.mediaSession.metadata = new MediaMetadata({
                        title: [items[mobileIndex]?.title],
                        artist: "RADIO Project • " + items[mobileIndex]?.title2, // Adjust artist name
                        album: "RADIO Project", // Adjust album name
                        artwork: [
                          {
                            src: items[mobileIndex]?.ipSrc,
                            sizes: "512x512",
                            type: "image/png",
                          },
                        ],
                      });
                    }
                  }}
                >
                  <CursorTitle
                    className="cursor-title"
                    hovered={true}
                    bgColor={"rgb(247, 247, 247);"}
                    delay={0.1}
                    fontSize="2.4vh"
                  >
                    {items[mobileIndex]?.rpCount}
                  </CursorTitle>
                  <CursorTitle
                    className="cursor-title"
                    hovered={true}
                    bgColor="black"
                    color="white"
                    fontSize="2.4vh"
                    delay={0.15}
                  >
                    <b>{items[mobileIndex]?.title}</b>
                  </CursorTitle>
                  <br />
                  <CursorTitle
                    className="cursor-title"
                    hovered={true}
                    bgColor="black"
                    color="white"
                    fontSize="4.9vh"
                    delay={0.15}
                  >
                    <b>{items[mobileIndex]?.title2}</b>
                  </CursorTitle>
                  <br />
                  <CursorTitle
                    className="cursor-title"
                    hovered={true}
                    bgColor="black"
                    color="white"
                    fontSize="2vh"
                    delay={0.15}
                  >
                    <b>{items[mobileIndex]?.broadcastDate}</b>
                  </CursorTitle>
                </div>
              </>
            ) : (
              <div>
                <div
                  ref={flexContainer}
                  className={`${
                    isMobile ? "flex-container-mob" : "flex-container"
                  } ${selectedIndex != null ? "fadeOutGrid" : ""}`}
                >
                  {items.map((pic, i) => {
                    const isLeft = i < items.length / 2;
                    return (
                      <GridContainer
                        key={i}
                        $total={items.length}
                        $selectedIndex={selectedIndex}
                        $contents={i}
                        $isLeft={isLeft}
                      >
                        <PhotoContainer
                          className="pc"
                          key={i}
                          $contents={i}
                          $selectedIndex={selectedIndex}
                          $parentWidth={w}
                          $total={items.length}
                          $isLeft={isLeft}
                          $isMobile={isMobile}
                        >
                          <img
                            src={pic.src}
                            alt={pic.title}
                            className="image"
                            onMouseEnter={() => {
                              setHovered(true);
                              setHoveredArtist(pic);
                              setIsLeft(isLeft);
                            }}
                            onMouseLeave={() => {
                              setHovered(false);
                              setHoveredArtist(null);
                            }}
                            onClick={() => {
                              setSelectedIndex(pic.id);
                              // setSelectedTrack(items[pic.id]?.mixId);
                              setSelectedChapters(pic?.chapters || []);
                              setSelectedTracklist(pic?.tracklist || []);
                              console.log(pic?.tracklist);
                              setSelectedPic(pic?.src);
                              if ("mediaSession" in navigator) {
                                navigator.mediaSession.metadata =
                                  new MediaMetadata({
                                    title: pic?.title,
                                    artist: "RADIO Project • " + pic?.title2, // Adjust artist name
                                    album: "RADIO Project", // Adjust album name
                                    artwork: [
                                      {
                                        src: pic?.ipSrc,
                                        sizes: "512x512",
                                        type: "image/png",
                                      },
                                    ],
                                  });
                              }
                            }}
                            style={{
                              transition: "filter 0.3s ease-in-out",
                            }}
                          />
                        </PhotoContainer>
                      </GridContainer>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {infoSelected == true && (
        <div className={`info-container ${isMobile ? "info-mob-addon" : ""}`}>
          <p>
            <b>RADIO PROJECT</b> is a space for auditory, verbal and written
            agency.
          </p>
          <p>
            <b>RADIO PROJECT</b> aims to spotlight individuals by broadcasting
            mixes and conducting interviews, and to inform through written
            articles.
          </p>

          <a
            href="https://www.instagram.com/mkprote/"
            style={{
              color: "black",
              textDecoration: "none",
              fontSize: "2.2vh",
            }}
            target="_blank"
          >
            {" "}
            by <b>Elisha Olunaike</b>
          </a>
          <br />
          <br />
          <br />

          <a
            href="mailto:contact@radioproject.live"
            style={{ color: "black", textDecoration: "none" }}
            target="_blank"
          >
            Contact
          </a>
          {isMobile ? <div style={{ height: "5vh" }} /> : <></>}
        </div>
      )}
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
                    setSelectedArtist(items[selectedIndex]?.title2);
                    setSelectedTitle(
                      items[selectedIndex]?.rpCount +
                        items[selectedIndex]?.title
                    );
                    handleTrackSelection(selectedIndex);
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
              {isMobile ? <div style={{ height: "100px" }} /> : <></>}
            </div>
          </div>
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
              {items2.map((pic, i) => {
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
                        ref={containerRef}
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
    </>
  );
}
