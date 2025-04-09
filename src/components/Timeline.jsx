import React, { useState } from "react";
import { useAudio } from "../AudioContext";

export const Timeline = ({ playingGuest }) => {
  const { chapters } = playingGuest;
  const [hoveredChapter, setHoveredChapter] = useState("");
  const audioContext = useAudio();
  const { audioRef, progress, skipTo } = audioContext;

  const handleChapterClick = (chapterStartTime, event) => {
    event.stopPropagation();
    if (audioRef.current) {
      skipTo(chapterStartTime);
    }
  };
  return (
    <>
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
    </>
  );
};
