import React, { useCallback, useEffect, useState } from "react";
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

  const [isPlaying, setIsPlaying] = useState(false);

  const audioContext = useAudio();
  const { audioRef, setProgress } = audioContext;

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.load();

      const handleCanPlay = () => {
        audio.play().catch((error) => {
          console.error("iOS blocked playback:", error);
        });
        setIsPlaying(true);
      };

      audio.addEventListener("canplaythrough", handleCanPlay);

      return () => {
        audio.removeEventListener("canplaythrough", handleCanPlay);
      };
    }
  }, [audioRef]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
      });
    } else {
      audioRef.current.pause();
    }

    setIsPlaying(!audioRef.current.paused);
  }, [audioRef, setIsPlaying]);

  const handleProgressBarClick = (e) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = e.clientY - progressBar.getBoundingClientRect().top;
      const progressBarWidth = progressBar.clientHeight;
      const newProgress = (clickPosition / progressBarWidth) * 100;
      const newTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
      audioRef.current.play();
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        secs < 10 ? "0" : ""
      }${secs}`;
    }
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const skipForward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        audioRef.current.duration
      );
    }
  }, [audioRef]);

  const skipBackward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  }, [audioRef]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === "ArrowRight") {
        skipForward();
      } else if (e.key === "ArrowLeft") {
        skipBackward();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [skipBackward, skipForward, togglePlayPause]);

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
        <audio ref={audioRef} src={track} />
        {isMobile ? (
          // MOBILE VERSION
          <div
            className="control-module__mobile"
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex" }}
          >
            <div>
              <a href="https://instagram.com/ubiifuruuu" target="_blank">
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
                {formatTime(audioRef.current.currentTime)} /{" "}
                <b>
                  {audioRef.current?.duration &&
                  !isNaN(audioRef.current.duration)
                    ? formatTime(audioRef.current.duration)
                    : "--:--"}
                </b>
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
              {formatTime(audioRef.current.currentTime)}/{" "}
              <b>
                {audioRef.current
                  ? formatTime(audioRef.current.duration)
                  : "--:--"}
              </b>
            </p>
          </div>
        )}
        <Timeline playingGuest={playingGuest} />
      </div>
    </>
  );
}
