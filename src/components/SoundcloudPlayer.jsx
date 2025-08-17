import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import "../player.css";
import { useAudio } from "../AudioContext";

export default function SoundCloudPlayer({ playingGuest, isMobile, darkMode }) {
  const {
    title2: artist,
    title,
    rpCount,
    mixId: track,
    src: pic,
    chapters,
  } = playingGuest;

  const [volume, setVolume] = useState(0.75);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Volume change handler
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

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
      setCurrentlyPlayingTitle(title);
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

    return () => {
      document.body.removeEventListener("touchstart", enableAutoplay);
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
    console.log("TOGGLE");
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
      });
    } else {
      console.log("Pausing audio");
      audioRef.current.pause();
    }

    setIsPlaying(!audioRef.current.paused);
  };

  const [fade, setFade] = useState("fade-in");
  const prevTitleRef = useRef(currentlyPlayingTitle);
  const prevArtistRef = useRef(currentlyPlayingArtist);
  const [visibleTitle, setVisibleTitle] = useState(currentlyPlayingTitle);
  const [visibleArtist, setVisibleArtist] = useState(currentlyPlayingArtist);

  useEffect(() => {
    if (prevTitleRef.current !== currentlyPlayingTitle) {
      if (prevTitleRef.current != "") {
        setFade("fade-out");
      }

      setTimeout(
        () => {
          setVisibleTitle(currentlyPlayingTitle);
          setVisibleArtist(currentlyPlayingArtist);
          prevTitleRef.current = currentlyPlayingTitle;
          prevArtistRef.current = currentlyPlayingArtist;
          setFade("fade-in");
        },
        prevTitleRef.current != "" ? 1000 : 0
      ); // match CSS transition duration
    }
  }, [currentlyPlayingTitle, currentlyPlayingArtist]);

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
    if (isNaN(seconds) || seconds == null || seconds === Infinity) {
      return "--:--";
    }

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
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
      if (e.key === "ArrowRight") {
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
    <div>
      {track != "" && (
        <>
          {timelineBar()}
          <div className="player-background" />

          {isMobile
            ? // MOBILE VERSION
              track != "" && (
                <div
                  className="control-module__mobile"
                  onClick={(e) => e.stopPropagation()}
                  style={{ display: "flex", zIndex: "10000000" }}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("TOGGLE");
                      togglePlayPause();
                    }}
                    className="time-controls__mobile"
                    style={{ alignSelf: "flex-start" }}
                  >
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "2vh",
                        color: "black",
                      }}
                    >
                      <p
                        style={{
                          fontSize: isPlaying ? "2vh" : "3vh",
                          transform: isPlaying ? "" : "translateY(-1.6vh)",
                        }}
                      >
                        {" "}
                        {isPlaying ? "◼️" : "▶"}{" "}
                      </p>
                    </button>
                  </div>
                  <div className="mix-info">
                    <div
                      ref={containerRef}
                      className={"scrolling-title-container-mob-addon"}
                      style={{ paddingLeft: ".1rem" }}
                    >
                      <div
                        className="scrolling-title-mob"
                        style={{
                          fontSize: "1.6vh",
                          color: "white",
                          backgroundColor: "black",
                          marginRight: ".1rem",
                        }}
                      >
                        {currentlyPlayingTitle}
                        {"  "}
                      </div>
                    </div>
                    <div style={{ height: "auto", width: "auto" }}>
                      <p
                        style={{
                          fontSize: "1.6vh",
                          fontFamily: "Helvetica",
                          margin: "auto",
                          marginRight: ".1rem",
                          fontWeight: "1000",
                          textAlign: "right",
                          backgroundColor: "#f7f7f7",
                          display: "inline-block", // <— this makes it hug its content
                          width: "fit-content",
                        }}
                      >
                        {currentlyPlayingArtist} {"  "}
                      </p>
                    </div>
                  </div>
                  <div>
                    <a href={playingGuest.djLink} target="_blank">
                      <img src={pic} />
                    </a>
                  </div>
                </div>
              )
            : // DESKTOP VERSION
              track != "" && (
                <>
                  <div className="player-background" />
                  <div
                    className={`control-module__desktop ${fade}`}
                    style={{
                      transition: "opacity 0.7s ease",
                      opacity: fade === "fade-in" ? 1 : 0,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Play button */}
                    <a
                      style={{
                        position: "absolute",
                        top: "0%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        filter: darkMode ? "invert(1)" : "",
                        color: darkMode ? "black" : "",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause();
                      }}
                    >
                      {isPlaying ? "◼️" : "▶"}
                    </a>

                    {/* Track info block directly under the play button */}
                    <div
                      style={{
                        transform: "rotate(90deg)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        whiteSpace: "nowrap",
                        marginTop: "4vh",
                        transition:
                          visibleTitle != null ? "opacity 0.7s ease" : "",
                        opacity: fade === "fade-in" ? 1 : 0,
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        {visibleTitle}
                        {"   "}
                        <span
                          style={{
                            paddingLeft: "0.7vh",
                            fontWeight: 200,
                            backgroundColor: "transparent",
                            color: darkMode ? "white" : "black",
                          }}
                        >
                          {formatTime(toSeconds(currentTime))}
                        </span>
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "1.3vh",
                          fontWeight: "200",
                        }}
                      >
                        {visibleArtist}
                      </p>
                    </div>
                  </div>
                </>
              )}
          {isMobile
            ? // MOBILE VERSION
              null
            : VolumeSlider()}
        </>
      )}
    </div>
  );

  function VolumeSlider() {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "6.3%",
          right: "2%",
          width: isMobile ? "80%" : "5vh",
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          gap: "0.5rem",
          color: "white",
          fontFamily: "Helvetica",
          zIndex: "10000",
        }}
      >
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={{
            width: "10vh",
            cursor: "pointer",
            transform: isMobile ? "none" : "rotate(-90deg)",
            WebkitAppearance: "none",
            appearance: "none",
            height: isMobile ? "8px" : "3vh",
            background: darkMode
              ? `linear-gradient(to right, #ffffff ${volume * 100}%, #cacaca ${
                  volume * 100
                }%)`
              : `linear-gradient(to right, black ${volume * 100}%, #cacaca ${
                  volume * 100
                }%)`,
            borderBottom: "transparent",
          }}
          aria-label="Volume slider"
        />
      </div>
    );
  }

  function timelineBar() {
    return (
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
                    ? (chapter.startTime / audioRef.current.duration) * 100 - 1
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
                  hoveredChapter === chapter?.title
                    ? darkMode
                      ? "white"
                      : "#000000"
                    : darkMode
                    ? "black"
                    : "white",
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
    );
  }
}
