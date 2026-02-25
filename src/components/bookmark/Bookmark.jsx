import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Bookmark.css";
import SymmetricalPattern from "../ui/SymmetricalPattern";
import Watermark from "../ui/Watermark";
import { useAudio } from "../../AudioContext";
import Comments from "../comments/Comments";
import MobileMenuTopBar from "./MobileMenuTopBar";
import newLogo from "../../assets/new-logo.svg";
import {
  DATA_API,
  CURRENT_QUESTION,
  CURRENT_QUESTION_AUTHOR,
} from "../../utils/constants";
import { fetchJson } from "../../utils/arrayUtils";

const Bookmark = ({
  currentArticle,
  onHoverMenuItem,
  scrollPercentage,
  setPlayingGuest,
  playingGuest,
  isMobile = false,
  chatUser,
  setMobileMenuOpen,
  setChatUser,
  selectedQuestion,
  setSelectedQuestion,
}) => {
  const { audioRef, isPlaying, setIsPlaying, progress } = useAudio();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [menuAnimationComplete, setMenuAnimationComplete] = useState(false);
  const bookmarkRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const timerRef = useRef(null);
  const [_scrollPercent, setScrollPercent] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [_location, setLocation] = useState({ city: null, country: null });
  const [watermarkHovered, setWatermarkHovered] = useState(false);
  const navigate = useNavigate();
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [displayedTitle2, setDisplayedTitle2] = useState("");
  const [imageVisible, setImageVisible] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState(null);
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [titleTypingComplete, setTitleTypingComplete] = useState(false);
  const [summaryTypingComplete, setSummaryTypingComplete] = useState(false);
  const [marqueeAnimVisible, setMarqueeAnimVisible] = useState(false);
  const [patternVisible, setPatternVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const summaryTimeoutRef = useRef(null);
  const marqueeAnimTimeoutRef = useRef(null);
  const contentTimeoutRef = useRef(null);
  const contentFadeInTimeoutRef = useRef(null);
  const previousContentArticleRef = useRef(null);
  const location = useLocation();
  const titleTimeoutRef = useRef(null);
  const title2TimeoutRef = useRef(null);
  const imageTimeoutRef = useRef(null);
  const imageFadeInTimeoutRef = useRef(null);
  const previousArticleRef = useRef(null);
  const indicatorTimeoutRef = useRef(null);
  const patternTimeoutRef = useRef(null);
  const titleSummaryRef = useRef(null);
  const [bottomOffset, setBottomOffset] = useState(243); // Default fallback
  const [visitorQuestions, setVisitorQuestions] = useState([]);

  // Fetch visitor questions when on visitorlog page
  useEffect(() => {
    const isVisitorLog = location.pathname === "/visitorlog";

    if (isVisitorLog && visitorQuestions.length === 0) {
      async function loadQuestions() {
        try {
          const dataRes = await fetch(DATA_API);
          const dataList = await dataRes.json();

          const questionsMap = new Map();

          await Promise.all(
            dataList.map(async ({ url }) => {
              const json = await fetchJson(url);
              if (json?.question && !questionsMap.has(json.question)) {
                questionsMap.set(json.question, {
                  question: json.question,
                  author: json.questionAuthor || "RADIO Project",
                  authorInstagram: json.questionAuthorInstagram,
                });
              }
            }),
          );

          setVisitorQuestions(Array.from(questionsMap.values()));
        } catch (err) {
          console.error("Failed to load visitor questions:", err);
        }
      }

      loadQuestions();
    }
  }, [location.pathname, visitorQuestions.length]);

  // Reset navigation state and close menu on location change
  useEffect(() => {
    setIsNavigating(false);
    setMenuOpen(false);
    setIsClosing(false);
  }, [location]);

  // Lock viewport height on mobile to prevent keyboard from resizing bookmark
  const [stableHeight, setStableHeight] = useState(null);

  useEffect(() => {
    if (!isMobile) return;

    const captureHeight = () => {
      setStableHeight(window.innerHeight);
    };

    captureHeight();
    window.addEventListener("orientationchange", captureHeight);
    return () => window.removeEventListener("orientationchange", captureHeight);
  }, [isMobile]);

  // Add body class when mobile menu is open to dim page content
  useEffect(() => {
    if (isMobile && menuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isMobile, menuOpen]);

  // Sync menu state with parent component
  useEffect(() => {
    if (setMobileMenuOpen) {
      setMobileMenuOpen(menuOpen);
    }
  }, [menuOpen, setMobileMenuOpen]);

  // Listen for photo snapped/retake events from RPHead
  useEffect(() => {
    const handlePhotoSnapped = () => setPhotoTaken(true);
    const handleRetakePhoto = () => {
      setPhotoTaken(false);
      setFormValid(false);
    };
    const handleFormValidityChanged = (e) => setFormValid(e.detail.isValid);

    window.addEventListener("photoSnapped", handlePhotoSnapped);
    window.addEventListener("retakePhoto", handleRetakePhoto);
    window.addEventListener("formValidityChanged", handleFormValidityChanged);
    return () => {
      window.removeEventListener("photoSnapped", handlePhotoSnapped);
      window.removeEventListener("retakePhoto", handleRetakePhoto);
      window.removeEventListener(
        "formValidityChanged",
        handleFormValidityChanged,
      );
    };
  }, []);
  // Animate frames when article/mix is selected
  useEffect(() => {
    if (!currentArticle) {
      setCurrentFrame(0);
      return;
    }

    // Reset frame and navigation state when switching between articles/mixes
    setCurrentFrame(0);
    setIsNavigating(false);

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 800);

    return () => clearInterval(interval);
  }, [currentArticle]);

  const toggleMenu = useCallback(() => {
    if (menuOpen && !isClosing) {
      // Start closing animation
      setIsClosing(true);
      setMenuAnimationComplete(false);
      // Desktop has longer animation, mobile is quick
      const closeDelay = isMobile ? 100 : 700;
      setTimeout(() => {
        setMenuOpen(false);
        setIsClosing(false);
      }, closeDelay);
    } else if (!menuOpen && !isClosing) {
      // Start opening animation
      setMenuOpen(true);
      setMenuAnimationComplete(false);
    }
  }, [menuOpen, isClosing, isMobile]);

  // Show menu content after animation completes
  useEffect(() => {
    if (menuOpen && !isClosing) {
      // Wait for the menu animation to complete (400ms as per transition)
      const timer = setTimeout(() => {
        setMenuAnimationComplete(true);
      }, 400);

      return () => clearTimeout(timer);
    } else {
      setMenuAnimationComplete(false);
    }
  }, [menuOpen, isClosing]);

  // Prevent body scroll when menu is open on mobile
  // useEffect(() => {
  //   if (isMobile && menuOpen) {
  //     // Store the current scroll position
  //     const scrollY = window.scrollY;

  //     // Store original styles
  //     const originalPosition = document.documentElement.style.position;
  //     const originalTop = document.documentElement.style.top;
  //     const originalWidth = document.documentElement.style.width;
  //     const originalOverflow = document.documentElement.style.overflow;

  //     // Lock scroll using document element instead of body
  //     document.documentElement.style.position = "fixed";
  //     document.documentElement.style.top = `-${scrollY}px`;
  //     document.documentElement.style.left = "0";
  //     document.documentElement.style.right = "0";
  //     document.documentElement.style.overflow = "visible";

  //     return () => {
  //       // Restore original styles
  //       document.documentElement.style.position = originalPosition;
  //       document.documentElement.style.top = originalTop;
  //       document.documentElement.style.width = originalWidth;
  //       document.documentElement.style.overflow = originalOverflow;
  //       document.documentElement.style.left = "";
  //       document.documentElement.style.right = "";

  //       // Restore scroll position
  //       window.scrollTo(0, scrollY);
  //     };
  //   }
  // }, [isMobile, menuOpen]);

  // Track time on page
  useEffect(() => {
    setTimeOnPage(0);
    timerRef.current = setInterval(() => {
      setTimeOnPage((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentArticle]); // Reset timer when article/page changes

  // Track scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollPercent(Math.round(scrolled));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Format time as MM:SS
  const _formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Typewriter effect for title
  useEffect(() => {
    // Clear any existing timeout
    if (titleTimeoutRef.current) {
      clearTimeout(titleTimeoutRef.current);
    }

    // Reset completion state immediately when article changes
    setTitleTypingComplete(false);

    if (!currentArticle?.title) {
      // Delay clearing to allow fade-out
      titleTimeoutRef.current = setTimeout(() => {
        setDisplayedTitle("");
      }, 400);
      return;
    }

    // Delay reset to allow fade-out animation to complete
    const resetDelay = previousContentArticleRef.current ? 450 : 0;

    const fullTitle = currentArticle.title;

    const startTyping = () => {
      let currentCharIndex = 0;

      const typeNextChar = () => {
        if (currentCharIndex <= fullTitle.length) {
          setDisplayedTitle(fullTitle.slice(0, currentCharIndex));
          currentCharIndex++;
          titleTimeoutRef.current = setTimeout(typeNextChar, 30);
        } else {
          setTimeout(() => {
            setTitleTypingComplete(true);
          }, 50);
        }
      };

      typeNextChar();
    };

    // Wait for fade-out before starting new content
    titleTimeoutRef.current = setTimeout(startTyping, resetDelay + 100);

    return () => {
      if (titleTimeoutRef.current) {
        clearTimeout(titleTimeoutRef.current);
      }
      setTitleTypingComplete(false); // Reset on unmount
    };
  }, [currentArticle?.title]);

  // Typewriter effect for title2
  useEffect(() => {
    // Clear any existing timeout
    if (title2TimeoutRef.current) {
      clearTimeout(title2TimeoutRef.current);
    }

    if (!currentArticle?.title2) {
      // Delay clearing to allow fade-out
      title2TimeoutRef.current = setTimeout(() => {
        setDisplayedTitle2("");
      }, 400);
      return;
    }

    // Delay reset to allow fade-out animation to complete
    const resetDelay = previousContentArticleRef.current ? 450 : 0;

    const fullTitle2 = currentArticle.title2;

    const startTyping = () => {
      let currentCharIndex = 0;

      const typeNextChar = () => {
        if (currentCharIndex <= fullTitle2.length) {
          setDisplayedTitle2(fullTitle2.slice(0, currentCharIndex));
          currentCharIndex++;
          title2TimeoutRef.current = setTimeout(typeNextChar, 30);
        }
      };

      typeNextChar();
    };

    // Wait for fade-out before starting new content
    title2TimeoutRef.current = setTimeout(startTyping, resetDelay + 50);

    return () => {
      if (title2TimeoutRef.current) {
        clearTimeout(title2TimeoutRef.current);
      }
    };
  }, [currentArticle?.title2]);

  // Glitch blink effect for indicator - triggers after typing animations complete
  useEffect(() => {
    // Clear any existing timeout
    if (indicatorTimeoutRef.current) {
      clearTimeout(indicatorTimeoutRef.current);
    }

    // Always reset indicator when dependencies change
    setIndicatorVisible(false);

    if (currentArticle) {
      // Determine if we should wait for typing animations
      const shouldWaitForTitle = currentArticle.title && !titleTypingComplete;
      const shouldWaitForSummary =
        currentArticle.summary && !summaryTypingComplete;

      // If either animation is still running, don't show indicator yet
      if (shouldWaitForTitle || shouldWaitForSummary) {
        return;
      }

      // Both animations are complete (or don't exist), show indicator after delay
      indicatorTimeoutRef.current = setTimeout(() => {
        setIndicatorVisible(true);
      }, 700); // Substantial delay after typing completes
    }

    return () => {
      if (indicatorTimeoutRef.current) {
        clearTimeout(indicatorTimeoutRef.current);
      }
    };
  }, [currentArticle, titleTypingComplete, summaryTypingComplete]);

  // Measure title + summary height for Comments component
  useEffect(() => {
    if (
      titleSummaryRef.current &&
      (titleTypingComplete || summaryTypingComplete)
    ) {
      // Small delay to ensure DOM has updated
      const measureTimeout = setTimeout(() => {
        const height = titleSummaryRef.current?.offsetHeight || 0;
        // 123px base (menu button + archive) + measured height + gaps
        setBottomOffset(123 + height + 20);
      }, 100);
      return () => clearTimeout(measureTimeout);
    }
  }, [
    displayedTitle,
    displayedSummary,
    titleTypingComplete,
    summaryTypingComplete,
  ]);

  // Fade effect for SymmetricalPattern
  useEffect(() => {
    // Clear any existing timeout
    if (patternTimeoutRef.current) {
      clearTimeout(patternTimeoutRef.current);
    }

    if (currentArticle && !menuOpen) {
      // Fade in after a short delay when article is present
      patternTimeoutRef.current = setTimeout(() => {
        setPatternVisible(true);
      }, 500);
    } else {
      // Fade out immediately when no article or menu is open
      setPatternVisible(false);
    }

    return () => {
      if (patternTimeoutRef.current) {
        clearTimeout(patternTimeoutRef.current);
      }
    };
  }, [currentArticle, menuOpen]);

  // Blur fade effect for marquee based on route
  useEffect(() => {
    // Clear any existing timeout
    if (marqueeAnimTimeoutRef.current) {
      clearTimeout(marqueeAnimTimeoutRef.current);
    }

    // Check if we're on a page that should show the marquee
    const shouldShowMarquee =
      location.pathname === "/" ||
      location.pathname === "/archive" ||
      location.pathname === "/visitorlog" ||
      location.pathname === "/proposals";

    if (shouldShowMarquee) {
      // Delay fade in for smooth transition
      marqueeAnimTimeoutRef.current = setTimeout(() => {
        setMarqueeAnimVisible(true);
      }, 800); // Increased delay for more noticeable entrance
    } else {
      // Fade out immediately when leaving these pages
      setMarqueeAnimVisible(false);
    }

    return () => {
      if (marqueeAnimTimeoutRef.current) {
        clearTimeout(marqueeAnimTimeoutRef.current);
      }
    };
  }, [location.pathname]);

  // Blur fade effect for image
  useEffect(() => {
    // Clear any existing timeouts
    if (imageTimeoutRef.current) clearTimeout(imageTimeoutRef.current);
    if (imageFadeInTimeoutRef.current)
      clearTimeout(imageFadeInTimeoutRef.current);
    if (crossfadeIntervalRef.current)
      clearInterval(crossfadeIntervalRef.current);

    // Reset crossfade index on article change
    setActiveImageIndex(0);

    const newSrc = currentArticle?.src ?? null;

    if (
      previousArticleRef.current?.src &&
      previousArticleRef.current !== currentArticle
    ) {
      setImageVisible(false);

      imageTimeoutRef.current = setTimeout(() => {
        if (newSrc) {
          setCurrentImageSrc(newSrc);
          imageFadeInTimeoutRef.current = setTimeout(() => {
            setImageVisible(true);
            // Start crossfade if array
            if (Array.isArray(newSrc) && newSrc.length === 2) {
              crossfadeIntervalRef.current = setInterval(() => {
                setActiveImageIndex((prev) => (prev === 0 ? 1 : 0));
              }, 4000);
            }
          }, 50);
        } else {
          setCurrentImageSrc(null);
        }
      }, 600);
    } else if (newSrc) {
      setCurrentImageSrc(newSrc);
      imageTimeoutRef.current = setTimeout(() => {
        setImageVisible(true);
        if (Array.isArray(newSrc) && newSrc.length === 2) {
          crossfadeIntervalRef.current = setInterval(() => {
            setActiveImageIndex((prev) => (prev === 0 ? 1 : 0));
          }, 4000);
        }
      }, 400);
    } else {
      setImageVisible(false);
      imageTimeoutRef.current = setTimeout(() => {
        setCurrentImageSrc(null);
      }, 600);
    }

    previousArticleRef.current = currentArticle;

    return () => {
      if (imageTimeoutRef.current) clearTimeout(imageTimeoutRef.current);
      if (imageFadeInTimeoutRef.current)
        clearTimeout(imageFadeInTimeoutRef.current);
      if (crossfadeIntervalRef.current)
        clearInterval(crossfadeIntervalRef.current);
    };
  }, [currentArticle]);

  // Blur fade effect for content (title + summary) - fade OUT only
  const [skipTransition, setSkipTransition] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const crossfadeIntervalRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeouts
    if (contentTimeoutRef.current) {
      clearTimeout(contentTimeoutRef.current);
    }
    if (contentFadeInTimeoutRef.current) {
      clearTimeout(contentFadeInTimeoutRef.current);
    }

    // If article changed, fade out then show new content immediately
    if (
      previousContentArticleRef.current &&
      previousContentArticleRef.current !== currentArticle
    ) {
      // Start fade out (transition enabled)
      setContentVisible(false);

      // After fade out completes, show new content immediately (skip transition)
      contentTimeoutRef.current = setTimeout(() => {
        if (currentArticle) {
          setSkipTransition(true);
          setContentVisible(true);
          contentFadeInTimeoutRef.current = setTimeout(() => {
            setSkipTransition(false);
          }, 50);
        }
        previousContentArticleRef.current = currentArticle;
      }, 400);
    } else if (currentArticle) {
      // No previous article, show immediately without transition
      setSkipTransition(true);
      setContentVisible(true);
      previousContentArticleRef.current = currentArticle;
      contentTimeoutRef.current = setTimeout(() => {
        setSkipTransition(false);
      }, 50);
    } else {
      // No current article, fade out
      setContentVisible(false);
      previousContentArticleRef.current = null;
    }

    return () => {
      if (contentTimeoutRef.current) {
        clearTimeout(contentTimeoutRef.current);
      }
      if (contentFadeInTimeoutRef.current) {
        clearTimeout(contentFadeInTimeoutRef.current);
      }
    };
  }, [currentArticle]);

  // Typewriter effect for article summary
  useEffect(() => {
    // Clear any existing timeout
    if (summaryTimeoutRef.current) {
      clearTimeout(summaryTimeoutRef.current);
    }

    // Reset completion state immediately when article changes
    setSummaryTypingComplete(false);

    if (!currentArticle?.summary) {
      // Delay clearing to allow fade-out
      summaryTimeoutRef.current = setTimeout(() => {
        setDisplayedSummary("");
      }, 400);
      return;
    }

    // Delay reset to allow fade-out animation to complete
    const resetDelay = previousContentArticleRef.current ? 450 : 0;

    // Strip HTML tags for character counting but preserve the full HTML
    const fullHTML = currentArticle.summary;
    const textOnly = fullHTML.replace(/<[^>]*>/g, "");

    const startTyping = () => {
      let currentCharIndex = 0;

      const typeNextChar = () => {
        if (currentCharIndex <= textOnly.length) {
          // Find the position in the HTML that corresponds to currentCharIndex in plain text
          let htmlPos = 0;
          let textPos = 0;
          let insideTag = false;

          while (htmlPos < fullHTML.length && textPos <= currentCharIndex) {
            if (fullHTML[htmlPos] === "<") {
              insideTag = true;
            } else if (fullHTML[htmlPos] === ">") {
              insideTag = false;
            } else if (!insideTag) {
              textPos++;
            }
            htmlPos++;
          }

          // Display the HTML up to this point
          setDisplayedSummary(fullHTML.slice(0, htmlPos));
          currentCharIndex++;
          summaryTimeoutRef.current = setTimeout(typeNextChar, 10);
        } else {
          // Summary typing is complete
          setTimeout(() => {
            setSummaryTypingComplete(true);
          }, 50);
        }
      };

      typeNextChar();
    };

    // Wait for fade-out before starting new content
    summaryTimeoutRef.current = setTimeout(startTyping, resetDelay + 300);

    return () => {
      if (summaryTimeoutRef.current) {
        clearTimeout(summaryTimeoutRef.current);
      }
      setSummaryTypingComplete(false); // Reset on unmount
    };
  }, [currentArticle?.summary]);

  // Memoize article summary to prevent re-rendering when other states change
  const articleSummary = useMemo(() => {
    if (!displayedSummary) return null;
    return (
      <div
        className={`article-summary article-summary-styled ${
          isMobile ? "article-summary-mobile" : "article-summary-desktop"
        }`}
      >
        <img
          src="/super.svg"
          alt=""
          className="article-summary-icon"
          aria-hidden="true"
        />
        <span dangerouslySetInnerHTML={{ __html: displayedSummary }} />
      </div>
    );
  }, [displayedSummary, isMobile]);

  const bookmarkHeight = isMobile ? "100dvh" : "100vh";
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bookmark-container">
      {isMobile && menuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={toggleMenu}
          onTouchStart={(e) => {
            e.preventDefault();
            toggleMenu();
          }}
        />
      )}
      {!isMobile ? (
        <div
          ref={bookmarkRef}
          className={`bookmark-desktop ${
            isMobile ? "bookmark-desktop-mobile-height" : ""
          } ${menuOpen ? "bookmark-desktop-menu-open" : ""}`}
        >
          {location.pathname === "/visitorlog" ? (
            // Questions list for visitor log page
            <div
              className={`visitor-questions-list ${
                menuOpen || isClosing ? "marquee-hiding" : ""
              } ${
                marqueeAnimVisible && !menuOpen && !isClosing
                  ? "vertical-marquee-visible"
                  : "vertical-marquee-hidden"
              }`}
              style={{
                position: "absolute",
                top: "10px",
                width: "260px",
                maxHeight: "calc(100vh - 200px)",
                scrollbarWidth: "none",
                overflowY: "auto",
                overflowX: "hidden",
                paddingTop: "10px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* Current Question - the one being asked on /visitorcheck */}
                {(() => {
                  const currentQ = CURRENT_QUESTION;
                  const isCurrentSelected = selectedQuestion === currentQ;
                  return (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        cursor: "pointer",
                        opacity:
                          selectedQuestion && !isCurrentSelected ? 0.4 : 1,
                        transition: "opacity 0.2s ease, transform 0.15s ease",
                      }}
                      onClick={() =>
                        setSelectedQuestion(isCurrentSelected ? null : currentQ)
                      }
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateX(2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      {/* Left arrow indicator - outside the box */}
                      <span
                        style={{
                          fontFamily: "NeueBit-Regular",
                          fontSize: "24px",
                          color: "#434a47",
                          marginTop: "8px",
                          opacity: isCurrentSelected ? 1 : 0,
                          width: isCurrentSelected ? "20px" : "0px",
                          marginRight: isCurrentSelected ? "4px" : "0px",
                          overflow: "hidden",
                          transition:
                            "opacity 0.2s ease, width 0.2s ease, margin-right 0.2s ease",
                          flexShrink: 0,
                        }}
                      >
                        ←
                      </span>
                      {/* Question box */}
                      <div
                        style={{
                          flex: 1,
                          paddingLeft: "5px",
                          paddingRight: isCurrentSelected ? "12px" : "22px",
                          paddingTop: "3px",
                          paddingBottom: "6px",
                          marginLeft: isCurrentSelected ? "0px" : "0",
                          backgroundColor: isCurrentSelected
                            ? "#434a47"
                            : "transparent",
                          transition:
                            "background-color 0.2s ease, padding 0.2s ease, margin 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "NeueBit-Regular",
                            fontSize: "22px",
                            color: isCurrentSelected ? "#bfbfbf" : "#616161",
                            lineHeight: "0.7",
                            marginBottom: "4px",
                          }}
                        >
                          a question from {CURRENT_QUESTION_AUTHOR}...
                        </div>
                        <div
                          style={{
                            fontFamily: "NeueBit-Regular",
                            fontSize: "30px",
                            color: isCurrentSelected ? "#ececec" : "#000000",
                            lineHeight: "0.8",
                          }}
                        >
                          {currentQ}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Separator */}
                <div
                  style={{
                    fontFamily: "PPNeueBit-Bold",
                    fontSize: "12px",
                    color: "#a1a4a3",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  PREVIOUS Questions
                </div>

                {[...visitorQuestions]
                  .filter((q) => q.question !== CURRENT_QUESTION)
                  .map((q, index) => {
                    const isSelected = selectedQuestion === q.question;
                    return (
                      <div
                        key={index}
                        onClick={() =>
                          setSelectedQuestion(isSelected ? null : q.question)
                        }
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateX(2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          cursor: "pointer",
                          opacity: selectedQuestion && !isSelected ? 0.4 : 1,
                          transition: "opacity 0.2s ease, transform 0.15s ease",
                        }}
                      >
                        {/* Left arrow indicator - outside the box */}
                        <span
                          style={{
                            fontFamily: "NeueBit-Regular",
                            fontSize: "18px",
                            color: "#434a47",
                            marginTop: "4px",
                            opacity: isSelected ? 1 : 0,
                            width: isSelected ? "16px" : "0px",
                            marginRight: isSelected ? "4px" : "0px",
                            overflow: "hidden",
                            transition:
                              "opacity 0.2s ease, width 0.2s ease, margin-right 0.2s ease",
                            flexShrink: 0,
                          }}
                        >
                          ←
                        </span>
                        {/* Question box */}
                        <div
                          style={{
                            flex: 1,
                            paddingLeft: "10px",
                            paddingRight: isSelected ? "10px" : "0",
                            borderLeft: "2px solid #ff5a92",
                            paddingBottom: "0",
                            backgroundColor: isSelected
                              ? "#434a47"
                              : "transparent",
                            transition:
                              "background-color 0.2s ease, border-color 0.2s ease, padding 0.2s ease",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "NeueBit-Regular",
                              fontSize: "18px",
                              color: isSelected ? "#bfbfbf" : "#616161",
                              lineHeight: "0.7",
                              marginBottom: "4px",
                              marginTop: "4px",
                            }}
                          >
                            a question from {q.author}...
                          </div>
                          <div
                            style={{
                              fontFamily: "NeueBit-Regular",
                              fontSize: "21px",
                              color: isSelected ? "#ececec" : "#000000",
                              lineHeight: "0.8",
                              marginBottom: "4px",
                              transition: "color 0.2s ease",
                            }}
                          >
                            {q.question}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            // Regular marquee for other pages
            <div
              className={`vertical-marquee vertical-marquee-positioned ${
                menuOpen || isClosing ? "marquee-hiding" : ""
              } ${
                marqueeAnimVisible && !menuOpen && !isClosing
                  ? "vertical-marquee-visible"
                  : "vertical-marquee-hidden"
              }`}
            >
              <div className="vertical-marquee-content">
                {[...Array(8)].map((_, i) => (
                  <div key={i}>
                    <img src="/side rp.svg" alt="RADIO Project" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentArticle && (
            <Comments
              itemId={currentArticle.url}
              itemType={currentArticle.type}
              chatUser={chatUser}
              setChatUser={setChatUser}
              isMobile={isMobile}
              playingGuest={playingGuest}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              bottomOffset={bottomOffset}
            />
          )}

          <div className="bookmark-content-container">
            <div className="bookmark-content-wrapper">
              <div
                className={`bookmark-content-inner ${
                  !currentArticle ? "bookmark-content-inner-hidden" : ""
                }`}
              >
                {/* Comments section - appears at top when article is selected */}

                {/* Title + Summary container for height measurement */}
                <div
                  ref={titleSummaryRef}
                  className={`${
                    contentVisible
                      ? "title-summary-container"
                      : "title-summary-container-hidden"
                  } ${
                    skipTransition
                      ? "title-summary-container-no-transition"
                      : ""
                  }`}
                >
                  {displayedTitle2 && (
                    <div className="article-title2">{displayedTitle2}</div>
                  )}
                  {displayedTitle && (
                    <div className="article-title">{displayedTitle}</div>
                  )}

                  {articleSummary}
                </div>
              </div>

              <div className="button-container">
                <svg
                  width="210"
                  height="210"
                  viewBox="0 0 210 210"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon-blink menu-icon-svg"
                  style={{
                    color:
                      currentArticle?.themeColor ||
                      playingGuest?.themeColor ||
                      "rgb(255, 0, 90)",
                    transition: "color 0.5s ease-in-out",
                  }}
                  onClick={toggleMenu}
                  onMouseEnter={() =>
                    onHoverMenuItem && onHoverMenuItem("home")
                  }
                  onMouseLeave={() => onHoverMenuItem && onHoverMenuItem(null)}
                >
                  <path d="M0 0H25.2V210H0V0Z" fill="currentColor" />
                  <path d="M184.8 0H210V210H184.8V0Z" fill="currentColor" />
                  <path d="M0 25.2V0H210V25.2H0Z" fill="currentColor" />
                  <path d="M0 210V184.8H210V210H0Z" fill="currentColor" />
                  <path
                    d="M92.4 50.4H117.6V159.6H92.4V50.4Z"
                    fill="currentColor"
                  />
                  <path
                    d="M159.6 92.4V117.6H50.4V92.4H159.6Z"
                    fill="currentColor"
                  />
                </svg>

                {/* Visitor Check buttons - next to pink menu button */}
                {location.pathname === "/visitorcheck" && (
                  <div className="visitor-check-buttons">
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("retakePhoto"));
                      }}
                      className="visitor-check-button"
                      disabled={!photoTaken}
                    >
                      retake
                    </button>
                    <button
                      onClick={() => {
                        const form = document.querySelector(
                          'form[autocomplete="off"]',
                        );
                        if (form) {
                          form.dispatchEvent(
                            new Event("submit", {
                              bubbles: true,
                              cancelable: true,
                            }),
                          );
                        }
                      }}
                      className="visitor-check-button visitor-check-button-post"
                      disabled={!photoTaken || !formValid}
                    >
                      post
                    </button>
                  </div>
                )}

                {/* Play button for mixes */}

                {currentImageSrc && (
                  <div
                    className={`article-image-container ${
                      !imageVisible ? "article-image-container-hidden" : ""
                    }`}
                    onClick={() => {
                      if (!currentArticle) return;
                      // If mix, play it
                      if (currentArticle.type === "mix" && setPlayingGuest) {
                        setPlayingGuest(currentArticle);
                      } else {
                        // If radiogram, open link
                        const link =
                          currentArticle.type === "mix"
                            ? currentArticle.igLink
                            : currentArticle.postLink;
                        if (link) {
                          window.open(link, "_blank");
                        }
                      }
                    }}
                  >
                    {Array.isArray(currentImageSrc) &&
                    currentImageSrc.length === 2 ? (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <img
                          src={currentImageSrc[0]}
                          alt={currentArticle?.title || "Article image"}
                          className={`article-image ${currentArticle?.type === "article" ? "icon-blink" : ""}`}
                          style={{
                            position: "absolute",
                            inset: 0,
                            transition: "opacity 1s ease",
                            opacity: activeImageIndex === 0 ? 1 : 0,
                          }}
                        />
                        <img
                          src={currentImageSrc[1]}
                          alt={currentArticle?.title || "Article image"}
                          className={`article-image ${currentArticle?.type === "article" ? "icon-blink" : ""}`}
                          style={{
                            position: "absolute",
                            inset: 0,
                            transition: "opacity 1s ease",
                            opacity: activeImageIndex === 1 ? 1 : 0,
                          }}
                        />
                        <img
                          src={currentImageSrc[0]}
                          alt=""
                          aria-hidden
                          className="article-image"
                          style={{ visibility: "hidden" }}
                        />
                      </div>
                    ) : (
                      <img
                        src={currentImageSrc}
                        alt={currentArticle?.title || "Article image"}
                        className={`article-image ${currentArticle?.type === "article" ? "icon-blink" : ""}`}
                      />
                    )}

                    {/* Play button overlay for mixes */}
                    {currentArticle?.type === "mix" && imageVisible && (
                      <p
                        className={`slight-info play play-button-overlay ${
                          playingGuest?.url === currentArticle?.url
                            ? "play-button-overlay-playing"
                            : ""
                        }`}
                      >
                        ▶
                      </p>
                    )}
                  </div>
                )}
              </div>
              {(menuOpen || isClosing) && (
                <div
                  className={`menu-container ${
                    isClosing ? "menu-contracting" : "menu-expanding"
                  }`}
                >
                  <Link
                    to="/"
                    className="icon-blink menu-item-glitch menu-link"
                    onClick={toggleMenu}
                    onMouseEnter={() =>
                      onHoverMenuItem && onHoverMenuItem("archive")
                    }
                    onMouseLeave={() =>
                      onHoverMenuItem && onHoverMenuItem(null)
                    }
                    style={{
                      paddingTop: "11px",
                      opacity: 0,
                      animation: "fadeIn 0.7s ease-out forwards",
                      animationDelay: "0.45s",
                    }}
                  >
                    Archive
                  </Link>
                  <Link
                    to="/visitorlog"
                    className="icon-blink menu-item-glitch menu-link"
                    onClick={toggleMenu}
                    onMouseEnter={() =>
                      onHoverMenuItem && onHoverMenuItem("visitorLog")
                    }
                    onMouseLeave={() =>
                      onHoverMenuItem && onHoverMenuItem(null)
                    }
                    style={{
                      opacity: 0,
                      animation: "fadeIn 0.7s ease-out forwards",
                      animationDelay: "0.5s",
                    }}
                  >
                    Visitor Log
                  </Link>
                  <Link
                    to="/proposals"
                    className="icon-blink menu-item-glitch menu-link"
                    onClick={toggleMenu}
                    onMouseEnter={() =>
                      onHoverMenuItem && onHoverMenuItem("contact")
                    }
                    onMouseLeave={() =>
                      onHoverMenuItem && onHoverMenuItem(null)
                    }
                    style={{
                      opacity: 0,
                      animation: "fadeIn 0.7s ease-out forwards",
                      animationDelay: "0.7s",
                    }}
                  >
                    Proposals
                  </Link>
                  <a
                    href="https://soundcloud.com/radioproject_live"
                    target="_blank"
                    className="icon-blink menu-item-glitch menu-link"
                    onClick={toggleMenu}
                    onMouseEnter={() =>
                      onHoverMenuItem && onHoverMenuItem("soundcloud")
                    }
                    onMouseLeave={() =>
                      onHoverMenuItem && onHoverMenuItem(null)
                    }
                    style={{
                      opacity: 0,
                      animation: "fadeIn 0.7s ease-out forwards",
                      animationDelay: "0.55s",
                      color: "#a3a3a3",
                    }}
                  >
                    SoundCloud
                  </a>
                  <a
                    href="https://www.ninaprotocol.com/profiles/radioproject-live"
                    target="_blank"
                    className="icon-blink menu-item-glitch menu-link"
                    onClick={toggleMenu}
                    onMouseEnter={() =>
                      onHoverMenuItem && onHoverMenuItem("nina")
                    }
                    onMouseLeave={() =>
                      onHoverMenuItem && onHoverMenuItem(null)
                    }
                    style={{
                      opacity: 0,
                      animation: "fadeIn 0.7s ease-out forwards",
                      animationDelay: "0.6s",
                      color: "#a3a3a3",
                    }}
                  >
                    Nina Protocol
                  </a>
                  <a
                    href="https://www.instagram.com/radio__project/"
                    target="_blank"
                    className="icon-blink menu-item-glitch menu-link"
                    onClick={toggleMenu}
                    onMouseEnter={() =>
                      onHoverMenuItem && onHoverMenuItem("instagram")
                    }
                    onMouseLeave={() =>
                      onHoverMenuItem && onHoverMenuItem(null)
                    }
                    style={{
                      opacity: 0,
                      animation: "fadeIn 0.7s ease-out forwards",
                      animationDelay: "0.65s",
                      color: "#a3a3a3",
                    }}
                  >
                    Instagram
                  </a>

                  <a
                    href="mailto:contact@radioproject.live"
                    target="_blank"
                    className="icon-blink menu-item-glitch menu-link"
                    onClick={toggleMenu}
                    onMouseEnter={() =>
                      onHoverMenuItem && onHoverMenuItem("contact")
                    }
                    onMouseLeave={() =>
                      onHoverMenuItem && onHoverMenuItem(null)
                    }
                    style={{
                      opacity: 0,
                      animation: "fadeIn 0.7s ease-out forwards",
                      animationDelay: "0.7s",
                      color: "#a3a3a3",
                    }}
                  >
                    Contact
                  </a>
                </div>
              )}
              <div className="bookmark-description">
                <span className="bookmark-description-bold">RADIO Project</span>{" "}
                strives to empower users with their own visual, auditory, +
                verbal agency. Aiming to engage the populace in discourse,
                disagreement and debate without the reliance on current social
                platforms.
              </div>
            </div>
          </div>
          {/* Footer */}

          <div className="bookmark-footer">
            <div className="bookmark-footer-inner">
              <img
                src={newLogo}
                alt="Radio Project"
                className="bookmark-footer-logo"
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            ref={bookmarkRef}
            className={`bookmark-mobile ${
              menuOpen ? "bookmark-mobile-open" : "bookmark-mobile-closed"
            }`}
            style={{
              "--bookmark-mobile-width":
                menuOpen || currentArticle || playingGuest ? "300px" : "35px",
              ...(menuOpen && stableHeight
                ? {
                    height: `${stableHeight * 0.95}px`,
                    maxHeight: `${stableHeight - 2}px`,
                  }
                : {}),
            }}
            onClick={(e) => {
              // Only allow opening the menu when it's closed
              // Don't close the menu when clicking on the bookmark container itself
              // Menu items have their own onClick handlers to close the menu
              if (!menuOpen) {
                setMenuOpen(true);
              }
            }}
          >
            <div className="bookmark-mobile-content">
              <div>
                <svg
                  width="35"
                  height="35"
                  viewBox="0 0 210 210"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`mobile-menu-icon ${
                    menuOpen
                      ? "mobile-menu-icon-open"
                      : "mobile-menu-icon-closed"
                  }`}
                  style={{
                    color:
                      currentArticle?.themeColor ||
                      playingGuest?.themeColor ||
                      "rgb(255, 0, 90)",
                    transition: "color 0.5s ease-in-out",
                  }}
                  onClick={toggleMenu}
                  onMouseEnter={() =>
                    onHoverMenuItem && onHoverMenuItem("home")
                  }
                  onMouseLeave={() => onHoverMenuItem && onHoverMenuItem(null)}
                >
                  <path d="M0 0H25.2V210H0V0Z" fill="currentColor" />
                  <path d="M184.8 0H210V210H184.8V0Z" fill="currentColor" />
                  <path d="M0 25.2V0H210V25.2H0Z" fill="currentColor" />
                  <path d="M0 210V184.8H210V210H0Z" fill="currentColor" />
                  <path
                    d="M92.4 50.4H117.6V159.6H92.4V50.4Z"
                    fill="currentColor"
                  />
                  <path
                    d="M159.6 92.4V117.6H50.4V92.4H159.6Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {(() => {
                // Determine what to show: playing guest on archive/visitorlog, or current article
                const isOnArchiveOrVisitorlog =
                  location.pathname === "/" ||
                  location.pathname === "/visitorlog";
                const showPlayingGuest =
                  isOnArchiveOrVisitorlog && playingGuest;
                const displayItem = showPlayingGuest
                  ? playingGuest
                  : currentArticle || playingGuest; // Fallback to playingGuest during navigation
                const displayImage = showPlayingGuest
                  ? playingGuest?.src
                  : currentImageSrc || currentArticle?.src || playingGuest?.src; // Fallback chain
                const showContent =
                  displayItem || showPlayingGuest || playingGuest; // Keep showing if playing

                return showContent ? (
                  <div className="mobile-content-display">
                    {/* Image thumbnail */}
                    {displayImage && (
                      <div
                        className="mobile-image-thumbnail"
                        onClick={() => {
                          if (!displayItem) return;
                          if (displayItem.type === "mix" && setPlayingGuest) {
                            setPlayingGuest(displayItem);
                          } else {
                            const link =
                              displayItem.type === "mix"
                                ? displayItem.igLink
                                : displayItem.postLink;
                            if (link) {
                              window.open(link, "_blank");
                            }
                          }
                        }}
                      >
                        {Array.isArray(displayImage) &&
                        displayImage.length === 2 ? (
                          <div
                            style={{
                              position: "relative",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <img
                              src={displayImage[0]}
                              alt={displayItem?.title || "Article image"}
                              style={{
                                position: "absolute",
                                inset: 0,
                                transition: "opacity 1s ease",
                                opacity: activeImageIndex === 0 ? 1 : 0,
                              }}
                            />
                            <img
                              src={displayImage[1]}
                              alt={displayItem?.title || "Article image"}
                              style={{
                                position: "absolute",
                                inset: 0,
                                transition: "opacity 1s ease",
                                opacity: activeImageIndex === 1 ? 1 : 0,
                              }}
                            />
                            <img
                              src={displayImage[0]}
                              alt=""
                              aria-hidden
                              style={{ visibility: "hidden" }}
                            />
                          </div>
                        ) : (
                          <img
                            src={displayImage}
                            alt={displayItem?.title || "Article image"}
                          />
                        )}
                      </div>
                    )}

                    {/* Title text */}
                    <div
                      className={`mobile-title-container ${
                        playingGuest
                          ? "mobile-title-container-playing"
                          : "mobile-title-container-default"
                      }`}
                    >
                      <p className="mobile-title-text">
                        {showPlayingGuest && (
                          <>
                            <span className="mobile-title-text-roman">
                              playing:{" "}
                            </span>
                            {displayItem?.title}

                            <span className="mobile-title-text-roman">
                              {" "}
                              by{" "}
                            </span>
                            <span>{displayItem?.title2}</span>
                          </>
                        )}
                        {!showPlayingGuest && (
                          <span>
                            {displayItem?.title}
                            <span className="mobile-title-text-roman">
                              {" "}
                              by{" "}
                            </span>
                            {displayItem?.title2}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Play/Pause button when playing - persists across all pages */}
                    {playingGuest && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!audioRef.current) return;
                          if (isPlaying) {
                            audioRef.current.pause();
                            setIsPlaying(false);
                          } else {
                            audioRef.current.play().catch(console.error);
                            setIsPlaying(true);
                          }
                        }}
                        className="mobile-play-pause-button"
                      >
                        <span
                          className={`mobile-play-pause-icon ${
                            !isPlaying
                              ? "mobile-play-pause-icon-paused"
                              : "mobile-play-pause-icon-played"
                          }`}
                        >
                          {isPlaying ? "■" : "►"}
                        </span>
                      </div>
                    )}

                    {/* Progress bar when playing */}
                    {playingGuest && (
                      <div className="mobile-progress-bar-container">
                        <div
                          className="mobile-progress-bar"
                          style={{
                            "--progress-width": `${progress || 0}%`,
                            backgroundColor:
                              playingGuest?.themeColor || "rgb(255, 0, 90)",
                            transition:
                              "width 0.1s linear, background-color 0.5s ease-in-out",
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : null;
              })()}
            </div>
            {menuOpen && (
              <>
                <MobileMenuTopBar
                  currentArticle={currentArticle}
                  chatUser={chatUser}
                  setChatUser={setChatUser}
                  isMobile={isMobile}
                  playingGuest={playingGuest}
                  menuOpen={menuOpen}
                  setMenuOpen={setMenuOpen}
                />
                {menuAnimationComplete && (
                  <div className="mobile-menu-bottom-section">
                    {currentArticle && (
                      <div
                        className={`mobile-article-summary ${
                          isClosing ? "menu-contracting" : "menu-expanding"
                        }`}
                      >
                        {articleSummary}
                      </div>
                    )}
                    <div
                      className={`mobile-menu-container ${
                        isClosing ? "menu-contracting" : "menu-expanding"
                      }`}
                    >
                      <Link
                        to="/"
                        className="icon-blink menu-item-glitch menu-link"
                        onClick={toggleMenu}
                        onMouseEnter={() =>
                          onHoverMenuItem && onHoverMenuItem("archive")
                        }
                        onMouseLeave={() =>
                          onHoverMenuItem && onHoverMenuItem(null)
                        }
                      >
                        Archive
                      </Link>
                      <Link
                        to="/visitorlog"
                        className="icon-blink menu-item-glitch menu-link"
                        onClick={toggleMenu}
                        onMouseEnter={() =>
                          onHoverMenuItem && onHoverMenuItem("visitorLog")
                        }
                        onMouseLeave={() =>
                          onHoverMenuItem && onHoverMenuItem(null)
                        }
                      >
                        Visitor Log
                      </Link>
                      <Link
                        to="/proposals"
                        className="icon-blink menu-item-glitch menu-link"
                        onClick={toggleMenu}
                        onMouseEnter={() =>
                          onHoverMenuItem && onHoverMenuItem("contact")
                        }
                        onMouseLeave={() =>
                          onHoverMenuItem && onHoverMenuItem(null)
                        }
                      >
                        Proposals
                      </Link>
                      <a
                        href="https://soundcloud.com/radioproject_live"
                        target="_blank"
                        className="icon-blink menu-item-glitch menu-link"
                        onClick={toggleMenu}
                        onMouseEnter={() =>
                          onHoverMenuItem && onHoverMenuItem("soundcloud")
                        }
                        onMouseLeave={() =>
                          onHoverMenuItem && onHoverMenuItem(null)
                        }
                        style={{ color: "#a3a3a3" }}
                      >
                        SoundCloud
                      </a>
                      <a
                        href="https://www.ninaprotocol.com/profiles/radioproject-live"
                        target="_blank"
                        className="icon-blink menu-item-glitch menu-link"
                        onClick={toggleMenu}
                        onMouseEnter={() =>
                          onHoverMenuItem && onHoverMenuItem("nina")
                        }
                        onMouseLeave={() =>
                          onHoverMenuItem && onHoverMenuItem(null)
                        }
                        style={{ color: "#a3a3a3" }}
                      >
                        Nina Protocol
                      </a>
                      <a
                        href="https://www.instagram.com/radio__project/"
                        target="_blank"
                        className="icon-blink menu-item-glitch menu-link"
                        onClick={toggleMenu}
                        onMouseEnter={() =>
                          onHoverMenuItem && onHoverMenuItem("instagram")
                        }
                        onMouseLeave={() =>
                          onHoverMenuItem && onHoverMenuItem(null)
                        }
                        style={{ color: "#a3a3a3" }}
                      >
                        Instagram
                      </a>
                      <a
                        href="mailto:contact@radioproject.live"
                        target="_blank"
                        className="icon-blink menu-item-glitch menu-link"
                        onClick={toggleMenu}
                        onMouseEnter={() =>
                          onHoverMenuItem && onHoverMenuItem("contact")
                        }
                        onMouseLeave={() =>
                          onHoverMenuItem && onHoverMenuItem(null)
                        }
                        style={{ color: "#a3a3a3" }}
                      >
                        Contact
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Bookmark;
