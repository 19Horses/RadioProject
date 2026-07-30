import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import "./Tracklist.css";

// ── Interview transcripts ───────────────────────────────────────────────
// The PROJECT section of a mix is the interview: bare topic titles with no
// artist, sat between the two RADIO music sections. Clicking one drops its
// transcript in underneath. Placeholder copy until the real ones land.
const LOREM_LINES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.",
];

// "Radio Project" is always RP; the guest gets their own initials
const initialsFor = (name) => {
  if (!name) return "XX";
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "XX";
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
};

const TRANSCRIPT_MS = 450; // matches the grid-template-rows transition

// Transcript text is portable text so it can carry bold. Plain strings are
// still accepted — the placeholder copy uses them, as do any entries authored
// before the field became rich text.
const renderText = (value) => {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return null;
  return value.flatMap((block, b) =>
    block?._type !== "block"
      ? []
      : (block.children || []).map((span, s) =>
          span.marks?.includes("strong") ? (
            <strong key={`${b}-${s}`}>{span.text}</strong>
          ) : (
            <React.Fragment key={`${b}-${s}`}>{span.text}</React.Fragment>
          ),
        ),
  );
};

// Authored in Sanity as { speaker: "RP" | "guest", text }. "guest" resolves to
// the artist's initials here so the label never has to be retyped per mix.
// Falls back to placeholder copy for topics that have not been written up yet.
const transcriptFor = (track, index, guestInitials) => {
  const authored = track?.transcript?.filter((turn) => turn?.text?.length);
  if (authored?.length) {
    return authored.map((turn, i) => ({
      key: turn._key ?? i,
      speaker: turn.speaker === "guest" ? guestInitials : "RP",
      text: turn.text,
    }));
  }

  const turns = 4 + (index % 3); // 4–6 exchanges
  return Array.from({ length: turns }, (_, i) => ({
    key: i,
    speaker: i % 2 === 0 ? "RP" : guestInitials,
    text: LOREM_LINES[(index * 3 + i) % LOREM_LINES.length],
  }));
};

// ── TEMPORARY: cursor diagnostic. Delete this block and the useEffect that
// references it once the pointer-cursor bug is resolved. ────────────────────
const DEBUG_CURSOR = true;
let debugRenders = 0;
let debugNodeSeq = 0;

