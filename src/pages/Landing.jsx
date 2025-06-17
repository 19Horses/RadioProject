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
  const [thumbPosition, setThumbPosition] = useState(0);

  const filteredItems = items
    .filter((item) => {
      if (showMixes && item.type === "mix") return true;
      if (showArticles && item.type === "radiogram") return true;
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
        navigate(`/rp/${guest.url}`);
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

  const handleScroll = (e) => {
    const el = e.target;
    const scrollRatio = el.scrollLeft / (el.scrollWidth - el.clientWidth);
    const trackWidth = el.clientWidth * 0.5; // 50vw track
    const thumbMaxOffset = trackWidth - 60; // track width - thumb width

    setThumbPosition(scrollRatio * thumbMaxOffset);
  };

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
                              width: "78vw",
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
                                if (guest.type === "radiogram") {
                                  articleSelected(guest, i);
                                }
                              }}
                              style={{
                                transition: "filter 0.3s ease-in-out",
                              }}
                              className={`image `}
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
                style={{ left: 0, zIndex: 999 }}
                onClick={() => {
                  if (hoveredGuest?.type === "mix") {
                    guestSelected(hoveredGuest);
                  }
                  if (hoveredGuest?.type === "radiogram") {
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
                  fontSize="2.3vh"
                  $delay={0.15}
                >
                  <b>{hoveredGuest?.title3}</b>
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
            <div className="scroll-wrapper">
              <div
                ref={flexContainer}
                className={`${"flex-container"} ${
                  fadeOut ? "fadeOutGrid" : ""
                }`}
                style={{
                  left: showFilters ? "20vw" : "0vw",
                  width: showFilters ? "80vw" : "",
                  transition: "all 0.75s ease-in-out",
                  paddingLeft: "35vw",
                  paddingRight: "35vw",
                }}
                onScroll={handleScroll}
              >
                {[...filteredItems].map((guest, i) => {
                  return (
                    <div>
                      <GridContainer
                        key={i}
                        className="gc"
                        $total={filteredItems.length}
                        $selectedIndex={selectedIndex}
                        $contents={i}
                        $isLeft={false}
                        $selected={selectedIndex === i}
                        $hovered={hoveredIndex === i}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <div>
                          <p
                            className="nav-text-type"
                            style={{
                              width: "50vh",
                              textAlign: "left",
                              textTransform: "uppercase",
                              fontSize: "1.4vh",
                              fontWeight: "550",
                            }}
                          >
                            {guest.type}
                          </p>
                          <PhotoContainer
                            className="pc"
                            key={i}
                            $contents={i}
                            $selectedIndex={selectedIndex}
                            $parentWidth={w}
                            $total={filteredItems.length}
                            $isLeft={false}
                            $isMobile={isMobile}
                            style={{
                              transition: "filter 0.3s ease-in-out",
                            }}
                          >
                            <img
                              src={guest.src}
                              alt={guest.title}
                              className={`image `}
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
                                if (guest.type === "radiogram") {
                                  articleSelected(guest, i);
                                }
                              }}
                              style={{
                                transition: "filter 0.3s ease-in-out",
                              }}
                            />
                          </PhotoContainer>
                        </div>
                      </GridContainer>
                    </div>
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
