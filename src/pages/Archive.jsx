import React, { useCallback, useRef, useState, useEffect } from "react";
import { djs as items } from "./items";
import { GridContainer, PhotoContainer, CursorTitle } from "../styles";
import { CustomCursor } from "../components/CustomCursor";
import { useNavigate } from "react-router-dom";

export const Archive = ({ selectedIndex, isMobile, mobileIndex }) => {
  const flexContainer = useRef(null);
  const [w, setW] = useState(null);
  const [hoveredGuest, setHoveredGuest] = useState(null);
  const [isLeft, setIsLeft] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  // new
  const [showMixes, setShowMixes] = useState(true);
  const [showArticles, setShowArticles] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = items.filter((item) => {
    if (showMixes && item.type === "mix") return true;
    if (showArticles && item.type === "article") return true;
    return false;
  });

  const highestId = 0; // Assuming highest ID is the last element in the array

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

  const guestSelected = useCallback(
    (guest) => {
      setFadeOut(true);
      setTimeout(() => {
        navigate(`/${guest.title2}`);
      }, 300);
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: guest?.title,
          artist: "RADIO Project • " + guest?.title2, // Adjust artist name
          album: "RADIO Project", // Adjust album name
          artwork: [
            {
              src: guest?.ipSrc,
              sizes: "512x512",
              type: "image/png",
            },
          ],
        });
      }
    },
    [navigate]
  );

  const articleSelected = useCallback(
    (guest) => {
      setFadeOut(true);
      setTimeout(() => {
        navigate(`/rg/${guest.url}`);
      }, 300);
    },
    [navigate]
  );

  return (
    <>
      {hoveredGuest && isMobile === false && !fadeOut && (
        <CustomCursor
          hoveredGuest={hoveredGuest}
          isLeft={isLeft}
          hovered={!!hoveredGuest}
        />
      )}
      <div className="center-wrapper">
        <div className={"total-container "}>
          {isMobile ? (
            <>
              <div>
                <div
                  ref={flexContainer}
                  className={`${
                    isMobile ? "flex-container-mob" : "flex-container"
                  } ${fadeOut ? "fadeOutGrid" : ""}`}
                >
                  {items.map((guest, i) => {
                    const isLeft = i < items.length / 2;
                    // Apply shimmer effect to the container with the highest ID

                    return (
                      <div className="shimmer-effect">
                        <GridContainer
                          className="shimmer-effect"
                          key={i}
                          $total={items.length}
                          $selectedIndex={selectedIndex}
                          $contents={i}
                          $isLeft={isLeft}
                          style={{
                            transition: "filter 0.3s ease-in-out",
                          }}
                        >
                          <PhotoContainer
                            className={`pc shimmer-effect`}
                            key={i}
                            $contents={i}
                            $selectedIndex={selectedIndex}
                            $parentWidth={w}
                            $total={items.length}
                            $isLeft={isLeft}
                            $isMobile={isMobile}
                            $shimmer={guest.id === 1}
                            style={{
                              transition: "filter 0.3s ease-in-out",
                            }}
                          >
                            <img
                              src={guest.src}
                              alt={guest.title}
                              className={`image shimmer-effect`}
                              onClick={() => {
                                guestSelected(guest, i);
                              }}
                              style={{
                                transition: "filter 0.3s ease-in-out",
                              }}
                            />
                          </PhotoContainer>
                        </GridContainer>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className={`cursor-mobile ${fadeOut ? "fadeOutGrid" : ""}`}
                style={{ left: 0 }}
                onClick={() => {
                  guestSelected(items[mobileIndex], mobileIndex);
                }}
              >
                <CursorTitle
                  className="cursor-title"
                  $hovered={true}
                  $bgcolor={"rgb(247, 247, 247);"}
                  $delay={0.1}
                  fontSize="2.4vh"
                >
                  {items[mobileIndex]?.rpCount}
                </CursorTitle>
                <CursorTitle
                  className="cursor-title"
                  $hovered={true}
                  $bgcolor="black"
                  color="white"
                  fontSize="2.4vh"
                  $delay={0.15}
                >
                  <b>{items[mobileIndex]?.title}</b>
                </CursorTitle>
                <br />
                <CursorTitle
                  className="cursor-title"
                  $hovered={true}
                  $bgcolor="black"
                  color="white"
                  fontSize="4.9vh"
                  $delay={0.15}
                >
                  <b>{items[mobileIndex]?.title2}</b>
                </CursorTitle>
                <br />
                <CursorTitle
                  className="cursor-title"
                  $hovered={true}
                  $bgcolor="black"
                  color="white"
                  fontSize="2vh"
                  $delay={0.15}
                >
                  <b>{items[mobileIndex]?.broadcastDate}</b>
                </CursorTitle>
              </div>
            </>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  width: "12vw",
                }}
                onClick={() => {
                  setShowFilters(!showFilters);
                  console.log("showFilters", showFilters);
                }}
              >
                <a
                  className="filter-text"
                  style={{
                    width: "1vw",
                    color:
                      showMixes && showArticles ? "black" : "rgb(255, 0 , 90)",
                  }}
                >
                  ☼
                </a>{" "}
              </div>
              <div
                className="filter"
                style={{
                  opacity: showFilters ? 1 : 0,
                  height: "50vh",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "12vw",
                  transition: "opacity 0.5s ease-in-out",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "12vw",
                  }}
                  onClick={() => {
                    setShowMixes(!showMixes);
                    console.log("showMixes", showMixes);
                  }}
                >
                  <a className="filter-text" style={{ width: "1vw" }}>
                    ♪
                  </a>{" "}
                  <a className="filter-text" style={{ marginRight: "auto" }}>
                    MIXES
                  </a>{" "}
                  <b style={{ color: showMixes ? "rgb(255,0,90)" : "black" }}>
                    {showMixes ? "ON" : "OFF"}
                  </b>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    width: "12vw",
                  }}
                  onClick={() => {
                    setShowArticles(!showArticles);
                    console.log("showArticles", showArticles);
                  }}
                >
                  <a className="filter-text" style={{ width: "1vw" }}>
                    ☼
                  </a>{" "}
                  <a className="filter-text" style={{ marginRight: "auto" }}>
                    ARTICLES
                  </a>{" "}
                  <b
                    style={{ color: showArticles ? "rgb(255,0,90)" : "black" }}
                  >
                    {showArticles ? "ON" : "OFF"}
                  </b>
                </div>
              </div>
              <div
                ref={flexContainer}
                className={`${"flex-container"} ${
                  fadeOut ? "fadeOutGrid" : ""
                }`}
                style={{
                  left: showFilters ? "20vw" : "0vw",
                  width: showFilters ? "80vw" : "",
                  transition: "all 0.75s ease-in-out",
                }}
              >
                <div className="gradient-overlay-select" />

                {[...filteredItems].reverse().map((guest, i) => {
                  const isLeft = i < items.length / 2;
                  return (
                    <GridContainer
                      key={i}
                      $total={items.length}
                      $selectedIndex={selectedIndex}
                      $contents={i}
                      $isLeft={false}
                      $selected={selectedIndex === i}
                      $hovered={hoveredIndex === i}
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <PhotoContainer
                        className="pc"
                        key={i}
                        $contents={i}
                        $selectedIndex={selectedIndex}
                        $parentWidth={w}
                        $total={items.length}
                        $isLeft={false}
                        $isMobile={isMobile}
                      >
                        <img
                          src={guest.src}
                          alt={guest.title}
                          className={`image ${
                            guest.id === 1 ? "shimmer-effect" : ""
                          }`}
                          onMouseEnter={() => {
                            setHoveredGuest(guest);
                            setIsLeft(false);
                          }}
                          onMouseLeave={() => {
                            setHoveredGuest(null);
                          }}
                          onClick={() => {
                            if (guest.type === "mix") {
                              guestSelected(guest, i);
                            }
                            if (guest.type === "article") {
                              articleSelected(guest, i);
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
    </>
  );
};
