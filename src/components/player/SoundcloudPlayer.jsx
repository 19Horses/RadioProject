import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SoundcloudPlayer.css";
import { useAudio } from "../../AudioContext";
import { db } from "../utils/Firebase.jsx";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export default function SoundCloudPlayer({ playingGuest, isMobile, darkMode }) {
  const navigate = useNavigate();

  // Comments with timestamps for the timeline
  const [commentMarkers, setCommentMarkers] = useState([]);
  const {
    title2: artist,
    title,
    rpCount,
    mixId: track,
    src: pic,
    chapters = [],
  } = playingGuest || {};

  const [volume, setVolume] = useState(0.75);
  const [volumeSliderHovered, setVolumeSliderHovered] = useState(false);
  const [timelineHovered, setTimelineHovered] = useState(false);
  const [timelineMouseY, setTimelineMouseY] = useState(50);
  const [hideComments, setHideComments] = useState(false);

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
    setCurrentTimeSeconds,
  } = audioContext || {};

  useEffect(() => {
    if (!audioContext) {
      console.error("Audio context is undefined");
    }
  }, [audioContext]);

  // Track which comments have been triggered and show them for 10 seconds
  const triggeredCommentsRef = useRef(new Set());
  const activeTimeoutRef = useRef(null);

  useEffect(() => {
    if (!commentMarkers.length || !audioRef?.current) {
      setActiveCommentId(null);
      return;
    }

    const checkTimestamp = () => {
      const currentTime = audioRef.current?.currentTime || 0;

      // Find a comment we just passed (within 1 second window) that hasn't been triggered yet
      const justPassedComment = commentMarkers.find((comment) => {
        const diff = currentTime - comment.trackTimestamp;
        // Trigger if we're 0-2 seconds past the timestamp and haven't triggered this one yet
        return (
          diff >= 0 &&
          diff <= 2 &&
          !triggeredCommentsRef.current.has(comment.id)
        );
      });

      if (justPassedComment) {
        // Mark as triggered
        triggeredCommentsRef.current.add(justPassedComment.id);

        // Show the comment
        setActiveCommentId(justPassedComment.id);

        // Clear any existing timeout
        if (activeTimeoutRef.current) {
          clearTimeout(activeTimeoutRef.current);
        }

        // Hide after 10 seconds
        activeTimeoutRef.current = setTimeout(() => {
          setActiveCommentId(null);
        }, 10000);
      }
    };

    // Check frequently for timestamp triggers
    const interval = setInterval(checkTimestamp, 250);

    return () => {
      clearInterval(interval);
      if (activeTimeoutRef.current) {
        clearTimeout(activeTimeoutRef.current);
      }
    };
  }, [commentMarkers, audioRef]);

  // Reset triggered comments when track changes or seeks backwards significantly
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const handleSeeked = () => {
      // Clear triggered comments on seek so they can trigger again
      triggeredCommentsRef.current.clear();
      setActiveCommentId(null);
    };

    audio.addEventListener("seeked", handleSeeked);
    return () => audio.removeEventListener("seeked", handleSeeked);
  }, [audioRef]);

  // Fetch comments with timestamps for the current mix
  useEffect(() => {
    if (!playingGuest?.url) {
      setCommentMarkers([]);
      return;
    }

    // Query all comments for this mix, then filter client-side for those with timestamps
    const q = query(
      collection(db, "comments"),
      where("itemId", "==", playingGuest.url),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const markers = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (comment) =>
              comment.trackTimestamp !== undefined &&
              comment.trackTimestamp !== null &&
              typeof comment.trackTimestamp === "number",
          );
        setCommentMarkers(markers);
      },
      (error) => {
        // Handle index not ready error gracefully
        console.log(
          "Comment markers query error (index may need to be created):",
          error.message,
        );
        setCommentMarkers([]);
      },
    );

    return () => unsubscribe();
  }, [playingGuest?.url]);

  const [currentlyPlayingSrc, setCurrentlyPlayingSrc] = useState(null);
  const [currentlyPlayingTitle, setCurrentlyPlayingTitle] = useState("");
  const [currentlyPlayingArtist, setCurrentlyPlayingArtist] = useState("");

  const [hoveredChapter, setHoveredChapter] = useState("");
  const [hoveredComment, setHoveredComment] = useState(null);
  const [hoveredTrackInfo, setHoveredTrackInfo] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
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
        prevTitleRef.current != "" ? 1000 : 0,
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
    const parts = time.split(":").map(Number);
    if (parts.length === 3) {
      // h:mm:ss format
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    } else {
      // mm:ss format
      const [minutes, seconds] = parts;
      return minutes * 60 + seconds;
    }
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
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
  };

  useEffect(() => {
    if (titleRef.current && containerRef.current) {
      setShouldScroll(
        titleRef.current.scrollWidth > containerRef.current.clientWidth,
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
        titleRef.current.scrollWidth > containerRef.current.clientWidth,
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
      if (setCurrentTimeSeconds) {
        setCurrentTimeSeconds(current); // Update currentTimeSeconds for section tracking
      }
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [
    artist,
    track,
    title,
    audioRef,
    setProgress,
    setCurrentTime,
    setCurrentTimeSeconds,
  ]);

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        audioRef.current.duration,
      );
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0,
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
      { once: true },
    );
  }, []);

  useEffect(() => {
    document.body.addEventListener(
      "touchstart",
      () => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      },
      { once: true },
    );
  }, []);

  return (
    <div>
      {/* Audio element must always be rendered */}
      <audio ref={audioRef} src={currentlyPlayingSrc} />
      {track != "" && (
        <>
          {!isMobile && track != "" && (
            <div
              className={`control-module__desktop control-module-desktop ${
                fade === "fade-in"
                  ? "control-module-desktop-fade-in"
                  : "control-module-desktop-fade-out"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left column: Timeline bar */}
              {timelineBar()}

              {/* Right column: Controls + Volume */}
              <div className="controls-column">
                {/* Play button */}
                <a
                  className="play-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                >
                  {isPlaying ? "❚❚" : "▶"}
                </a>

                {/* Track info block */}
                <div
                  className={`track-info-block ${
                    fade === "fade-in"
                      ? "track-info-block-fade-in"
                      : "track-info-block-fade-out"
                  }`}
                  onMouseEnter={() => setHoveredTrackInfo(true)}
                  onMouseLeave={() => setHoveredTrackInfo(false)}
                  onClick={() => {
                    if (rpCount) {
                      navigate(`/mix/${playingGuest.url}`);
                    }
                  }}
                >
                  <p className="track-info-paragraph">
                    <span
                      className={`track-title-span ${
                        hoveredTrackInfo
                          ? "track-title-span-hovered"
                          : "track-title-span-not-hovered"
                      } ${
                        visibleTitle != null
                          ? "track-title-span-with-title"
                          : "track-title-span-without-title"
                      }`}
                    >
                      {visibleTitle}
                    </span>
                    {"   "}
                    <span className="track-time-span">
                      {formatTime(toSeconds(currentTime))}
                    </span>
                  </p>
                  <p
                    className={`track-artist-paragraph ${
                      hoveredTrackInfo
                        ? "track-artist-paragraph-hovered"
                        : "track-artist-paragraph-not-hovered"
                    } ${
                      visibleTitle != null
                        ? "track-artist-paragraph-with-title"
                        : "track-artist-paragraph-without-title"
                    }`}
                  >
                    {visibleArtist}
                  </p>
                </div>

                {/* Comment toggle button */}
                <button
                  className={`comment-toggle-button ${
                    hideComments ? "comment-toggle-button-active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHideComments(!hideComments);
                  }}
                  title={hideComments ? "Show comments" : "Hide comments"}
                >
                  c
                </button>

                {/* Volume slider at bottom */}
                <div className="volume-slider-container">{VolumeSlider()}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  function VolumeSlider() {
    return (
      <input
        id="volume-slider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        onMouseEnter={() => setVolumeSliderHovered(true)}
        onMouseLeave={() => setVolumeSliderHovered(false)}
        className={`volume-slider ${
          volumeSliderHovered
            ? "volume-slider-hovered"
            : "volume-slider-not-hovered"
        }`}
        style={{
          background: `linear-gradient(to right, #434a47 0%, #d4d4d4 ${
            volume * 100
          }%, #d4d4d4 ${volume * 100}%, #d4d4d4 100%)`,
        }}
        aria-label="Volume slider"
      />
    );
  }

  function timelineBar() {
    if (!audioRef) return null; // Guard against undefined audioRef

    return (
      <div
        className={`timeline-progress-bar-container__desktop timeline-bar-container ${
          isMobile ? "timeline-progress-bar-container__mobile" : ""
        } ${
          track == null
            ? "timeline-bar-container-no-track"
            : "timeline-bar-container-with-track"
        }`}
        onClick={handleProgressBarClick}
        onMouseEnter={() => setTimelineHovered(true)}
        onMouseLeave={() => setTimelineHovered(false)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setTimelineMouseY(y);
        }}
      >
        {/* Hover gradient overlay - only affects the gray (unplayed) portion */}
        <div
          className={`timeline-hover-gradient-overlay ${
            timelineHovered && timelineMouseY > progress
              ? "timeline-hover-gradient-overlay-visible"
              : "timeline-hover-gradient-overlay-hidden"
          }`}
          style={{
            top: `${progress}%`,
            background: `linear-gradient(to bottom, transparent 0%, #434a479f ${Math.max(
              0,
              ((timelineMouseY - progress) / (100 - progress)) * 100,
            )}%, transparent 100%)`,
          }}
        />
        {/* TIMELINE */}
        <div
          className="completed-progress__desktop"
          style={{
            height: `${progress}%`,
            backgroundColor: playingGuest?.themeColor || "rgb(255, 0, 90)",
            transition: "height 0.5s linear, background-color 0.5s ease-in-out",
          }}
        />

        {chapters &&
          chapters.map((chapter, index) => (
            <React.Fragment key={index}>
              <div
                onMouseEnter={() => {
                  setHoveredChapter(chapter?.title);
                }}
                onMouseLeave={() => setHoveredChapter("")}
                className="progress-bar-chapter-slit-hitbox__desktop"
                style={{
                  top: `${
                    audioRef?.current?.duration
                      ? (chapter.startTime / audioRef.current.duration) * 100 -
                        1
                      : 0
                  }%`,
                }}
                onClick={(e) => handleChapterClick(chapter.startTime, e)}
              />

              <div
                className={`progress-bar-chapter-slit__desktop ${
                  hoveredChapter === chapter?.title
                    ? "progress-bar-chapter-slit__desktop-hovered"
                    : "progress-bar-chapter-slit__desktop-not-hovered"
                }`}
                style={{
                  top: `${
                    audioRef?.current?.duration
                      ? (chapter.startTime / audioRef.current.duration) * 100
                      : 0
                  }%`,
                }}
                onMouseEnter={() => setHoveredChapter(chapter?.title)}
                onMouseLeave={() => setHoveredChapter("")}
              />
            </React.Fragment>
          ))}

        {/* Comment markers on timeline - grouped by minute */}
        <style>
          {`
            @keyframes iconBlink {
              0%, 49% { opacity: 1; }
              50%, 100% { opacity: 0; }
            }
          `}
        </style>
        <div
          className={`comment-markers-container ${
            hideComments ? "comment-markers-hidden" : ""
          }`}
        >
          {(() => {
            const duration = audioRef?.current?.duration;
            if (!duration || duration <= 0) return null;

            // Group comments by 2-minute intervals
            const groupedByMinute = {};
            commentMarkers.forEach((comment) => {
              const minute = Math.floor(comment.trackTimestamp / 120); // 120 seconds = 2 minutes
              if (!groupedByMinute[minute]) {
                groupedByMinute[minute] = [];
              }
              groupedByMinute[minute].push(comment);
            });

            return Object.entries(groupedByMinute).map(([minute, comments]) => {
              // Use the first comment's timestamp for positioning
              const firstComment = comments[0];
              const rawPosition =
                (firstComment.trackTimestamp / duration) * 100;
              if (rawPosition < 0 || rawPosition > 100) return null;
              const position = Math.max(0.8, Math.min(99.2, rawPosition));

              return (
                <div
                  key={`minute-${minute}`}
                  className="comment-marker-group"
                  style={{
                    top: `${position}%`,
                  }}
                >
                  {/* Grid of markers (rows of 3, stacking right to left) */}
                  <div className="comment-marker-grid">
                    {comments.map((comment) => {
                      const isRadioProject =
                        comment.author?.trim().toUpperCase() ===
                        "RADIOPROJECT2047";

                      return (
                        <div
                          key={comment.id}
                          className={`comment-marker ${
                            comment.replyTo ? "comment-marker-reply" : ""
                          } ${
                            hoveredComment === comment.id ||
                            activeCommentId === comment.id
                              ? "comment-marker-active"
                              : "comment-marker-inactive"
                          }`}
                          style={
                            isRadioProject ? { backgroundColor: "#346fc7" } : {}
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            if (audioRef?.current) {
                              audioRef.current.currentTime =
                                comment.trackTimestamp;
                              setProgress(
                                (comment.trackTimestamp /
                                  audioRef.current.duration) *
                                  100,
                              );
                            }
                          }}
                          onMouseEnter={() => setHoveredComment(comment.id)}
                          onMouseLeave={() => setHoveredComment(null)}
                        />
                      );
                    })}
                  </div>
                  {/* Single horizontal line to timeline center */}
                  <div className="comment-marker-line" />
                  {/* Comment preview tooltip - positioned to left of markers */}
                  {comments.some(
                    (c) => hoveredComment === c.id || activeCommentId === c.id,
                  ) && (
                    <div
                      className="comment-preview-tooltip"
                      onClick={(e) => {
                        const activeComment = comments.find(
                          (c) =>
                            hoveredComment === c.id || activeCommentId === c.id,
                        );
                        const isRadioProject =
                          activeComment?.author?.trim().toUpperCase() ===
                          "RADIOPROJECT2047";

                        if (isRadioProject && activeComment?.content) {
                          // Extract URL from comment content
                          const urlRegex = /(https?:\/\/[^\s]+)/g;
                          const urls = activeComment.content.match(urlRegex);

                          if (urls && urls.length > 0) {
                            e.stopPropagation();
                            window.open(
                              urls[0],
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }
                        }
                      }}
                      style={{
                        cursor: (() => {
                          const activeComment = comments.find(
                            (c) =>
                              hoveredComment === c.id ||
                              activeCommentId === c.id,
                          );
                          const isRadioProject =
                            activeComment?.author?.trim().toUpperCase() ===
                            "RADIOPROJECT2047";
                          return isRadioProject &&
                            activeComment?.content?.match(
                              /(https?:\/\/[^\s]+)/g,
                            )
                            ? "pointer"
                            : "default";
                        })(),
                        color: (() => {
                          const activeComment = comments.find(
                            (c) =>
                              hoveredComment === c.id ||
                              activeCommentId === c.id,
                          );
                          const isRadioProject =
                            activeComment?.author?.trim().toUpperCase() ===
                            "RADIOPROJECT2047";
                          return isRadioProject &&
                            activeComment?.content?.match(
                              /(https?:\/\/[^\s]+)/g,
                            )
                            ? "#346fc7"
                            : "#434a47";
                        })(),
                      }}
                    >
                      {(() => {
                        const activeComment = comments.find(
                          (c) =>
                            hoveredComment === c.id || activeCommentId === c.id,
                        );

                        const isRadioProject =
                          activeComment?.author?.trim().toUpperCase() ===
                          "RADIOPROJECT2047";

                        if (isRadioProject && activeComment?.content) {
                          const urlRegex = /(https?:\/\/[^\s]+)/g;
                          const hasUrl = activeComment.content.match(urlRegex);

                          if (hasUrl) {
                            return "→ link";
                          }
                        }

                        return activeComment?.replyTo
                          ? `→ ${activeComment.content}`
                          : activeComment?.content;
                      })()}
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>

        <img
          src="/indicator.png"
          className="progress-bar-current-icon__desktop"
          alt="Indicator"
          style={{
            top: `clamp(0px, calc(${progress}% - 7.5px), calc(100% - 15px))`,
          }}
        />
      </div>
    );
  }
}
