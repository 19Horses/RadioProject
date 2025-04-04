import React from "react";
import { FaPlay } from "react-icons/fa";
import { Tracklist } from "./Tracklist";

export const Guest = ({ isMobile, selectedGuest, setPlayingGuest }) => (
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
              {selectedGuest.rpCount}
            </span>{" "}
            <span
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "2px 5px", // Optional for better visibility
              }}
            >
              <b>{selectedGuest.title}</b>
            </span>
          </p>
        </div>

        <div className="artist-pics">
          <a>
            <img
              src={selectedGuest["2ppSrc"]}
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
              <b>{selectedGuest.genre}</b>
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
        <p
          style={{
            fontSize: "2.9vh",
            fontWeight: "100",
          }}
          dangerouslySetInnerHTML={{
            __html: selectedGuest.description,
          }}
        />
        {/* {isMobile ? <div style={{ height: "100px" }} /> : <></>} */}
      </div>
    </div>
    {selectedGuest && !isMobile && <Tracklist selectedGuest={selectedGuest} />}
  </>
);
