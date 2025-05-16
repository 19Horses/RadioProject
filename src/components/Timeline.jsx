export const Timeline = ({}) => {
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
            style={{ display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoveredControls(true)}
            onMouseLeave={() => setHoveredControls(false)}
          >
            <a href={playingGuest.djLink} target="_blank">
              <img
                style={{ paddingTop: "auto" }}
                className="mix-pic"
                src={pic}
              />
            </a>
            <div className="scrolling-info" style={{ width: "100%" }}>
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
              <p style={{ fontSize: "1.5vh", paddingTop: "0" }}>
                {formatTime(toSeconds(currentTime))}/{" "}
                {audioRef.current
                  ? formatTime(audioRef.current.duration)
                  : "--:--"}
              </p>
            </div>

            <div
              className="time-controls__desktop"
              onClick={(e) => e.stopPropagation()}
            >
              <div onClick={skipBackward}> Backward</div>
              <div
                onClick={(e) => {
                  togglePlayPause(e);
                }}
              >
                {isPlaying ? <div>Pause</div> : <div>Play</div>}
              </div>
              <div onClick={skipForward}>Forward</div>
            </div>
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
  </div>;
};
