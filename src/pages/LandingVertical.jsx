import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { djs as items } from "./items";
import { GridContainer, PhotoContainer, CursorTitle } from "../styles";
import { CustomCursor } from "../components/ui/CustomCursor";
import { useNavigate, useLocation } from "react-router-dom";
import "./LandingVertical.css";

export const LandingVertical = ({ isMobile }) => {
  const flexContainer = useRef(null);
  const [hoveredGuest, setHoveredGuest] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  // const itemRefs = useRef([]); // Not used - refs never set
  // const [hoveredIndex, setHoveredIndex] = useState(null); // Not used
  // const [isHoveringContainer, setIsHoveringContainer] = useState(false); // Not used
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (item.dontShow === true) return false;
        if (item.type === "mix" || item.type === "radiogram") return true;
        return false;
      })
      .reverse();
  }, []);

  // Prevent body scroll when component is mounted
  useEffect(() => {
    // Store original body overflow
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    // Prevent body scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Restore on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

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
  }, []); // Run only on mount

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

      // Quick estimate based on scroll position and gap
      const estimatedIndex = Math.round(
        container.scrollLeft / (items[0]?.offsetWidth + 150 || 300)
      );

      // Only check nearby items (±2) for accuracy
      const startCheck = Math.max(0, estimatedIndex - 2);
      const endCheck = Math.min(items.length - 1, estimatedIndex + 2);

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
          artist: "RADIO Project • " + guest?.title2,
          album: "RADIO Project",
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
    [navigate]
  );

  // Remove focusedIndex from dependency array to prevent component recreation
  const ImageItem = useCallback(
    ({ guest, isFocused }) => {
      // Handlers defined inline to avoid re-creating them
      const handleMouseEnter = () => {
        if (!isMobile) {
          setHoveredGuest(guest);
        }
      };

      const handleMouseLeave = () => {
        if (!isMobile) {
          setHoveredGuest(null);
        }
      };

      // Create props object conditionally to avoid mouse events on mobile
      const imageProps = {
        src: guest.src,
        alt: guest.title,
        className: `image landing-vertical-image ${
          isFocused
            ? "landing-vertical-image-focused"
            : "landing-vertical-image-unfocused"
        }`,
        onClick: () => handleItemClick(guest),
        loading: "lazy", // Lazy load images
      };

      // Only add mouse events on desktop to prevent double-tap on mobile
      if (!isMobile) {
        imageProps.onMouseEnter = handleMouseEnter;
        imageProps.onMouseLeave = handleMouseLeave;
      }

      return (
        <div className="landing-vertical-image-container">
          <img {...imageProps} />
        </div>
      );
    },
    [isMobile, handleItemClick] // Removed focusedIndex
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

      {/* Vertical scrolling type indicator */}
      <div className="vertical-indicator-container">
        <div
          className="vertical-indicator-wrapper"
          style={{
            "--focused-index-offset": `${focusedIndex * 350}px`,
          }}
        >
          {filteredItems.map((item, index) => {
            const isFocused = index === focusedIndex;
            return (
              <div key={index} className="vertical-indicator-item">
                {/* Line above text (except first item) */}
                {index > 0 && (
                  <div className="vertical-indicator-line vertical-indicator-line-top" />
                )}

                {/* Text content */}
                <div
                  className={`vertical-indicator-text ${
                    isFocused
                      ? "vertical-indicator-text-focused"
                      : "vertical-indicator-text-unfocused"
                  } ${
                    isFocused && !isMobile
                      ? "vertical-indicator-text-focused-desktop"
                      : ""
                  } ${
                    isMobile
                      ? "vertical-indicator-text-mobile"
                      : "vertical-indicator-text-desktop"
                  }`}
                >
                  {/* Release date superscript (mm/yy) */}
                  {item.releaseDate && (
                    <span className="release-date-superscript">
                      {item.releaseDate.split("/").slice(1).join("/")}
                    </span>
                  )}
                  {isMobile
                    ? `${item.title?.replaceAll(
                        " ",
                        "_\u200B"
                      )}_\u200Bby_\u200B${item.title2?.replaceAll(
                        " ",
                        "_\u200B"
                      )}_\u200B/_\u200B[${
                        item.type === "mix" ? "transmission" : "radiogram"
                      }]`
                    : `${(item.type === "mix"
                        ? item.genre
                        : item.tag
                      )?.replaceAll(" ", "_")}_/_[${
                        item.type === "mix" ? "transmission" : "radiogram"
                      }]`}
                </div>

                {/* Line below text (except last item) */}
                {index < filteredItems.length - 1 && (
                  <div className="vertical-indicator-line vertical-indicator-line-bottom" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="landing-vertical-container total-container">
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
                key={i}
                className={`landing-vertical-item-wrapper ${
                  isMobile ? "landing-vertical-item-wrapper-mobile" : ""
                }`}
              >
                <ImageItem guest={guest} isFocused={i === focusedIndex} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
