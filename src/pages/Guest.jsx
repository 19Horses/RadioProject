import React, { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Tracklist } from "../components/tracklist/Tracklist";
import { useParams, useNavigate } from "react-router-dom";
import { djs } from "./items";
import { useAudio } from "../AudioContext";
import "./Guest.css";

export const Guest = ({
  isMobile,
  setCurrentArticle,
  playingGuest,
  setPlayingGuest,
}) => {
  const { guestName } = useParams();
  const navigate = useNavigate();
  const selectedGuest = djs.find(
    (dj) => dj.url === guestName && dj.type === "mix",
  );
  const { currentTimeSeconds, progress, audioRef } = useAudio() || {};

  // Redirect to home if item doesn't exist or is not a mix
  useEffect(() => {
    const item = djs.find((dj) => dj.url === guestName);
    if (!item || item.type !== "mix") {
      navigate("/", { replace: true });
    }
  }, [guestName, navigate]);
  const prevSectionRef = useRef(null);

  useEffect(() => {
    if (selectedGuest && setCurrentArticle) {
      // Create a summary-compatible object for mixes
      const mixWithSummary = {
        ...selectedGuest,
        summary: selectedGuest.description, // Use description as summary
      };
      setCurrentArticle(mixWithSummary);
    }
    return () => {
      if (setCurrentArticle) {
        setCurrentArticle(null);
      }
    };
  }, [selectedGuest, setCurrentArticle]);

  const isPlayingThisGuest = selectedGuest?.url === playingGuest?.url;
  const hasPlayingGuest = playingGuest != null;

  // Determine current playing section based on chapters and current time
  const currentSection = useMemo(() => {
    if (!isPlayingThisGuest || !selectedGuest?.chapters) {
      return null;
    }

    const chapters = selectedGuest.chapters;

    // Try currentTimeSeconds first, fall back to calculating from progress
    let currentTime = currentTimeSeconds || 0;
    if (!currentTime && progress && audioRef?.current?.duration) {
      currentTime = (progress / 100) * audioRef.current.duration;
    }

    // Find which chapter we're in (chapters are typically named for sections)
    let section = "a"; // default to first section
    for (const chapter of chapters) {
      if (currentTime >= chapter.startTime) {
        // Map chapter titles to section names (use lowercase for comparison)
        const title = chapter.title?.toLowerCase() || "";
        if (title.includes("project") || title.includes("+")) {
          section = "+";
        } else if (title.includes("(b)") || title === "radio b") {
          section = "b";
        } else if (title.includes("(a)") || title === "radio a") {
          section = "a";
        }
      }
    }
    return section;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPlayingThisGuest,
    selectedGuest?.chapters,
    currentTimeSeconds,
    progress,
  ]);

  // Log when section changes
  useEffect(() => {
    if (currentSection && currentSection !== prevSectionRef.current) {
      const calculatedTime =
        progress && audioRef?.current?.duration
          ? (progress / 100) * audioRef.current.duration
          : null;
      console.log(`🎵 Entered section: ${currentSection}`, {
        currentTimeSeconds,
        progress,
        calculatedTime: calculatedTime?.toFixed(1),
        duration: audioRef?.current?.duration,
      });
      prevSectionRef.current = currentSection;
    }
  }, [currentSection, currentTimeSeconds, progress, audioRef]);

  // Output tracklist to console when guest page loads
  useEffect(() => {
    if (selectedGuest?.tracklist) {
      console.log(
        `\n%c📻 ${selectedGuest.rpCount} ${selectedGuest.title2?.toUpperCase()} - ${selectedGuest.title?.toUpperCase()}\n`,
        "font-weight: bold; font-size: 14px; color: " +
          (selectedGuest.themeColor || "#ff005a"),
      );

      let output = "";
      selectedGuest.tracklist.forEach((track, index) => {
        const isSectionBreak =
          track.title === "RADIO (a)" ||
          track.title === "PROJECT" ||
          track.title === "RADIO (b)";

        if (isSectionBreak) {
          const sectionLabel =
            track.title === "RADIO (a)"
              ? "\n\n⟨a⟩\n"
              : track.title === "PROJECT"
                ? "\n\n⟨+⟩\n"
                : track.title === "RADIO (b)"
                  ? "\n\n⟨b⟩\n"
                  : track.title;
          output += sectionLabel;
        } else {
          const superNum = String(index)
            .split("")
            .map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d])
            .join("");
          const title = track.title || "";
          const artist = track.artist || "";
          output += `${superNum}${title} ${artist} `;
        }
      });

      console.log(output.trim());
      console.log("\n");
    }
  }, [selectedGuest]);

  return (
    <>
      {/* Mobile play button - rendered via portal to bypass PageTransition transforms */}
      {isMobile &&
        selectedGuest &&
        !isPlayingThisGuest &&
        createPortal(
          <span
            className="guest-mobile-play-button"
            onClick={() => setPlayingGuest(selectedGuest)}
          >
            PLAY
          </span>,
          document.body,
        )}

      <div
        className={`guest-container ${
          isMobile ? "guest-container-mobile" : "guest-container-desktop"
        }`}
      >
        {/* Spacer for bookmark on desktop */}
        {!isMobile && <div className="guest-bookmark-spacer" />}

        {/* Tracklist content container */}
        <div
          className={`guest-tracklist-container ${
            isMobile
              ? "guest-tracklist-container-mobile"
              : "guest-tracklist-container-desktop"
          } ${
            !isMobile && playingGuest
              ? "guest-tracklist-container-playing"
              : "guest-tracklist-container-not-playing"
          } ${
            isMobile
              ? hasPlayingGuest
                ? "guest-tracklist-container-mobile-padding"
                : "guest-tracklist-container-mobile-no-padding"
              : ""
          }`}
        >
          <Tracklist
            selectedGuest={selectedGuest}
            isMobile={isMobile}
            isPlaying={isPlayingThisGuest}
            currentSection={currentSection}
          />
        </div>
      </div>
    </>
  );
};
