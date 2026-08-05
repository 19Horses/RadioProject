import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useItems } from "../ItemsContext";
import { GridContainer, PhotoContainer, CursorTitle } from "../styles";
import { CustomCursor } from "../components/ui/CustomCursor";
import { useNavigate, useLocation } from "react-router-dom";
import {
  imageAspectRatio,
  sanityImage,
  sanitySrcSet,
} from "../utils/sanityImage";
import "./LandingVertical.css";

// Items either side of the centred one are on screen at load, so they shouldn't
// wait on the lazy-loading heuristic.
const EAGER_COUNT = 3;

// The grid shows a whole screenful at once, so more of it is above the fold
// than in the carousel — roughly the first two rows.
const GRID_EAGER_COUNT = 8;

// Crossfade timings. The grid's cells carry their own fade, staggered per cell,
// so swapping views has to wait out the last cell's delay as well as its fade —
// these have to stay in step with the matching values in LandingVertical.css.
const VIEW_FADE_MS = 250;
const GRID_ITEM_FADE_MS = 350;
const GRID_STAGGER_MS = 7;

// The mix/article chip is a label, not the subject — it sits back from the
// artwork rather than competing with it. Multiplied into the item's own
// focused/unfocused opacity so it still dims along with its image.
const SYMBOL_OPACITY = 1;

/**
 * One cover in the carousel, fading in once its bitmap is actually decoded.
 *
 * Lives at module scope (rather than inside the page) so that a re-render of
 * the carousel — on scroll, on focus change — reconciles against the same
 * component type and leaves loaded images alone instead of remounting them.
 */
const LandingImage = React.memo(function LandingImage({
  guest,
  isFocused,
  isMobile,
  priority,
  isGrid,
  onClick,
  onHoverChange,
}) {
  const srcArray = useMemo(
    () => (Array.isArray(guest.src) ? guest.src : guest.src ? [guest.src] : []),
    [guest.src],
  );
  const hasMultipleSrcs = srcArray.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!hasMultipleSrcs || !loaded) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % srcArray.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [hasMultipleSrcs, srcArray.length, loaded]);

  // An image served from cache can finish before React attaches onLoad, so the
  // ref checks for that case rather than waiting on an event that already fired.
  const captureLoaded = useCallback((node) => {
    if (node?.complete) setLoaded(true);
  }, []);

  const focusOpacity = isFocused ? 1 : 0.4;
  const aspect = imageAspectRatio(srcArray[0]);

  const sharedProps = {
    alt: guest.title,
    onClick: () => onClick(guest),
    decoding: "async",
    loading: priority ? "eager" : "lazy",
    fetchPriority: priority ? "high" : "auto",
    // A grid cell is a quarter of the row rather than most of the viewport
    // height, so the browser would fetch far larger files than it can show if
    // the carousel's hint carried over.
    sizes: isGrid
      ? isMobile
        ? "50vw"
        : "23vw"
      : isMobile
        ? "45vh"
        : "60vh",
    className: `image landing-vertical-image ${
      isFocused
        ? "landing-vertical-image-focused"
        : "landing-vertical-image-unfocused"
    }`,
    ...(!isMobile && {
      // The element goes along so the page can see which half of the viewport
      // this item sits in, and put the cursor's label on the roomier side.
      onMouseEnter: (event) => onHoverChange(guest, event.currentTarget),
      onMouseLeave: () => onHoverChange(null),
    }),
  };

  return (
    <div
      className="landing-vertical-image-container"
      data-loaded={loaded ? "true" : "false"}
      style={aspect ? { "--img-aspect": aspect } : undefined}
    >
      {hasMultipleSrcs ? (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {/* Later slides are pointless until the first one is on screen. */}
          {srcArray
            .slice(0, loaded ? srcArray.length : 1)
            .map((imgSrc, idx) => (
              <img
                key={imgSrc}
                {...sharedProps}
                ref={idx === 0 ? captureLoaded : undefined}
                onLoad={idx === 0 ? () => setLoaded(true) : undefined}
                src={sanityImage(imgSrc, { width: 1200 })}
                srcSet={sanitySrcSet(imgSrc)}
                style={{
                  position: "absolute",
                  inset: 0,
                  transition: "opacity 1s ease",
                  opacity: loaded
                    ? (activeIndex === idx ? 1 : 0) * focusOpacity
                    : 0,
                }}
              />
            ))}
          {/* Invisible placeholder to maintain container size */}
          <img
            src={sanityImage(srcArray[0], { width: 400 })}
            alt=""
            aria-hidden
            className={sharedProps.className}
            style={{ visibility: "hidden" }}
          />
        </div>
      ) : (
        <img
          {...sharedProps}
          ref={captureLoaded}
          onLoad={() => setLoaded(true)}
          src={sanityImage(srcArray[0], { width: 1200 })}
          srcSet={sanitySrcSet(srcArray[0])}
          style={{ opacity: loaded ? focusOpacity : 0 }}
        />
      )}

      {/* Marks what the item is — a mix or an article. Sits on the artwork
          rather than in the cursor, so every item is labelled at once instead
          of only the one under the pointer. Transparent to the pointer: the
          image beneath owns the hover that drives the cursor, and a badge
          catching that would read as leaving the item. */}
      <span
        className="landing-vertical-symbol"
        aria-hidden
        style={{
          opacity: loaded ? focusOpacity * SYMBOL_OPACITY : 0,
          backgroundColor: guest.type === "mix" ? "#ff005a" : "#5ac588",
        }}
      ></span>
    </div>
  );
});

