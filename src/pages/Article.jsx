import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Article.css";

import { djs } from "./items";

export const Article = ({
  isMobile,
  isPlaying,
  darkMode,
  setCurrentArticle,
  setScrollPercentage,
}) => {
  const { articleName } = useParams();
  const navigate = useNavigate();

  const articleSelected = djs.find((article) => article.url === articleName && article.type === "radiogram");

  // Redirect to home if item doesn't exist or is not a radiogram/article
  useEffect(() => {
    const item = djs.find((article) => article.url === articleName);
    if (!item || item.type !== "radiogram") {
      navigate("/", { replace: true });
    }
  }, [articleName, navigate]);

  // atTop is set but not used - kept for potential future use
  // eslint-disable-next-line
  const [atTop, setAtTop] = useState(true);
  const [showNextArticle, setShowNextArticle] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [nextArticle, setNextArticle] = useState(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Smooth scroll refs and state
  const scrollContainerRef = useRef(null);
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (articleSelected && setCurrentArticle) {
      setCurrentArticle(articleSelected);
    }
    return () => {
      if (setCurrentArticle) {
        setCurrentArticle(null);
      }
    };
  }, [articleSelected, setCurrentArticle]);

  // const [fadeIn, setFadeIn] = useState(false);
  // const [allowScrollFade, setAllowScrollFade] = useState(false);

  // useEffect(() => {
  //   const fadeTimeout = setTimeout(() => {
  //     setFadeIn(true);
  //     // enable scroll-based fading after fade-in finishes (1s = transition duration)
  //     setTimeout(() => setAllowScrollFade(true), 1000);
  //   }, 50); // initial trigger delay to apply opacity: 0

  //   return () => clearTimeout(fadeTimeout);
  // }, []);

  useEffect(() => {
    // Check scroll position to trigger next article
    const checkScrollPosition = () => {
      if (!isMobile && scrollContainerRef.current) {
        // Use lerped position for smooth detection
        const scrollPercentage =
          (currentScrollRef.current + scrollContainerRef.current.clientHeight) /
          scrollContainerRef.current.scrollHeight;

        if (scrollPercentage >= 0.95) {
          if (!hasTriggered) {
            setShowNextArticle(true);
            setHasTriggered(true);

            // Pick a random article (radiogram only) different from current one
            const otherArticles = djs.filter(
              (article) =>
                article.url !== articleName && article.type === "radiogram"
            );
            if (otherArticles.length > 0) {
              const randomIndex = Math.floor(
                Math.random() * otherArticles.length
              );
              setNextArticle(otherArticles[randomIndex]);
            }
          }
        } else {
          // Slide down when scrolling back up past 95%
          if (animateIn) {
            setAnimateIn(false);
            setHasTriggered(false); // Reset so it can show again when scrolling back down

            // Unmount after slide-down animation completes
            setTimeout(() => {
              setShowNextArticle(false);
            }, 1000); // Match transition duration
          }
        }
      }
    };

    // For mobile, use regular scroll
    const handleMobileScroll = () => {
      if (isMobile) {
        setAtTop(window.scrollY < 100);
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = window.innerHeight;
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;

        // Update scroll percentage for mobile
        if (setScrollPercentage) {
          setScrollPercentage(Math.min(100, Math.max(0, scrollPercent)));
        }

        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

        if (scrollPercentage >= 0.95) {
          if (!hasTriggered) {
            setShowNextArticle(true);
            setHasTriggered(true);
            setIsExpanded(false);

            const otherArticles = djs.filter(
              (article) =>
                article.url !== articleName && article.type === "radiogram"
            );
            if (otherArticles.length > 0) {
              const randomIndex = Math.floor(
                Math.random() * otherArticles.length
              );
              setNextArticle(otherArticles[randomIndex]);
            }
          }
        } else {
          // Slide down when scrolling back up past 95%
          if (animateIn) {
            setAnimateIn(false);
            setHasTriggered(false); // Reset so it can show again when scrolling back down
            setIsExpanded(false);

            // Unmount after slide-down animation completes
            setTimeout(() => {
              setShowNextArticle(false);
            }, 1000); // Match transition duration
          }
        }
      }
    };

    // Check position on desktop during lerp animation
    if (!isMobile) {
      const intervalId = setInterval(checkScrollPosition, 100);
      return () => clearInterval(intervalId);
    } else {
      // Mobile scroll listener
      window.addEventListener("scroll", handleMobileScroll);
      return () => {
        window.removeEventListener("scroll", handleMobileScroll);
      };
    }
  }, [
    articleName,
    hasTriggered,
    isMobile,
    showNextArticle,
    setScrollPercentage,
    animateIn,
  ]);

  // Reset trigger when article changes
  useEffect(() => {
    setHasTriggered(false);
    setShowNextArticle(false);
    setAnimateIn(false);

    // Reset lerped scroll on article change
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      targetScrollRef.current = 0;
      currentScrollRef.current = 0;
    }

    // Reset scroll percentage
    if (setScrollPercentage) {
      setScrollPercentage(0);
    }
  }, [articleName, setScrollPercentage]);

  // Trigger animation after component is rendered
  useEffect(() => {
    if (showNextArticle) {
      // Small delay to ensure element is in DOM before animating
      const timer = setTimeout(() => {
        setAnimateIn(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showNextArticle]);

  // Smooth scroll lerping effect
  useEffect(() => {
    if (isMobile || !scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const lerp = (start, end, factor) => start + (end - start) * factor;
    const scrollSpeed = 0.08; // Adjust for smoother/snappier scroll (0.05-0.15 recommended)
    const wheelMultiplier = 1.5; // Adjust scroll sensitivity

    // Animation loop
    const animateScroll = () => {
      if (scrollContainer) {
        currentScrollRef.current = lerp(
          currentScrollRef.current,
          targetScrollRef.current,
          scrollSpeed
        );

        // Apply the lerped scroll position
        scrollContainer.scrollTop = currentScrollRef.current;

        // Check if we need to continue animating
        if (
          Math.abs(targetScrollRef.current - currentScrollRef.current) > 0.1
        ) {
          animationFrameRef.current = requestAnimationFrame(animateScroll);
        } else {
          // Clear animation frame when scroll stops
          animationFrameRef.current = null;
        }
      }
    };

    // Separate interval for updating scroll percentage to ensure smooth updates
    const updateScrollPercentage = () => {
      if (scrollContainer && setScrollPercentage) {
        const scrollPercent =
          (currentScrollRef.current /
            (scrollContainer.scrollHeight - scrollContainer.clientHeight)) *
          100;
        setScrollPercentage(Math.min(100, Math.max(0, scrollPercent)));
      }
    };

    // Update scroll percentage more frequently
    const scrollPercentInterval = setInterval(updateScrollPercentage, 16); // ~60fps

    // Handle wheel events
    const handleWheel = (e) => {
      e.preventDefault();

      // Calculate new target scroll position
      const delta = e.deltaY * wheelMultiplier;
      const maxScroll =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;

      targetScrollRef.current = Math.max(
        0,
        Math.min(targetScrollRef.current + delta, maxScroll)
      );

      // Start animation if not already running
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      }
    };

    // Add passive: false to allow preventDefault
    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });

    // Initialize current scroll position
    currentScrollRef.current = scrollContainer.scrollTop;
    targetScrollRef.current = scrollContainer.scrollTop;

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearInterval(scrollPercentInterval);
    };
  }, [isMobile, articleSelected, setScrollPercentage]);

  return (
    <div
      className={`article-container ${
        isMobile ? "article-container-mobile" : "article-container-desktop"
      }`}
    >
      {/* Spacer for bookmark on desktop */}
      {!isMobile && <div className="article-spacer" />}

      {/* Article content container */}
      <div
        className={`article-content-container ${
          isMobile
            ? "article-content-container-mobile"
            : "article-content-container-desktop"
        } ${
          isMobile
            ? isPlaying != null
              ? "article-content-container-padding-top-playing"
              : "article-content-container-padding-top-not-playing"
            : ""
        }`}
      >
        {/* Selected Article */}
        {articleSelected != null && !isMobile && (
          <>
            <div
              ref={scrollContainerRef}
              className={`article-scroll-container ${
                isPlaying != null ? "article-scroll-container-playing" : ""
              }`}
            >
              <div className="article-description-wrapper">
                {typeof articleSelected?.description === "function" ? (
                  <articleSelected.description />
                ) : (
                  <p
                    className="article-description-paragraph"
                    dangerouslySetInnerHTML={{
                      __html: articleSelected?.description,
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}
        {articleSelected && isMobile ? (
          <div
            className={`article-content-description__mobile ${
              isPlaying != null
                ? "article-content-description__mobile-playing"
                : "article-content-description__mobile-not-playing"
            }`}
          >
            {typeof articleSelected?.description === "function" ? (
              <articleSelected.description />
            ) : (
              <p
                dangerouslySetInnerHTML={{
                  __html: articleSelected?.description,
                }}
              />
            )}
          </div>
        ) : null}

        {/* Next Article Suggestion Pop-up */}
        {/* {showNextArticle && nextArticle && (
          <div
            style={{
              position: "fixed",
              bottom: animateIn ? "40px" : "-10vh",
              left: "calc(51.5vw + 142px)", // Center within article area (after bookmark)
              transform: "translateX(-50%)",
              width: "350px",
              height: isExpanded ? "80px" : "40px",
              backgroundColor: "white",
              transition: "bottom 1s ease-out, height 1s ease",
              zIndex: 10000,
              cursor: "pointer",
              flexDirection: "column",
            }}
            onClick={() => setIsExpanded(!isExpanded)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "center",
                position: isExpanded ? "relative" : "absolute",
                backgroundColor: "#b1b1b1",
                top: 0,
                left: 0,
                right: 0,
                height: "40px",
                minHeight: "40px",
                maxHeight: "40px",
                flexShrink: 0,
                paddingLeft: "10px",
                zIndex: 2,

                fontFamily: "PPNeueBit-Bold",
                fontSize: "20px",
                boxSizing: "border-box",
              }}
            >
              <div className="icon-blink">another one?</div>
            </div>
            <div
              className="icon-blink"
              style={{
                position: "fixed",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                bottom: 0,
                height: "40px",
                minHeight: "40px",
                maxHeight: "40px",
                flexShrink: 0,
                backgroundColor: "white",
                zIndex: 1,

                boxSizing: "border-box",
              }}
              onClick={(e) => {
                if (isExpanded) {
                  e.stopPropagation();

                  // Reset scroll position
                  window.scrollTo(0, 0);
                  if (scrollContainerRef.current) {
                    // Reset lerped scroll positions
                    scrollContainerRef.current.scrollTop = 0;
                    targetScrollRef.current = 0;
                    currentScrollRef.current = 0;
                  }

                  // Reset expanded state
                  setIsExpanded(false);

                  // Navigate to article
                  const path =
                    nextArticle.type === "radiogram"
                      ? `/article/${nextArticle.url}`
                      : `/mix/${nextArticle.url}`;
                  navigate(path);
                }
              }}
            >
              <img
                src={nextArticle.src || nextArticle.src2 || nextArticle.src3}
                alt={nextArticle.title}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                }}
              />

              <div style={{ flex: 1, top: 1, position: "relative" }}>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: darkMode ? "white" : "black",
                    fontFamily: "PPNeueBit-Bold",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {nextArticle.title}
                </div>

                <div
                  style={{
                    fontSize: "15px",
                    color: darkMode ? "#aaa" : "#666",
                    fontFamily: "NeueBit-Regular",
                  }}
                >
                  {nextArticle.title2}
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};
