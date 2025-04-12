import React, { useCallback, useRef, useState, useEffect } from "react";
import { djs as items } from "./items";
import { GridContainer, PhotoContainer, CursorTitle } from "../styles";
import { CustomCursor } from "../components/CustomCursor";
import { useNavigate } from "react-router-dom";

export const Landing = ({ selectedIndex, isMobile, mobileIndex }) => {
  const flexContainer = useRef(null);
  const [w, setW] = useState(null);
  const [hoveredGuest, setHoveredGuest] = useState();
  const [isLeft, setIsLeft] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  // new
  const [showMixes, setShowMixes] = useState(true);
  const [showArticles, setShowArticles] = useState(true);
  const itemRefs = useRef([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = items
    .filter((item) => {
      if (showMixes && item.type === "mix") return true;
      if (showArticles && item.type === "article") return true;
      return false;
    })
    .reverse();

  const highestId = 0; // Assuming highest ID is the last element in the array

  useEffect(() => {
    if (flexContainer.current) {
      setW(flexContainer.current.clientWidth / filteredItems.length);
    }
    const handleResize = () => {
      setW(flexContainer.current.clientWidth / filteredItems.length);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [flexContainer]);

  useEffect(() => {
    if (!isMobile) return; // Only apply on mobile

    // Log the itemRefs array here to see if it's being populated correctly
    console.log("itemRefs at the start:", itemRefs.current);

    const observer = new IntersectionObserver(
      (entries) => {
        console.log("Entries:", entries);
        let maxRatio = 0;
        let mostVisibleIndex = null;

        entries.forEach((entry) => {
          console.log("Entry:", entry);
          console.log("Intersection ratio:", entry.intersectionRatio);

          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleIndex = Number(entry.target.getAttribute("data-index"));
          }
        });

        if (mostVisibleIndex !== null && filteredItems[mostVisibleIndex]) {
          const mostVisibleItem = filteredItems[mostVisibleIndex];
          console.log("Most visible item:", mostVisibleItem);
          setHoveredGuest(mostVisibleItem);
        }
      },
      {
        threshold: 0.9, // granular visibility tracking
      }
    );

    // Make sure refs are populated correctly
    itemRefs.current.forEach((ref, index) => {
      if (ref && ref instanceof HTMLElement) {
        console.log(`Ref at index ${index} is a valid DOM element:`, ref);
        observer.observe(ref);
      } else {
        console.log("Ref at index", index, "is null or undefined.");
      }
    });

    return () => {
      itemRefs.current.forEach((ref) => {
        if (ref && ref instanceof HTMLElement) {
          console.log("Unobserving element:", ref);
          observer.unobserve(ref);
        }
      });
    };
  }, [isMobile]);

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
        navigate(`/radiogram/${guest.url}`);
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
                  className={`flex-container-mob
                  } ${fadeOut ? "fadeOutGrid" : ""}`}
                >
                  {[...filteredItems].map((guest, i) => {
                    const isLeft = i < filteredItems.length / 2;
                    return (
                      <div key={i}>
                        <GridContainer
                          ref={(el) => (itemRefs.current[i] = el)} // Change: Properly assigning refs for each element
                          data-index={i}
                          className="gc"
                          $total={filteredItems.length}
                          $selectedIndex={selectedIndex}
                          $contents={i}
                          $isLeft={isLeft}
                          style={{
                            transition: "filter 0.3s ease-in-out",
                          }}
                        >
                          <PhotoContainer
                            key={i}
                            $contents={i}
                            $selectedIndex={selectedIndex}
                            $parentWidth={w}
                            $total={filteredItems.length}
                            $isLeft={isLeft}
                            $isMobile={isMobile}
                            $shimmer={guest.id === 1}
                            style={{
                              transition: "filter 0.3s ease-in-out",
                              width: "80vw",
                              paddingLeft: i === 0 ? "10vw" : "2.5vw",
                              paddingRight:
                                i === filteredItems.length - 1
                                  ? "10vw"
                                  : "2.5vw",
                            }}
                          >
                            <img
                              src={guest.src}
                              alt={guest.title}
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
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className={`cursor-mobile ${fadeOut ? "fadeOutGrid" : ""}`}
                style={{ left: 0 }}
                onClick={() => {
                  if (hoveredGuest?.type === "mix") {
                    guestSelected(hoveredGuest);
                  }
                  if (hoveredGuest?.type === "article") {
                    articleSelected(hoveredGuest);
                  }
                }}
              >
                <CursorTitle
                  className="cursor-title"
                  $hovered={true}
                  $bgcolor={"rgb(247, 247, 247);"}
                  $delay={0.1}
                  fontSize="2.4vh"
                >
                  {hoveredGuest?.rpCount}
                </CursorTitle>
                <CursorTitle
                  className="cursor-title"
                  $hovered={true}
                  $bgcolor="black"
                  color="white"
                  fontSize="2.4vh"
                  $delay={0.15}
                >
                  <b>{hoveredGuest?.title}</b>
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
                  <b>{hoveredGuest?.title2}</b>
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
                  <b>{hoveredGuest?.broadcastDate}</b>
                </CursorTitle>
              </div>
            </>
          ) : (
            <div>
              {/* <div
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
              </div> */}
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

                {[...filteredItems].map((guest, i) => {
                  const isLeft = i < filteredItems.length / 2;
                  return (
                    <GridContainer
                      key={i}
                      $total={filteredItems.length}
                      $selectedIndex={selectedIndex}
                      $contents={i}
                      $isLeft={false}
                      $selected={selectedIndex === i}
                      $hovered={hoveredIndex === i}
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <PhotoContainer
                        key={i}
                        $contents={i}
                        $selectedIndex={selectedIndex}
                        $parentWidth={w}
                        $total={filteredItems.length}
                        $isLeft={false}
                        $isMobile={isMobile}
                      >
                        <img
                          src={guest.src}
                          alt={guest.title}
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
