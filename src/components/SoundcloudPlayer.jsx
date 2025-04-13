import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { useAudio } from "../AudioContext";
import "../player.css";
import { Timeline } from "./Timeline";

export default function SoundCloudPlayer({ playingGuest, isMobile }) {
  const {
    title2: artist,
    title,
    rpCount,
    mixId: track,
    src: pic,
  } = playingGuest;

  const mixTitle = rpCount + title;

  const audioContext = useAudio();
  const {
    audioRef,
    formattedProgress,
    formattedDuration,
    isPlaying,
    skipBackward,
    skipForward,
    togglePlayPause,
    skipTo,
  } = audioContext;

  const handleProgressBarClick = (e) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = e.clientY - progressBar.getBoundingClientRect().top;
      const progressBarWidth = progressBar.clientHeight;
      const newProgress = (clickPosition / progressBarWidth) * 100;
      const newTime = (newProgress / 100) * audioRef.current.duration;
      skipTo(newTime);
    }
  };

  return (
    <>
      <div
        className={`timeline-progress-bar-container__desktop ${
          isMobile ? "timeline-progress-bar-container__mobile" : null
        }`}
        onClick={handleProgressBarClick}
        style={{
          pointerEvents: track == null ? "none" : "",
          opacity: track == null ? "0" : "1",
        }}
      >
        <audio ref={audioRef} src={track} autoPlay />
        {isMobile ? (
          <div
            className="control-module__mobile"
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex" }}
          >
            <div>
              <a href={playingGuest.djLink} target="_blank">
                <img src={pic} />
              </a>
            </div>
            <div className="time-controls__mobile">
              <a onClick={(e) => togglePlayPause(e)}>
                {isPlaying ? (
                  <FaPause style={{ color: "rgb(202, 202, 202)" }} />
                ) : (
                  <FaPlay style={{ color: "rgb(202, 202, 202)" }} />
                )}
              </a>
            </div>
            <div className="mix-info">
              <div className={"scrolling-title-container-mob-addon"}>
                <div className="gradient-overlay-mob" />
                <div
                  className={`${
                    isMobile ? "scrolling-title-mob" : "scrolling-title"
                  } 
                        `}
                  style={{ fontSize: "1.6vh", paddingLeft: "1vw" }}
                >
                  {mixTitle}
                </div>
              </div>
              <div style={{ height: "20px" }}>
                <p
                  style={{
                    fontSize: "1.6vh",
                    fontFamily: "Helvetica",
                    margin: "auto",
                    fontWeight: "1000",
                  }}
                >
                  {artist}
                </p>
              </div>
            </div>
            <div className="timestamp">
              <p>
                {formattedProgress} / <b>{formattedDuration}</b>
              </p>
            </div>
          </div>
        ) : (
          <div
            className="control-module__desktop"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="time-controls__desktop"
              onClick={(e) => e.stopPropagation()}
            >
              <div onClick={skipBackward}> &#10226;</div>
              <a
                style={{ fontSize: "1.4vh" }}
                onClick={(e) => {
                  togglePlayPause(e);
                }}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </a>
              <div onClick={skipForward}>&#10227;</div>
            </div>
            <div className="scrolling-title-container__desktop">
              <div className="gradient-overlay" />
              <div className="scrolling-title__desktop">
                <b>{mixTitle}</b>
              </div>
            </div>
            <span>{artist}</span>
            <br />
            <p style={{ fontSize: "2vh" }}>
              {formattedProgress} / <b>{formattedDuration}</b>
            </p>
          </div>
        )}
        <Timeline playingGuest={playingGuest} />
      </div>
    </>
  );
}
