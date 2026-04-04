import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Article.css";

import { djs } from "./items";

export const Article = ({
  isMobile,
  isPlaying,
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

  // Smooth scroll refs and state
  const scrollContainerRef = useRef(null);
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (articleSelected && setCurrentArticle) {
      const formatDesc = (desc) => {
        if (!Array.isArray(desc)) return desc;
        return desc
          .map((sentence) => {
            const spaceIdx = sentence.indexOf(" ");
            if (spaceIdx === -1) return `<p class="desc-row"><span class="desc-plus">+</span><span><strong>${sentence}</strong></span></p>`;
            const first = sentence.slice(0, spaceIdx);
            const rest = sentence.slice(spaceIdx);
            return `<p class="desc-row"><span class="desc-plus">+</span><span><strong>${first}</strong>${rest}</span></p>`;
          })
          .join("");
      };
      setCurrentArticle({
        ...articleSelected,
        summary: formatDesc(articleSelected.summary),
      });
    }
    return () => {
      if (setCurrentArticle) {
        setCurrentArticle(null);
      }
    };
  }, [articleSelected, setCurrentArticle]);

  // Mobile scroll percentage tracking
  useEffect(() => {
    if (!isMobile) return;
    const handleMobileScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
      if (setScrollPercentage) {
        setScrollPercentage(Math.min(100, Math.max(0, scrollPercent)));
      }
    };
    window.addEventListener("scroll", handleMobileScroll);
    return () => window.removeEventListener("scroll", handleMobileScroll);
  }, [isMobile, setScrollPercentage]);

  // Reset scroll on article change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      targetScrollRef.current = 0;
      currentScrollRef.current = 0;
    }
    if (setScrollPercentage) setScrollPercentage(0);
  }, [articleName, setScrollPercentage]);

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

      </div>
    </div>
  );
};
