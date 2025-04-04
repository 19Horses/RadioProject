import React, { useCallback, useRef, useState, useEffect } from "react";
import { djs as items } from "./items";
import { GridContainer, PhotoContainer, CursorTitle } from "./styles";
import { CustomCursor } from "./CustomCursor";

export const Landing = ({
  selectedIndex,
  setSelectedIndex,
  isMobile,
  mobileIndex,
}) => {
  const flexContainer = useRef(null);
  const [w, setW] = useState(null);
  const [hoveredGuest, setHoveredGuest] = useState(null);
  const [isLeft, setIsLeft] = useState(false);

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
    (guest, i) => {
      setSelectedIndex(i);
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
    [setSelectedIndex]
  );
  return (
    <>
      {hoveredGuest && isMobile === false && (
        <CustomCursor
          hoveredGuest={hoveredGuest}
          isLeft={isLeft}
          $hovered={!!hoveredGuest}
        />
      )}
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
                  {items.map((guest, i) => {
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
                            src={guest.src}
                            alt={guest.title}
                            className="image"
                            onClick={() => {
                              guestSelected(guest, i);
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
                  guestSelected(items[mobileIndex], mobileIndex);
                }}
              >
                <CursorTitle
                  className="cursor-title"
                  $hovered={true}
                  $bgColor="rgb(247, 247, 247)"
                  $delay={0.1}
                  $fontSize="2.4vh"
                >
                  {items[mobileIndex]?.rpCount}
                </CursorTitle>
                <CursorTitle
                  className="cursor-title"
                  $hovered={true}
                  $bgColor="black"
                  color="white"
                  $fontSize="2.4vh"
                  $delay={0.15}
                >
                  <b>{items[mobileIndex]?.title}</b>
                </CursorTitle>
                <br />
                <CursorTitle
                  className="cursor-title"
                  $hovered={true}
                  $bgColor="black"
                  color="white"
                  $fontSize="4.9vh"
                  $delay={0.15}
                >
                  <b>{items[mobileIndex]?.title2}</b>
                </CursorTitle>
                <br />
                <CursorTitle
                  className="cursor-title"
                  $hovered={true}
                  $bgColor="black"
                  color="white"
                  $fontSize="2vh"
                  $delay={0.15}
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
                {items.map((guest, i) => {
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
                          src={guest.src}
                          alt={guest.title}
                          className="image"
                          onMouseEnter={() => {
                            setHoveredGuest(guest);
                            setIsLeft(isLeft);
                          }}
                          onMouseLeave={() => {
                            setHoveredGuest(null);
                          }}
                          onClick={() => {
                            guestSelected(guest, i);
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
