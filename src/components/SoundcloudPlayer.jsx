import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import "../player.css";
import { useAudio } from "../AudioContext";

export default function SoundCloudPlayer({ playingGuest, isMobile }) {
  const {
    title2: artist,
    title,
    rpCount,
    mixId: track,
    src: pic,
    chapters,
  } = playingGuest;

  const audioContext = useAudio();

  const {
    audioRef,
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    currentTime,
    setCurrentTime,
  } = audioContext || {};

  useEffect(() => {
    if (!audioContext) {
      console.error("Audio context is undefined");
    }
  }, [audioContext]);

  const [currentlyPlayingSrc, setCurrentlyPlayingSrc] = useState(null);
  const [currentlyPlayingTitle, setCurrentlyPlayingTitle] = useState("");
  const [currentlyPlayingArtist, setCurrentlyPlayingArtist] = useState("");

  const [hoveredChapter, setHoveredChapter] = useState("");
  const [shouldScroll, setShouldScroll] = useState(false);
  const titleRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (artist && track && title && playingGuest) {
      setCurrentlyPlayingArtist(artist);
      setCurrentlyPlayingSrc(track);
      setCurrentlyPlayingTitle(rpCount + title);
      setProgress(0);
      setCurrentTime("--:--");
      setIsPlaying(true);

      if (audioRef.current) {
        const audio = audioRef.current;
        audio.load();

        const handleCanPlay = () => {
          audio.play().catch((error) => {
            console.error("iOS blocked playback:", error);
          });
        };

        audio.addEventListener("canplaythrough", handleCanPlay);

        return () => {
          audio.removeEventListener("canplaythrough", handleCanPlay);
        };
      }
    }
  }, [
    artist,
    audioRef,
    playingGuest,
    rpCount,
    setCurrentTime,
    setIsPlaying,
    setProgress,
    title,
    track,
  ]);

  useEffect(() => {
    const enableAutoplay = () => {
      if (audioRef.current) {
        // Try playing the audio and catch any potential errors
        audioRef.current.play().catch((error) => {
          console.warn("Autoplay prevented:", error);
        });
      }
    };

    // This ensures that the autoplay is triggered by a touch or click event
    document.body.addEventListener("touchstart", enableAutoplay, {
      once: true,
    });
    document.body.addEventListener("click", enableAutoplay, { once: true });

    return () => {
      document.body.removeEventListener("touchstart", enableAutoplay);
      document.body.removeEventListener("click", enableAutoplay);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlayThrough = () => {
      // Check if the duration is valid
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("canplaythrough", handleCanPlayThrough);

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [artist, track, title, audioRef, setProgress]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
      });
    } else {
      audioRef.current.pause();
    }

    setIsPlaying(!audioRef.current.paused);
  };

  const handleChapterClick = (chapterStartTime, event) => {
    event.stopPropagation();
    if (audioRef.current) {
      audioRef.current.currentTime = chapterStartTime;
      setProgress((chapterStartTime / audioRef.current.duration) * 100);
    }
  };

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

  const toSeconds = (time) => {
    let [minutes, seconds] = time.split(":").map(Number);
    return minutes * 60 + seconds;
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

  useEffect(() => {
    if (titleRef.current && containerRef.current) {
      setShouldScroll(
        titleRef.current.scrollWidth > containerRef.current.clientWidth
      );
    }
  }, [currentlyPlayingTitle]);

  const updatePlayState = () => {
    setIsPlaying(!audioRef.current.paused);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("play", updatePlayState);
      audio.addEventListener("pause", updatePlayState);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("play", updatePlayState);
        audio.removeEventListener("pause", updatePlayState);
      }
    };
  }, []);

  useEffect(() => {
    if (titleRef.current && containerRef.current) {
      setShouldScroll(
        titleRef.current.scrollWidth > containerRef.current.clientWidth
      );
    }
  }, [title]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const updateProgress = () => {
      const current = audio.currentTime;
      const duration = audio.duration;
      setProgress((current / duration) * 100);
      setCurrentTime(formatTime(current)); // Update currentTime
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [artist, track, title, audioRef, setProgress, setCurrentTime]);

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        audioRef.current.duration
      );
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };

  useEffect(() => {
    document.body.addEventListener(
      "touchstart",
      () => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      },
      { once: true }
    );
  }, []);

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
  }, []);

  useEffect(() => {
    document.body.addEventListener(
      "touchstart",
      () => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      },
      { once: true }
    );
  }, []);

  return (
    <>
      {track != "" && (
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
          <audio ref={audioRef} src={currentlyPlayingSrc} />
          {isMobile
            ? // MOBILE VERSION
              track != "" && (
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
                    <div
                      ref={containerRef}
                      className={"scrolling-title-container-mob-addon"}
                    >
                      <div className="gradient-overlay-mob" />
                      <div
                        className={`${
                          isMobile ? "scrolling-title-mob" : "scrolling-title"
                        } ${shouldScroll ? "scroll" : ""}`}
                        style={{ fontSize: "1.6vh", paddingLeft: "1vw" }}
                      >
                        {currentlyPlayingTitle}
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
                        {currentlyPlayingArtist}
                      </p>
                    </div>
                  </div>
                  <div className="timestamp">
                    <p>
                      {formatTime(toSeconds(currentTime))} /{" "}
                      <b>
                        {audioRef.current?.duration &&
                        !isNaN(audioRef.current.duration)
                          ? formatTime(audioRef.current.duration)
                          : "--:--"}
                      </b>
                    </p>
                  </div>
                </div>
              )
            : // DESKTOP VERSION
              track != "" && (
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
                  <div
                    ref={containerRef}
                    className="scrolling-title-container__desktop"
                  >
                    <div className="gradient-overlay" />
                    <div ref={titleRef} className="scrolling-title__desktop">
                      <b>{currentlyPlayingTitle}</b>
                    </div>
                  </div>
                  <span>{currentlyPlayingArtist}</span>
                  <br />
                  <p style={{ fontSize: "2vh" }}>
                    {formatTime(toSeconds(currentTime))}/{" "}
                    <b>
                      {audioRef.current
                        ? formatTime(audioRef.current.duration)
                        : "--:--"}
                    </b>
                  </p>
                </div>
              )}

          {/* TIMELINE */}
          <div
            className="completed-progress__desktop"
            style={{ height: `${progress}%` }}
          />

          {chapters.map((chapter, index) => (
            <React.Fragment key={index}>
              <div
                onMouseEnter={() => {
                  setHoveredChapter(chapter?.title);
                }}
                onMouseLeave={() => setHoveredChapter("")}
                className="progress-bar-chapter-slit-hitbox__desktop"
                style={{
                  top: `${
                    audioRef.current?.duration
                      ? (chapter.startTime / audioRef.current.duration) * 100 -
                        1
                      : 0
                  }%`,
                }}
                onClick={(e) => handleChapterClick(chapter.startTime, e)}
              />

              <div
                className="progress-bar-chapter-slit__desktop"
                style={{
                  height: hoveredChapter === chapter?.title ? "3px" : "1px",
                  top: `${
                    audioRef.current?.duration
                      ? (chapter.startTime / audioRef.current.duration) * 100
                      : 0
                  }%`,
                  backgroundColor:
                    hoveredChapter === chapter?.title ? "#000000" : "white",
                }}
                onMouseEnter={() => setHoveredChapter(chapter?.title)}
                onMouseLeave={() => setHoveredChapter("")}
              />
            </React.Fragment>
          ))}
          <img
            src="/indicator.png"
            className="progress-bar-current-icon__desktop"
            alt="Indicator"
          />
        </div>
      )}
    </>
  );
}
