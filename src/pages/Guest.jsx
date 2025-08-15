import React from "react";
import { FaPlay } from "react-icons/fa";
import { Tracklist } from "../components/Tracklist";
import { useParams } from "react-router-dom";
import { djs } from "./items";

export const Guest = ({ isMobile, setPlayingGuest, isPlaying }) => {
  const { guestName } = useParams();
  const selectedGuest = djs.find((dj) => dj.url === guestName);

  return (
    <>
      <div
        className={` ${
          isMobile
            ? "selected-artist-container-mob-addon"
            : "selected-artist-container"
        }`}
        style={{ width: isMobile ? (isPlaying ? "84%" : "88%") : undefined }}
      >
        <div
          className="all-left-cont"
          style={{
            top: isMobile ? "7%" : "",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="description-container">
              <p
                className="description-header"
                style={{
                  paddingLeft: isMobile ? "3vw" : "",
                  fontSize: isMobile ? "2.9vh" : "2.7vh",
                }}
              >
                <span
                  style={{
                    fontFamily: "Helvetica",
                    fontWeight: "100",
                  }}
                >
                  {selectedGuest.rpCount}
                </span>{" "}
                <span
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    padding: "2px 5px",
                  }}
                >
                  <b>{selectedGuest.title}</b>
                </span>
              </p>
            </div>
            <div
              className="selectTrack"
              style={{
                fontSize: isMobile ? "1.9vh" : "",
              }}
              onClick={() => {
                setPlayingGuest(selectedGuest);
              }}
            >
              PLAY
            </div>
          </div>

          <div className="artist-pics">
            <a>
              <img
                src={selectedGuest["2ppSrc"]}
                className="selected-artist-image"
              />
            </a>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
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
                  href={selectedGuest.djLink}
                  target="_blank"
                >
                  <b>{selectedGuest.title2}</b>
                </a>
                <br />
                <span
                  style={{
                    fontWeight: "100",
                  }}
                >
                  {selectedGuest.broadcastDate}
                </span>
                <br />
                <span
                  style={{
                    fontWeight: "100",
                  }}
                >
                  {selectedGuest.length}
                </span>
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
              <a href={selectedGuest.scLink} target="_blank">
                <img src="/sc.svg" className="sc-logo" />
              </a>
              <a href={selectedGuest.npLink} target="_blank">
                <img src="/np.png" className="sc-logo" />
              </a>
              <a href={selectedGuest.igLink} target="_blank">
                <img src="/ig.jpg" className="sc-logo" />
              </a>
            </div>
          </div>
          <div style={{ flexDirection: "row", display: "flex" }}>
            <p
              style={{
                fontSize: "2.2vh",
                fontWeight: "100",
                width: "80%",
                marginTop: "1vh",
                paddingBottom: isMobile ? "10vh" : "",
                lineHeight: "2.7vh",
                paddingRight: "1.5vw",
              }}
              dangerouslySetInnerHTML={{
                __html: selectedGuest.description,
              }}
            />
            <div
              className="genre"
              style={{
                font: "dot",
                display: "flex",
                alignItems: "stretch",
                border: "1px solid black",
                paddingLeft: ".8vh",
                paddingRight: ".8vh",
                fontSize: "1.1vh",
                margin: "auto",
                marginTop: "1vh",
                marginRight: "0",
                textAlign: "center",
              }}
            >
              <p>
                <b>{selectedGuest.genre}</b>
              </p>
            </div>
          </div>
        </div>
      </div>
      {selectedGuest && !isMobile && (
        <Tracklist selectedGuest={selectedGuest} />
      )}
    </>
  );
};