const TracklistInner = ({
  selectedGuest,
  isMobile,
  isPlaying,
  currentSection,
}) => {
  if (DEBUG_CURSOR) debugRenders++;
  const [visibleIndices, setVisibleIndices] = useState(new Set());
  // The transcript is block-level, so it breaks the inline tracklist flow. Only
  // the open one is mounted — otherwise every subject would be forced onto its
  // own line. `mounted` outlives `open` so the collapse can animate before it
  // leaves the DOM.
  const [mountedTranscript, setMountedTranscript] = useState(null);
  // Which subject is highlighted. Tracked apart from `mountedTranscript`
  // because switching lines delays the mount until the old panel has collapsed
  // — the highlight has to move the instant it is clicked.
  const [selectedSubject, setSelectedSubject] = useState(null);
  // Where the transcript is rendered. Not necessarily after the clicked item —
  // it goes at the end of that item's visual line so the line stays intact.
  // { anchor: render after this item, split: cut this item's title at `at` and
  // render the transcript between the halves }
  const [placement, setPlacement] = useState(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const transcriptTimerRef = useRef(null);
  const itemRefs = useRef({});
  const titleRefs = useRef({});
  const [hoverColors, setHoverColors] = useState({});
  const [activeHovers, setActiveHovers] = useState(new Set()); // tracks which items are actively hovered (not fading)
  const hoverTimeoutsRef = useRef({});

  // Helper to determine which section an item belongs to based on its index
  const getItemSection = (index) => {
    let currentSec = "a";
    for (let i = 0; i <= index; i++) {
      const title = selectedGuest.tracklist[i]?.title;
      if (title === "RADIO (a)") currentSec = "a";
      else if (title === "PROJECT") currentSec = "+";
      else if (title === "RADIO (b)") currentSec = "b";
    }
    return currentSec;
  };

  // Helper to get the position within the PROJECT section (for alternating fonts)
  const getProjectSectionIndex = (index) => {
    let projectIndex = -1;
    let inProjectSection = false;
    for (let i = 0; i <= index; i++) {
      const title = selectedGuest.tracklist[i]?.title;
      if (title === "PROJECT") {
        inProjectSection = true;
        projectIndex = -1; // Reset counter when entering PROJECT section
      } else if (title === "RADIO (b)") {
        inProjectSection = false;
      } else if (inProjectSection && title !== "RADIO (a)") {
        projectIndex++;
      }
    }
    return projectIndex;
  };

  // Helper to determine if an item should be dark (already played or currently playing)
  const shouldBeDark = (itemSection) => {
    if (!isPlaying || !currentSection) return false;

    // If in section "a", only "a" items are dark
    if (currentSection === "a") return itemSection === "a";
    // If in section "+", "a" and "+" items are dark
    if (currentSection === "+")
      return itemSection === "a" || itemSection === "+";
    // If in section "b", all items are dark
    if (currentSection === "b") return true;

    return false;
  };

  useEffect(() => {
    // Clear any pending hover timeouts when guest changes
    Object.values(hoverTimeoutsRef.current).forEach((timeout) =>
      clearTimeout(timeout),
    );
    hoverTimeoutsRef.current = {};
    setHoverColors({});
    setActiveHovers(new Set());
    clearTimeout(transcriptTimerRef.current);
    setMountedTranscript(null);
    setSelectedSubject(null);
    setPlacement(null);
    setTranscriptOpen(false);

    if (!selectedGuest) return;

    // Create randomized order of indices when guest changes
    const indices = selectedGuest.tracklist.map((_, i) => i);
    const shuffled = [...indices].sort(() => Math.random() - 0.5);
    setVisibleIndices(new Set());

    const itemsPerBatch = 3; // 3 items at a time
    let batchIndex = 0;

    const interval = setInterval(() => {
      const startIdx = batchIndex * itemsPerBatch;
      const endIdx = Math.min(startIdx + itemsPerBatch, shuffled.length);

      if (startIdx >= shuffled.length) {
        clearInterval(interval);
        return;
      }

      setVisibleIndices((prev) => {
        const newSet = new Set(prev);
        for (let i = startIdx; i < endIdx; i++) {
          newSet.add(shuffled[i]);
        }
        return newSet;
      });

      batchIndex++;
    }, 50);

    return () => {
      clearInterval(interval);
      // Clean up timeouts on unmount
      Object.values(hoverTimeoutsRef.current).forEach((timeout) =>
        clearTimeout(timeout),
      );
      clearTimeout(transcriptTimerRef.current);
    };
  }, [selectedGuest]);

  // Character offset in an item's title at which it stops fitting on `lineTop`.
  // Binary search works because "the text up to N still ends on this line" only
  // flips once — at the wrap.
  const wrapOffsetFor = (index, lineTop, tolerance) => {
    const node = titleRefs.current[index]?.firstChild;
    if (!node || node.nodeType !== Node.TEXT_NODE) return 0;
    const text = node.textContent;
    const range = document.createRange();

    let lo = 0;
    let hi = text.length;
    let fits = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      range.setStart(node, 0);
      range.setEnd(node, mid);
      const rects = range.getClientRects();
      const last = rects[rects.length - 1];
      if (!last || Math.abs(last.top - lineTop) <= tolerance) {
        fits = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    // Cut on the word boundary the browser actually broke at
    const cut = text.lastIndexOf(" ", fits);
    return cut > 0 ? cut : 0;
  };

  // Where to put the transcript so the clicked item's visual line survives
  // intact. Items are inline and wrap, so this is measured — getClientRects
  // gives one box per line box. An item straddling the end of the line gets its
  // title cut at the wrap, keeping the layout identical to the collapsed state.
  const computePlacement = (index) => {
    const rects = itemRefs.current[index]?.getClientRects();
    if (!rects?.length) return { anchor: index, split: null, at: 0 };
    const line = rects[rects.length - 1];
    const tolerance = Math.max(8, line.height * 0.5);
    const onLine = (rect) => Math.abs(rect.top - line.top) <= tolerance;

    let anchor = index;
    for (let i = index + 1; i < selectedGuest.tracklist.length; i++) {
      const next = itemRefs.current[i]?.getClientRects();
      if (!next?.length) break;
      if (!onLine(next[0])) break; // starts on a later line — the line ends here
      if (!onLine(next[next.length - 1])) {
        // Straddles the wrap: split it so its first half stays on this line
        const at = wrapOffsetFor(i, line.top, tolerance);
        if (at > 0) return { anchor: i, split: i, at };
        break;
      }
      anchor = i;
    }
    return { anchor, split: null, at: 0 };
  };

  // Measure once the DOM is unsplit but before the browser paints, so the
  // natural line layout is what gets measured and no intermediate frame shows
  useLayoutEffect(() => {
    if (mountedTranscript === null || placement !== null) return;
    setPlacement(computePlacement(mountedTranscript));
  }, [mountedTranscript, placement]); // eslint-disable-line react-hooks/exhaustive-deps

  // A resize rewraps every line, so the measured placement is stale — drop it
  // and let the effect above measure again
  useEffect(() => {
    const onResize = () => setPlacement(null);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── TEMPORARY cursor diagnostic ────────────────────────────────────────
  // Logs only when something changes, so the console shows the exact moment
  // the pointer flips rather than a flood of mousemove noise.
  useEffect(() => {
    if (!DEBUG_CURSOR) return;
    let last = "";
    let lastRenders = debugRenders;

    const onMove = (e) => {
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      if (!hit || !hit.closest(".tracklist-content")) return;

      const item = hit.closest(".track-item");
      // Stamp each element once — a uid that changes means React replaced the
      // DOM node; a uid that persists means the node is stable.
      if (item && !item.dataset.dbgUid) item.dataset.dbgUid = String(++debugNodeSeq);

      const snapshot = [
        item?.dataset.dbgUid ?? "none",
        item?.classList.contains("track-item-subject") ?? false,
        getComputedStyle(hit).cursor,
      ].join("|");
      if (snapshot === last) return;
      last = snapshot;

      console.log("[cursor]", {
        hitElement: `${hit.tagName.toLowerCase()}.${hit.className || "(no class)"}`,
        hitComputedCursor: getComputedStyle(hit).cursor,
        insideTrackItem: !!item,
        itemNodeId: item?.dataset.dbgUid ?? "—",
        itemHasSubjectClass: item?.classList.contains("track-item-subject") ?? false,
        itemComputedCursor: item ? getComputedStyle(item).cursor : "—",
        rendersSinceLastChange: debugRenders - lastRenders,
        totalRenders: debugRenders,
      });
      lastRenders = debugRenders;
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Mount collapsed, then expand on the next frame so the transition runs.
  // Closing reverses it and unmounts once the collapse has finished.
  const toggleTranscript = (index) => {
    clearTimeout(transcriptTimerRef.current);
    const prev = selectedSubject;

    // Same subject — collapse it, and hand its colours back to the hover
    // system unless the pointer is still sitting on it
    if (prev === index) {
      setSelectedSubject(null);
      setTranscriptOpen(false);
      transcriptTimerRef.current = setTimeout(
        () => setMountedTranscript(null),
        TRANSCRIPT_MS,
      );
      if (!activeHovers.has(index)) {
        clearTimeout(hoverTimeoutsRef.current[index]);
        fadeOutColors(index);
      }
      return;
    }

    // The previously open subject is no longer selected — let its colours go
    if (prev !== null && !activeHovers.has(prev)) {
      clearTimeout(hoverTimeoutsRef.current[prev]);
      fadeOutColors(prev);
    }

    // The open subject is marked by its colours, so make sure it has some —
    // it may never have been hovered (touch), or may be mid fade-out
    clearTimeout(hoverTimeoutsRef.current[index]);
    delete hoverTimeoutsRef.current[index];
    setHoverColors((current) => {
      const existing = current[index];
      if (existing && existing.backgroundColor !== "transparent") return current;
      return { ...current, [index]: generateRandomColors() };
    });

    // Highlight it now — not when the panel eventually mounts
    setSelectedSubject(index);

    // Opening the transcript collapsed, then expanding it on the next frame, is
    // what makes the transition run. Placement is left for the layout effect:
    // it has to be measured against the *natural* layout, and an existing one
    // distorts it — the split item's rects no longer span the wrap.
    const openAt = (subject) => {
      setPlacement(null);
      setMountedTranscript(subject);
      setTranscriptOpen(false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setTranscriptOpen(true)),
      );
    };

    // Switching from an open transcript always collapses it where it is first,
    // then expands the new one once that has finished — same line or not.
    if (mountedTranscript !== null && transcriptOpen) {
      setTranscriptOpen(false);
      transcriptTimerRef.current = setTimeout(
        () => openAt(index),
        TRANSCRIPT_MS,
      );
      return;
    }

    openAt(index);
  };

  // Generate random colors for hover
  const generateRandomColors = () => {
    const bgColors = [
      // Light pinks
      "rgba(255, 206, 223)", // soft pink
      "rgba(255, 182, 193)", // light pink
      "rgba(255, 160, 180)", // rose pink
      "rgba(255, 140, 160)", // coral pink
      "rgba(255, 120, 150)", // hot pink
      "rgba(255, 170, 200)", // bubblegum
      "rgba(255, 190, 210)", // blush
      "rgba(250, 175, 190)", // dusty rose
      "rgba(255, 150, 170)", // salmon pink
      "rgba(255, 200, 215)", // baby pink
      // Complementary to 255,0,90 (magenta-pink)
      "rgba(255, 0, 90)", // the magenta pink itself
      "rgba(255, 50, 120)", // bright pink
      "rgba(255, 80, 140)", // vivid pink
      "rgba(0, 255, 165)", // spring green (complement)
      "rgba(0, 230, 150)", // mint (complement)
      "rgba(0, 200, 130)", // sea green (complement)
      "rgba(80, 255, 180)", // light spring (complement)
      "rgba(0, 180, 180)", // teal (near complement)
      "rgba(0, 210, 210)", // cyan teal
      "rgba(255, 220, 100)", // golden yellow (triadic)
      "rgba(100, 200, 255)", // sky blue (split complement)
      // Dark colors
      "rgba(30, 30, 40)", // charcoal
      "rgba(45, 25, 60)", // deep purple
      "rgba(20, 40, 60)", // midnight blue
      "rgba(60, 25, 35)", // burgundy
      "rgba(25, 50, 45)", // forest green
      "rgba(50, 35, 25)", // dark brown
      "rgba(40, 20, 50)", // grape
      "rgba(55, 30, 45)", // plum
      "rgba(25, 35, 55)", // navy
      "rgba(45, 45, 45)", // dark grey
      "rgba(70, 20, 40)", // wine
      "rgba(20, 45, 35)", // dark teal
    ];

    // Define which text colors work well with each background
    const colorPairs = {
      // Light pinks - varied text colors
      "rgba(255, 206, 223)": [
        "#FFFFFF",
        "#000000",
        "#1a5c4c",
        "#2d3a66",
        "#6b2d5b",
      ],
      "rgba(255, 182, 193)": [
        "#FFFFFF",
        "#000000",
        "#0d6655",
        "#3d2d66",
        "#1a3d5c",
      ],
      "rgba(255, 160, 180)": [
        "#FFFFFF",
        "#000000",
        "#006655",
        "#2d4d66",
        "#4d1a4d",
      ],
      "rgba(255, 140, 160)": ["#FFFFFF", "#000000", "#007766", "#1a3d5c"],
      "rgba(255, 120, 150)": ["#FFFFFF", "#004d40", "#1a3366"],
      "rgba(255, 170, 200)": ["#FFFFFF", "#000000", "#0d6655", "#3d2d66"],
      "rgba(255, 190, 210)": ["#FFFFFF", "#000000", "#1a5c4c", "#2d3a66"],
      "rgba(250, 175, 190)": ["#FFFFFF", "#000000", "#006655", "#3d2d5c"],
      "rgba(255, 150, 170)": ["#FFFFFF", "#000000", "#007766", "#2d4d66"],
      "rgba(255, 200, 215)": ["#FFFFFF", "#000000", "#1a5c4c", "#4d2d5c"],
      // Complementary colors for 255,0,90
      "rgba(255, 0, 90)": ["#FFFFFF", "#00ffaa", "#000000", "#ccff00"],
      "rgba(255, 50, 120)": ["#FFFFFF", "#00e6aa", "#000000"],
      "rgba(255, 80, 140)": ["#FFFFFF", "#000000", "#00cc99"],
      "rgba(0, 255, 165)": ["#000000", "#FFFFFF", "#660033", "#330066"],
      "rgba(0, 230, 150)": ["#000000", "#FFFFFF", "#4d0033", "#1a0033"],
      "rgba(0, 200, 130)": ["#FFFFFF", "#000000", "#660044"],
      "rgba(80, 255, 180)": ["#000000", "#4d0033", "#1a1a4d"],
      "rgba(0, 180, 180)": ["#FFFFFF", "#000000", "#660033"],
      "rgba(0, 210, 210)": ["#000000", "#FFFFFF", "#4d0033"],
      "rgba(255, 220, 100)": ["#000000", "#4d0033", "#003366"],
      "rgba(100, 200, 255)": ["#000000", "#FFFFFF", "#660033", "#4d1a00"],
      // Dark colors - light/bright text
      "rgba(30, 30, 40)": ["#FFFFFF", "#FFD700", "#00FFFF", "#FF69B4"],
      "rgba(45, 25, 60)": ["#FFFFFF", "#E6E6FA", "#FFB6C1", "#98FB98"],
      "rgba(20, 40, 60)": ["#FFFFFF", "#87CEEB", "#FFD700", "#FF6B6B"],
      "rgba(60, 25, 35)": ["#FFFFFF", "#FFD700", "#FFC0CB", "#98FB98"],
      "rgba(25, 50, 45)": ["#FFFFFF", "#98FB98", "#FFD700", "#FFA07A"],
      "rgba(50, 35, 25)": ["#FFFFFF", "#FFD700", "#FFA07A", "#87CEEB"],
      "rgba(40, 20, 50)": ["#FFFFFF", "#E6E6FA", "#FFB6C1", "#00FFFF"],
      "rgba(55, 30, 45)": ["#FFFFFF", "#FFB6C1", "#E6E6FA", "#98FB98"],
      "rgba(25, 35, 55)": ["#FFFFFF", "#87CEEB", "#FFD700", "#FF69B4"],
      "rgba(45, 45, 45)": ["#FFFFFF", "#00FFFF", "#FFD700", "#FF69B4"],
      "rgba(70, 20, 40)": ["#FFFFFF", "#FFD700", "#FFC0CB", "#87CEEB"],
      "rgba(20, 45, 35)": ["#FFFFFF", "#00FFFF", "#98FB98", "#FFD700"],
    };

    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
    const validTextColors = colorPairs[randomBg] || ["#FFFFFF", "#000000"];
    const randomText =
      validTextColors[Math.floor(Math.random() * validTextColors.length)];

    return { backgroundColor: randomBg, color: randomText };
  };

  const handleMouseEnter = (index) => {
    // Clear any pending timeout for this index
    if (hoverTimeoutsRef.current[index]) {
      clearTimeout(hoverTimeoutsRef.current[index]);
      delete hoverTimeoutsRef.current[index];
    }

    // Mark as actively hovered (instant transition). Still tracked for the
    // selected subject, so closing it while the pointer is on it hands the
    // colours back to hover rather than fading them out under the cursor.
    setActiveHovers((prev) => new Set(prev).add(index));

    // The selected subject already owns its colours — hovering must not reroll
    // them, or the highlight would change every time the pointer crossed it
    if (selectedSubject === index) return;

    const colors = generateRandomColors();
    setHoverColors((prev) => ({
      ...prev,
      [index]: {
        backgroundColor: colors.backgroundColor,
        color: colors.color,
      },
    }));
  };

  // Transition to transparent (this triggers the CSS fade out), then drop the
  // entry once the fade has finished
  const fadeOutColors = (index) => {
    const itemSection = getItemSection(index);
    const isDark = shouldBeDark(itemSection);
    const defaultColor = isPlaying ? (isDark ? "#434a47" : "#9a9e9c") : "#434a47";
    setHoverColors((prev) => ({
      ...prev,
      [index]: {
        backgroundColor: "transparent",
        color: defaultColor,
      },
    }));

    const cleanupTimeout = setTimeout(() => {
      setHoverColors((prev) => {
        const newColors = { ...prev };
        delete newColors[index];
        return newColors;
      });
      delete hoverTimeoutsRef.current[index];
    }, 500);

    hoverTimeoutsRef.current[index] = cleanupTimeout;
  };

  const handleMouseLeave = (index) => {
    // Remove from active hovers immediately so CSS transition can work
    setActiveHovers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });

    // The open subject keeps its colours — they are what marks it as selected
    if (selectedSubject === index) return;

    // First, wait for linger period (300ms delay from CSS)
    const lingerTimeout = setTimeout(() => fadeOutColors(index), 300);
    hoverTimeoutsRef.current[index] = lingerTimeout;
  };

  if (!selectedGuest) return null;

  // An explicit label from Sanity wins; otherwise fall back to the artist's
  // initials so transcripts are labelled without any setup
  const guestInitials =
    selectedGuest.transcriptInitials?.trim() || initialsFor(selectedGuest.title2);

  // Build a map from array index -> track number (excluding section breaks)
  const trackNumberMap = (() => {
    const map = {};
    let count = 1;
    selectedGuest.tracklist.forEach((track, i) => {
      const isSectionBreak =
        track.title === "RADIO (a)" ||
        track.title === "PROJECT" ||
        track.title === "RADIO (b)";
      if (!isSectionBreak) {
        map[i] = count;
        count++;
      }
    });
    return map;
  })();

  return (
    <div
      className={`tracklist-container ${
        isMobile ? "tracklist-container-mobile" : "tracklist-container-desktop"
      }`}
    >
      <div className="tracklist-content">
        {selectedGuest.tracklist.map((mixTrack, index) => {
          const isSectionBreak =
            mixTrack.title === "RADIO (a)" ||
            mixTrack.title === "PROJECT" ||
            mixTrack.title === "RADIO (b)";

          const isVisible = visibleIndices.has(index);
          const isDark = isPlaying && shouldBeDark(getItemSection(index));
          // Greyed out items (playing but not dark) should not have hover effects
          const isGreyedOut = isPlaying && !isDark;

          // Alternating font for PROJECT section
          const itemSection = getItemSection(index);
          const projectIdx =
            itemSection === "+" ? getProjectSectionIndex(index) : -1;
          const isProjectItem =
            itemSection === "+" && !isSectionBreak && projectIdx >= 0;
          const projectFont = isProjectItem
            ? projectIdx % 2 === 0
              ? "NeueHaasDisplayLight"
              : "NeueHaasDisplayRoman"
            : undefined;

          // Only PROJECT-section items are interview subjects
          const isSubject = isProjectItem;
          // The clicked subject keeps its colours; the transcript itself is
          // rendered after the last item on that subject's line
          const isSelected = isSubject && selectedSubject === index;
          const isPlaced = mountedTranscript !== null && placement?.anchor === index;
          // This item straddles the end of the line — its title is cut so the
          // first half can stay up there and the transcript slot in below
          const splitAt = isPlaced && placement.split === index ? placement.at : 0;
          const showTranscript = isPlaced;
          const isOpen = showTranscript && transcriptOpen;

          // The open subject shows its colours even where hover can't reach —
          // on touch, and in sections greyed out by playback — since that is
          // what marks it as selected
          const colorsAllowed =
            (!isMobile && !isGreyedOut && !isSectionBreak) || isSelected;
          const hasColors = colorsAllowed && hoverColors[index];
          const isActivelyHovered =
            !isMobile &&
            !isGreyedOut &&
            !isSectionBreak &&
            activeHovers.has(index);

          const displayTitle =
            mixTrack.title === "RADIO (a)" ||
            mixTrack.title === "PROJECT" ||
            mixTrack.title === "RADIO (b)"
              ? ""
              : mixTrack.title;

          // `half` is null for a whole item, or "head"/"tail" when the title is
          // cut across the transcript. Only the head keeps the track number,
          // only the tail keeps the artist — together they read as one item.
          const renderItem = (half) => {
            const titleText =
              half === "head"
                ? displayTitle.slice(0, splitAt)
                : half === "tail"
                  ? displayTitle.slice(splitAt + 1)
                  : displayTitle;

            // Section breaks carry no title and no artist — they exist purely
            // for the line break. Rendering the item span anyway left an empty
            // box at the start of every section, 5px wide off the artist's
            // padding-right.
            if (isSectionBreak) {
              return index > 0 ? (
                <span className="tracklist-item-wrapper">
                  <br />
                  <br />
                </span>
              ) : null;
            }

            return (
            <span
              className={
                isVisible
                  ? "tracklist-item-wrapper"
                  : "tracklist-item-wrapper tracklist-item-wrapper-hidden"
              }
            >
              <span
                ref={
                  half === "tail"
                    ? undefined
                    : (el) => {
                        itemRefs.current[index] = el;
                      }
                }
                className={`track-item ${
                  isSubject ? "track-item-subject" : ""
                } ${isActivelyHovered ? "track-item-hovered" : ""} ${
                  !hasColors
                    ? isPlaying
                      ? isDark
                        ? "track-item-default-color"
                        : "track-item-default-color-playing"
                      : "track-item-default-color"
                    : ""
                }`}
                onMouseEnter={
                  !isMobile && !isGreyedOut
                    ? () => handleMouseEnter(index)
                    : undefined
                }
                onMouseLeave={
                  !isMobile && !isGreyedOut
                    ? () => handleMouseLeave(index)
                    : undefined
                }
                onClick={isSubject ? () => toggleTranscript(index) : undefined}
                style={{
                  ...(colorsAllowed ? hoverColors[index] : {}),
                  ...(projectFont && { fontFamily: projectFont }),
                }}
              >
                {half !== "tail" && (
                  <span className="track-number">{trackNumberMap[index]}</span>
                )}

                <span
                  ref={
                    half === "tail"
                      ? undefined
                      : (el) => {
                          titleRefs.current[index] = el;
                        }
                  }
                  className="track-title"
                >
                  {titleText}
                  {/* Separator before the artist — omitted when there is no
                      title, or section breaks would each open with a stray
                      space rendered at the 0.5em section-break size */}
                  {titleText ? " " : ""}
                </span>
                {half !== "head" && (
                  <span
                    className="track-artist"
                    style={projectFont ? { fontFamily: projectFont } : undefined}
                  >
                    {mixTrack.artist}
                  </span>
                )}
              </span>
            </span>
            );
          };

          return (
            <React.Fragment key={index}>
            {renderItem(splitAt > 0 ? "head" : null)}

            {/* Block-level, so it breaks the inline tracklist flow — dropping
                in at the end of the clicked subject's visual line */}
            {showTranscript && (
              <span
                className={`track-transcript ${
                  isOpen ? "track-transcript-open" : ""
                }`}
              >
                <span className="track-transcript-inner">
                  <span className="track-transcript-body">
                    {transcriptFor(
                      selectedGuest.tracklist[mountedTranscript],
                      mountedTranscript,
                      guestInitials,
                    ).map((turn) => (
                      <span className="track-transcript-line" key={turn.key}>
                        <span className="track-transcript-speaker">
                          {turn.speaker}
                        </span>
                        <span className="track-transcript-text">
                          {renderText(turn.text)}
                        </span>
                      </span>
                    ))}
                  </span>
                </span>
              </span>
            )}

            {/* Remainder of a title that was cut across the transcript */}
            {splitAt > 0 && renderItem("tail")}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// The App root drives a cursor-follower from a requestAnimationFrame lerp loop,
// so it re-renders every frame for the life of the page. Without this the whole
// tracklist was rebuilt ~60x a second, and the browser kept re-running its
// hit-test against churning DOM — which is why the pointer cursor showed on
// mouseenter and then reverted on the next mouse move. All four props are
// stable between real changes (selectedGuest is a reference from context).
export const Tracklist = React.memo(TracklistInner);
