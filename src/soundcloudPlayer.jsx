import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

export default function SoundCloudPlayer({
  pic,
  track,
  chapters,
  title,
  artist,
  tracklist,
}) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("--:--");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [hoveredTitle, setHoveredTitle] = useState("");
  const [hoveredChapter, setHoveredChapter] = useState("");
  const [shouldScroll, setShouldScroll] = useState(false);
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    setIsPlaying(!audioRef.current.paused); // Update the state manually
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
    }
    audioRef.current.play();
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
  }, [title]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updatePlayState = () => setIsPlaying(!audio.paused);

    audio.addEventListener("play", updatePlayState);
    audio.addEventListener("pause", updatePlayState);

    return () => {
      audio.removeEventListener("play", updatePlayState);
      audio.removeEventListener("pause", updatePlayState);
    };
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        setIsPlaying(true);
        const current = audioRef.current.currentTime;
        setProgress(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        );
        setCurrentTime(formatTime(current)); // Update the displayed time
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateProgress);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <>
      {tracklist != null && (
        <div className={`tracklist `}>
          {isMobile ? (
            <></>
          ) : (
            <table>
              {tracklist?.map((mixTrack, index) => (
                <React.Fragment key={index}>
                  {mixTrack.title === "RADIO (a)" ||
                  mixTrack.title === "PROJECT" ||
                  mixTrack.title === "RADIO (b)" ? (
                    <tr style={{ width: "100%", height: "1vh" }}></tr>
                  ) : null}
                  <tr
                    className="mix-track"
                    style={{
                      cursor:
                        mixTrack.title === "RADIO (a)" ||
                        mixTrack.title === "PROJECT" ||
                        mixTrack.title === "RADIO (b)"
                          ? "pointer"
                          : "",
                      width: "100%",
                      animationDelay: `${index * 0.0375}s`,
                    }}
                    onClick={(e) => {
                      if (
                        mixTrack.title === "RADIO (a)" ||
                        mixTrack.title === "PROJECT" ||
                        mixTrack.title === "RADIO (b)"
                      ) {
                        handleChapterClick(mixTrack.startTime, e);
                      }
                    }}
                    onMouseEnter={() => {
                      setHoveredTitle(mixTrack.title);
                    }}
                    onMouseLeave={() => setHoveredTitle("")}
                  >
                    <td
                      className="mix-track"
                      style={{
                        color:
                          hoveredTitle === mixTrack?.title &&
                          mixTrack?.title !== "UNRELEASED"
                            ? "red"
                            : mixTrack.title === "RADIO (a)" ||
                              mixTrack.title === "PROJECT" ||
                              mixTrack.title === "RADIO (b)"
                            ? "rgb(255, 0, 0)"
                            : "black",
                        textAlign: "right",
                        width: "30vw",
                        paddingLeft: "1vw",
                        paddingRight: "1vw",
                      }}
                    >
                      <b
                        className="mix-track"
                        style={{
                          backgroundColor:
                            hoveredChapter === mixTrack?.title ||
                            mixTrack?.title === "UNRELEASED"
                              ? "black"
                              : "",
                          color:
                            hoveredChapter === mixTrack?.title ? "white" : "",
                          fontWeight: mixTrack?.artist === "" ? "100" : "",
                        }}
                      >
                        {mixTrack.title}
                      </b>
                    </td>
                    <td
                      style={{
                        color: "rgb(137, 137, 137)",
                        fontWeight: "100",
                      }}
                    >
                      {mixTrack.artist}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </table>
          )}
        </div>
      )}

      <div
        className={`total-timeline-container `}
        style={{
          pointerEvents: track == null ? "none" : "",
          opacity: track == null ? "0" : "1",
        }}
      >
        <audio ref={audioRef} src={track} />
        <div
          className={`progress-bar-container ${
            isMobile ? "progress-bar-container-mob" : ""
          }`}
          onClick={handleProgressBarClick}
          style={{ zIndex: "999" }}
        >
          {isMobile ? (
            <div
              className={` ${isMobile ? "track-info-addon" : "track-info"}`}
              onClick={(e) => e.stopPropagation()}
              style={{ cursor: "pointer", display: "flex" }}
            >
              <div>
                <img src={pic} />
              </div>
              <div className="controls-mob">
                <a
                  style={{
                    fontSize: "3vh",
                    paddingLeft: "15px",
                    paddingRight: "30px",
                  }}
                  className="control-mob"
                  onClick={(e) => togglePlayPause(e)}
                >
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
                    ref={titleRef}
                    className={`${
                      isMobile ? "scrolling-title-mob" : "scrolling-title"
                    } ${shouldScroll ? "scroll" : ""}`}
                  >
                    {title}
                  </div>
                </div>
                <div style={{ height: "20px" }}>
                  <p
                    style={{
                      fontSize: "1.4vh",
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
                  {currentTime} /{" "}
                  <b>
                    {audioRef.current
                      ? formatTime(audioRef.current.duration)
                      : "--:--"}
                  </b>
                </p>
              </div>

              {/* <div className={`info-text `}>
                <p>
                  <div className="controls">
                    <div
                      className="control"
                      onClick={skipBackward}
                      style={{ fontSize: "3.15vh" }}
                    >
                      {" "}
                      &#10226;
                    </div>
                    <a
                      style={{ fontSize: "1.4vh" }}
                      className="control"
                      onClick={(e) => togglePlayPause(e)}
                    >
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </a>
                    <div
                      className="control"
                      onClick={skipForward}
                      style={{ fontSize: "3.15vh" }}
                    >
                      &#10227;
                    </div>
                  </div>
                  
                  <span>
                    <b
                      style={{
                        textTransform: "uppercase",
                        width: "auto",
                        backgroundColor: "black",
                        color: "white",
                        paddingTop: ".25vh",
                        paddingBottom: ".25vh",
                        paddingLeft: ".25vw",
                        paddingRight: ".25vw",
                        fontSize: "1.745vh",
                      }}
                    >
                      {artist}
                    </b>
                  </span>
                  <br />
                  <br />
                  
                </p>
              </div> */}
            </div>
          ) : (
            <div
              className={`track-info ${isMobile ? "track-info-addon" : ""}`}
              onClick={(e) => e.stopPropagation()}
              style={{ cursor: "pointer" }}
            >
              <div className={`info-text `}>
                <p>
                  <div className="controls">
                    <div
                      className="control"
                      onClick={skipBackward}
                      style={{ fontSize: "2.8vh", color: "gray" }}
                    >
                      {" "}
                      &#10226;
                    </div>
                    <a
                      style={{ fontSize: "1.4vh", color: "gray" }}
                      className="control"
                      onClick={(e) => togglePlayPause(e)}
                    >
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </a>
                    <div
                      className="control"
                      onClick={skipForward}
                      style={{ fontSize: "2.8vh", color: "gray" }}
                    >
                      &#10227;
                    </div>
                  </div>
                  <div
                    ref={containerRef}
                    className={`scrolling-title-container ${
                      isMobile ? "scrolling-title-container-mob-addon" : ""
                    }`}
                  >
                    <div className="gradient-overlay" />
                    <div
                      ref={titleRef}
                      className={`scrolling-title ${
                        shouldScroll ? "scroll" : ""
                      }`}
                    >
                      <b>{title}</b>
                    </div>
                  </div>
                  <span>
                    <b
                      style={{
                        textTransform: "uppercase",
                        width: "auto",
                        backgroundColor: "black",
                        color: "white",
                        paddingTop: ".25vh",
                        paddingBottom: ".25vh",
                        paddingLeft: ".25vw",
                        paddingRight: ".25vw",
                        fontSize: "1.745vh",
                      }}
                    >
                      {artist}
                    </b>
                  </span>
                  <br />
                  <br />
                  {currentTime} /{" "}
                  {audioRef.current
                    ? formatTime(audioRef.current.duration)
                    : "--:--"}
                </p>
              </div>
            </div>
          )}

          <div
            className="progress-bar"
            style={{ height: `${progress}%` }}
          ></div>
          {chapters?.map((chapter, index) => (
            <React.Fragment key={index}>
              <div
                onMouseEnter={() => {
                  setHoveredChapter(chapter?.title);
                  console.log(chapter?.title);
                }}
                onMouseLeave={() => setHoveredChapter("")}
                className="chapter-slit"
                style={{
                  top: `${
                    audioRef.current?.duration
                      ? (chapter.startTime / audioRef.current.duration) * 100 -
                        1
                      : 0
                  }%`,
                }}
                onClick={(e) => handleChapterClick(chapter.startTime, e)}
              ></div>

              <div
                className="icon"
                style={{
                  height: hoveredChapter === chapter?.title ? "3px" : "1px",
                  top: `${
                    audioRef.current?.duration
                      ? (chapter.startTime / audioRef.current.duration) * 100
                      : 0
                  }%`,
                  backgroundColor:
                    hoveredChapter === chapter?.title ? "#7a0000" : "white",
                }}
                onMouseEnter={() => setHoveredChapter(chapter?.title)}
                onMouseLeave={() => setHoveredChapter("")}
              >
                {isMobile ? (
                  <></>
                ) : (
                  <span
                    className="tag"
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      fontWeight: "bold",
                      opacity: hoveredChapter === chapter?.title ? "1" : "0",
                      transition: "opacity 0.3s ease-in-out", // Smooth fade effect
                    }}
                  >
                    {chapter?.title}
                  </span>
                )}
              </div>
            </React.Fragment>
          ))}
          <img
            src="/indicator.png"
            className="progress-circle"
            alt="Indicator"
          />
        </div>
      </div>
    </>
  );
}
