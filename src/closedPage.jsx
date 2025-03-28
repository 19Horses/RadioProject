import React, { useEffect, useRef, useState } from "react";
import { styled, keyframes } from "styled-components";
import { djs as items } from "./items.js";
import { writers as items2 } from "./articles.js";
import SoundCloudPlayer from "./soundcloudPlayer";
import Header from "./header";
import { useLocation } from "react-router-dom"; // Import this hook

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const GridContainer = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  opacity: ${(props) => (props.$selectedIndex !== null ? 1 : 0)};
  width: fit-content;
  flex: ${(props) => (props.$selected ? "-1" : "1")};
  transition: all 0.5s ease-in-out;
  &:hover {
    flex: ${(props) => props.$total};
    z-index: 998;
  }
  margin-left: 0.05vw;
  margin-right: 0.05vw;
  transition: all 0.5s ease-in-out;
  animation: ${(props) => (props.$selectedIndex !== null ? fadeOut : fadeIn)}
    0.5s ease-out forwards;
  animation-delay: ${(props) =>
    Math.abs(props.$contents - props.$total / 2) * 100}ms;
`;

const PhotoContainer = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  transition: all 0.5s ease-in-out;
  left: ${(props) =>
    props.$isLeft ? `-${props.$contents * props.$parentWidth}px` : "unset;"};
  right: ${(props) =>
    props.$isLeft ? "unset" : `${props.$contents * props.$parentWidth}px`};
  &:hover {
    cursor: pointer;
    ${(props) =>
      props.$isLeft ? "left: 0; right: unset;" : "right: 97%; left: unset;"};
  }
`;

const CursorTitle = styled.p`
  background-color: ${(props) => (props.hovered ? props.bgColor : "")};
  color: ${(props) => (props.hovered ? props.color : "black")};
  display: inline;
  font-size: ${(props) => props.fontSize || "inherit"};
  animation: ${(props) => (props.hovered ? fadeIn : "none")} 0.5s ease-out
    forwards;
  animation-delay: ${(props) => props.delay}s;
  opacity: 0;
`;