export const LandingVertical = ({ isMobile, gridView }) => {
  const items = useItems();
  const flexContainer = useRef(null);
  const [hoveredGuest, setHoveredGuest] = useState();
  const [hoverOnRight, setHoverOnRight] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // const itemRefs = useRef([]); // Not used - refs never set
  // const [hoveredIndex, setHoveredIndex] = useState(null); // Not used
  // const [isHoveringContainer, setIsHoveringContainer] = useState(false); // Not used
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeView, setActiveView] = useState(gridView);
  const [viewVisible, setViewVisible] = useState(true);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (item.dontShow === true) return false;
        if (item.type === "mix" || item.type === "radiogram") return true;
        return false;
      })
      .reverse();
  }, [items]);

  // Leaving the grid runs the entrance in reverse — each cell fades on its own
  // delay — so the outgoing view has to stay mounted for the whole stagger,
  // not just one blanket fade. Declared after filteredItems, which the timing
  // below reads.
  const gridLeaving = activeView && !gridView;

  useEffect(() => {
    if (gridView === activeView) return;
    setViewVisible(false);
    const leaveMs = activeView
      ? GRID_ITEM_FADE_MS +
        Math.max(0, filteredItems.length - 1) * GRID_STAGGER_MS
      : VIEW_FADE_MS;
    const t = setTimeout(() => {
      setActiveView(gridView);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setViewVisible(true)),
      );
    }, leaveMs);
    return () => clearTimeout(t);
  }, [gridView, activeView, filteredItems.length]);

  // Prevent body scroll in carousel mode; allow it in grid mode
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    if (gridView) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [gridView]);

  // Center first item on initial mount
  useEffect(() => {
    const centerFirstItem = () => {
      if (flexContainer.current) {
        const container = flexContainer.current;
        const firstItem = container.children[0];
        if (firstItem) {
          // Calculate scroll position to center the first item
          const itemLeft = firstItem.offsetLeft;
          const itemWidth = firstItem.offsetWidth;
          const containerWidth = container.clientWidth;
          const scrollTo = itemLeft + itemWidth / 2 - containerWidth / 2;

          container.scrollLeft = Math.max(0, scrollTo);
          setFocusedIndex(0);
        }
      }
    };

    // Center on mount with multiple attempts to ensure it works
    setTimeout(centerFirstItem, 0);
    setTimeout(centerFirstItem, 100);
    setTimeout(centerFirstItem, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount1

  // Reset when navigating to archive
  useEffect(() => {
    if (location.pathname === "/archive") {
      setFocusedIndex(0);

      // Center first item after navigation
      const centerFirstItem = () => {
        if (flexContainer.current) {
          const container = flexContainer.current;
          const firstItem = container.children[0];
          if (firstItem) {
            const itemLeft = firstItem.offsetLeft;
            const itemWidth = firstItem.offsetWidth;
            const containerWidth = container.clientWidth;
            const scrollTo = itemLeft + itemWidth / 2 - containerWidth / 2;

            container.scrollLeft = Math.max(0, scrollTo);
          }
        }
      };

      setTimeout(centerFirstItem, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // Trigger when route changes

  // Keyboard navigation: arrow keys to navigate between items
  useEffect(() => {
    const scrollToIndex = (index) => {
      if (flexContainer.current) {
        const container = flexContainer.current;
        const item = container.children[index];
        if (item) {
          const itemLeft = item.offsetLeft;
          const itemWidth = item.offsetWidth;
          const containerWidth = container.clientWidth;
          const scrollTo = itemLeft + itemWidth / 2 - containerWidth / 2;

          container.scrollTo({
            left: Math.max(0, scrollTo),
            behavior: "smooth",
          });
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const newIndex = Math.min(prev + 1, filteredItems.length - 1);
          scrollToIndex(newIndex);
          return newIndex;
        });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const newIndex = Math.max(prev - 1, 0);
          scrollToIndex(newIndex);
          return newIndex;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filteredItems.length]);

  // Re-centre when coming back from the grid: the carousel is a fresh element,
  // so it starts at scrollLeft 0, which is not the first item — the track is
  // padded by half the viewport either side.
  useEffect(() => {
    if (activeView) return;
    const centerFirstItem = () => {
      const container = flexContainer.current;
      const firstItem = container?.children[0];
      if (!firstItem) return;
      const scrollTo =
        firstItem.offsetLeft +
        firstItem.offsetWidth / 2 -
        container.clientWidth / 2;
      container.scrollLeft = Math.max(0, scrollTo);
      setFocusedIndex(0);
    };
    const t = setTimeout(centerFirstItem, 0);
    return () => clearTimeout(t);
  }, [activeView]);

  // Track which item is currently centered (throttled for performance).
  // Keyed on the view too: the carousel unmounts in grid mode, so this has to
  // re-attach to the new element when it comes back or focus tracking dies.
  useEffect(() => {
    if (!flexContainer.current) return;

    const container = flexContainer.current;
    let ticking = false;
    let lastKnownIndex = 0;

    const calculateFocusedIndex = () => {
      if (!container) return;

      const scrollPosition = container.scrollLeft + container.clientWidth / 2;
      const items = container.children;

      // Quick estimate based on scroll position and the actual per-item step.
      // Derive the step from real layout so it stays correct with any gap or
      // negative-margin overlap between items.
      const step =
        items.length > 1
          ? items[1].offsetLeft - items[0].offsetLeft
          : items[0]?.offsetWidth || 300;
      const estimatedIndex =
        step > 0 ? Math.round(container.scrollLeft / step) : 0;

      // Only check nearby items (±3) for accuracy
      const startCheck = Math.max(0, estimatedIndex - 3);
      const endCheck = Math.min(items.length - 1, estimatedIndex + 3);

      let currentIndex = estimatedIndex;
      let minDistance = Infinity;

      for (let i = startCheck; i <= endCheck; i++) {
        const item = items[i];
        if (!item) continue;
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(scrollPosition - itemCenter);

        if (distance < minDistance) {
          minDistance = distance;
          currentIndex = i;
        }
      }

      // Only update state if index changed
      if (currentIndex !== lastKnownIndex) {
        lastKnownIndex = currentIndex;
        setFocusedIndex(currentIndex);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(calculateFocusedIndex);
        ticking = true;
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      calculateFocusedIndex(); // Initial calculation
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isMobile, activeView]);

  const handleItemClick = useCallback(
    (guest) => {
      const path =
        guest.type === "mix" ? `/mix/${guest.url}` : `/article/${guest.url}`;

      setIsNavigating(true);
      setTimeout(() => {
        navigate(path);
      }, 300);

      if (guest.type === "mix" && "mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: guest?.title,
          artist: "RADIOproject • " + guest?.title2,
          album: "RADIOproject",
          artwork: [
            {
              src: guest?.ipSrc,
              sizes: "512x512",
              type: "image/png",
            },
          ],
        });
      }
    },
    [navigate],
  );

  const handleHoverChange = useCallback(
    (guest, element) => {
      if (isMobile) return;
      // The cursor trails to the right of the pointer by default, which runs it
      // off the screen on the last column. Only that column flips it to the
      // pointer's left. Detected as "no room for another cell to my right"
      // rather than by counting columns, so the short final row is handled too:
      // its rightmost item is only in column two, and must not flip.
      if (guest && element) {
        const track = element.closest(".landing-grid-container");
        const rect = element.getBoundingClientRect();
        if (track) {
          const style = getComputedStyle(track);
          const trackRight =
            track.getBoundingClientRect().right -
            parseFloat(style.paddingRight || 0);
          const columnStep =
            rect.width + parseFloat(style.columnGap || style.gap || 0);
          setHoverOnRight(trackRight - rect.right < columnStep);
        } else {
          setHoverOnRight(false);
        }
      }
      setHoveredGuest(guest);
    },
    [isMobile],
  );

  return (
    <>
      {hoveredGuest && !isMobile && (
        <CustomCursor
          hoveredGuest={hoveredGuest}
          // Both of these are grid-only. The carousel keeps its original
          // behaviour: the cursor always trails to the right, and dims on
          // anything that isn't the centred item. Neither idea carries over —
          // the grid has no centred item to dim against, and its columns run
          // to the edge of the screen.
          isLeft={activeView ? hoverOnRight : false}
          hovered={true}
          dimmed={
            activeView ? false : hoveredGuest !== filteredItems[focusedIndex]
          }
        />
      )}

      {/* The grid is its own fixed-position layer, so it sits alongside the
          carousel's container rather than inside it — that one clips to the
          viewport and would trap the grid's scrolling.

          It carries no opacity of its own: fading the whole container would
          flatten the per-cell stagger underneath it. The cells own both
          directions, and before the first reveal neither class is set, which is
          what keeps them from flashing in at full strength on mount. */}
      {activeView ? (
        <div
          className={`landing-grid-container ${
            gridLeaving
              ? "landing-grid-leaving"
              : viewVisible
                ? "landing-grid-visible"
                : ""
          }`}
        >
          {filteredItems.map((guest, i) => (
            <div
              key={guest.id || i}
              className="landing-grid-cell"
              style={{ "--i": i }}
            >
              <LandingImage
                guest={guest}
                // Nothing is "focused" in the grid — every cell reads at full
                // strength rather than one being singled out.
                isFocused
                isMobile={isMobile}
                isGrid
                priority={i < GRID_EAGER_COUNT}
                onClick={handleItemClick}
                onHoverChange={handleHoverChange}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="landing-vertical-container total-container"
          style={{
            opacity: viewVisible ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
        >
          <div className="landing-vertical-scroll-wrapper scroll-wrapper">
            <div
              ref={flexContainer}
              className={`landing-vertical-flex-container hide-scrollbar ${
                isMobile
                  ? "landing-vertical-flex-container-mobile"
                  : "landing-vertical-flex-container-desktop"
              }`}
            >
              {filteredItems.map((guest, i) => (
                <div
                  key={guest.id || i}
                  className={`landing-vertical-item-wrapper ${
                    isMobile ? "landing-vertical-item-wrapper-mobile" : ""
                  }`}
                >
                  <LandingImage
                    guest={guest}
                    isFocused={i === focusedIndex}
                    isMobile={isMobile}
                    priority={i < EAGER_COUNT}
                    onClick={handleItemClick}
                    onHoverChange={handleHoverChange}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
