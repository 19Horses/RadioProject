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
    sizes: isMobile ? "45vh" : "60vh",
    className: `image landing-vertical-image ${
      isFocused
        ? "landing-vertical-image-focused"
        : "landing-vertical-image-unfocused"
    }`,
    ...(!isMobile && {
      onMouseEnter: () => onHoverChange(guest),
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
        style={{ opacity: loaded ? focusOpacity * SYMBOL_OPACITY : 0 }}
      >
        {guest.type === "mix" ? "♬" : "⚖"}
      </span>
    </div>
  );
});

export const LandingVertical = ({ isMobile, gridView }) => {
  const items = useItems();
  const flexContainer = useRef(null);
  const [hoveredGuest, setHoveredGuest] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  // const itemRefs = useRef([]); // Not used - refs never set
  // const [hoveredIndex, setHoveredIndex] = useState(null); // Not used
  // const [isHoveringContainer, setIsHoveringContainer] = useState(false); // Not used
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeView, setActiveView] = useState(gridView);
  const [viewVisible, setViewVisible] = useState(true);

  useEffect(() => {
    if (gridView === activeView) return;
    setViewVisible(false);
    const t = setTimeout(() => {
      setActiveView(gridView);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setViewVisible(true)),
      );
    }, 250);
    return () => clearTimeout(t);
  }, [gridView, activeView]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (item.dontShow === true) return false;
        if (item.type === "mix" || item.type === "radiogram") return true;
        return false;
      })
      .reverse();
  }, [items]);

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

  // Track which item is currently centered (throttled for performance)
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
  }, [isMobile]);

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
    (guest) => {
      if (!isMobile) setHoveredGuest(guest);
    },
    [isMobile],
  );

  return (
    <>
      {hoveredGuest && !isMobile && (
        <CustomCursor
          hoveredGuest={hoveredGuest}
          isLeft={false}
          hovered={true}
          dimmed={hoveredGuest !== filteredItems[focusedIndex]}
        />
      )}

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
    </>
  );
};