export const CustomCursor = ({ rpc, t1, t2, t3, isLeft, hovered }) => {
  const cursor = useRef(null);

  useEffect(() => {
    const moveCursor = (event) => {
      if (!cursor.current) return;

      const { clientX, clientY } = event;
      const offsetX = isLeft ? -16 : 1; // Shift text left or right
      const offsetY = -20; // Small offset to position text slightly below the cursor
      const vw = window.innerWidth / 100;

      cursor.current.style.transform = `translate3d(${
        clientX / vw + offsetX
      }vw, ${clientY + offsetY}px, 0)`;
    };

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, [isLeft]); // Re-run effect when isLeft changes

  return (
    <div
      className={"cursor"}
      ref={cursor}
      style={{ textAlign: isLeft ? "right" : "left" }}
    >
      <CursorTitle
        className="cursor-title"
        hovered={hovered}
        bgColor={"rgb(247, 247, 247);"}
        delay={0.1}
        fontSize="1.9vh"
      >
        {rpc}
      </CursorTitle>
      <CursorTitle
        className="cursor-title"
        hovered={hovered}
        bgColor="black"
        color="white"
        fontSize="1.9vh"
        delay={0.15}
      >
        <b>{t1}</b>
      </CursorTitle>
      <br />
      <CursorTitle
        className="cursor-title "
        hovered={hovered}
        bgColor="black"
        color="white"
        fontSize="2.6vh"
        delay={0.2}
      >
        <b>{t2}</b>
      </CursorTitle>
      <br />
      <CursorTitle
        className="cursor-title"
        hovered={hovered}
        bgColor="black"
        color="white"
        fontSize="1.9vh"
        delay={0.25}
        dangerouslySetInnerHTML={{ __html: t3 }}
      />
    </div>
  );
};

export default function ClosedPage() {
  const [rpCount, setRpCount] = useState("");
  const [title, setTitle] = useState("");
  const [title2, setTitle2] = useState("");
  const [title3, setTitle3] = useState("");
  const [hovered, setHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [w, setW] = useState(null);
  const flexContainer = useRef(null);
  const [isLeft, setIsLeft] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
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

  const resetInfo = () => {
    setSelectedTracklist(null);
    setSelectedIndex(null);
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
      console.log("hi");
    }
  }, [location.pathname]); // Runs once when pathname changes

  return (
    <>
      <div className={"gradient-overlay-tl"} />
      {selectedTrack != "" && (
        <SoundCloudPlayer
          pic={selectedPic}
          track={selectedTrack}
          chapters={selectedChapters}
          title={selectedTitle}
          artist={selectedArtist}
          tracklist={selectedTracklist}
        />
      )}
      {selectedIndex === null && articleSelected === null && (
        <CustomCursor
          rpc={rpCount}
          t1={title}
          t2={title2}
          t3={title3}
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
          // setInfoSelected(false);
          // setarticleHeaderSelected(true);
          // setArticleSelected(null);
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
        style={{ cursor: "pointer" }}
      >
        <a
          onClick={() => {
            resetInfo();
            setInfoSelected(false);
          }}
        >
          <img
            onMouseOver={`${
              isMobile
                ? () => {
                    setHeaderHover(true);
                  }
                : () => {
                    setHeaderHover(false);
                  }
            }`}
            onMouseLeave={() => {
              setHeaderHover(false);
            }}
            className="main"
            src="./transplogo.png"
            alt="Logo"
          />
        </a>
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
      </div>

      {!infoSelected && !articleHeaderSelected && (
        <div
          className={"total-container "}
          style={{
            pointerEvents: selectedIndex === null ? "" : "none",
          }}
        >
          <div
            ref={flexContainer}
            className={`${isMobile ? "flex-container-mob" : "flex-container"} ${
              selectedIndex != null ? "fadeOutGrid" : ""
            }`}
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
                  >
                    <img
                      src={pic.src}
                      alt={pic.title}
                      className="image"
                      onMouseEnter={() => {
                        setHovered(true);
                        setRpCount(pic.rpCount);
                        setTitle(pic.title);
                        setTitle2(pic.title2);
                        setTitle3(pic.title3);
                        setIsLeft(isLeft);
                        setHoveredIndex(i);
                      }}
                      onMouseLeave={() => {
                        setHoveredIndex(null);
                        setHovered(false);
                        setRpCount("");
                        setTitle("");
                        setTitle2("");
                        setTitle3("");
                      }}
                      onClick={() => {
                        setSelectedIndex(pic.id);
                        setSelectedTrack(items[pic.id]?.mixId);
                        setSelectedChapters(pic?.chapters || []);
                        setSelectedTracklist(pic?.tracklist || []);
                        setSelectedTitle([pic?.rpCount + pic?.title]);
                        setSelectedArtist(pic?.title2);
                        setSelectedPic(pic?.src);
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
                <a onClick={() => resetInfo()} target="_blank">
                  <img
                    src={items[selectedIndex]?.["2ppSrc"]}
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
          <div className="article-grid">
            {items2.map((pic, i) => {
              return (
                // Make sure to return the JSX
                <div
                  key={i}
                  className="article-grid-item"
                  onMouseEnter={() => {
                    setIsLeft(false);
                    setHovered(true);
                    setRpCount(pic.rpCount);
                    setTitle(pic.title);
                    setTitle2(pic.title2);
                    setTitle3(pic.title3);
                    setHoveredIndex(i);
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    setHovered(false);
                    setRpCount("");
                    setTitle("");
                    setTitle2("");
                    setTitle3("");
                  }}
                  onClick={() => {
                    console.log(pic.id);
                    setArticleSelected(pic);
                  }}
                >
                  <img src={pic.src} alt={`Article ${i + 1}`} />{" "}
                  {/* Use the pic.src here */}
                </div>
              );
            })}
          </div>
        </>
      )}
      {articleSelected != null && (
        <div>
          <p>{articleSelected.description}</p>
        </div>
      )}
    </>
  );
}
