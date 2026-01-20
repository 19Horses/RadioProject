import { useEffect, useState, useRef, useCallback } from "react";
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import "./styles/pageTransitions.css";
import { AudioProvider } from "./AudioContext";
import { Header } from "./components/ui/Header";
import SoundCloudPlayer from "./components/player/SoundcloudPlayer";
import { Guest } from "./pages/Guest";
import { Info } from "./pages/Info";
import { LandingVertical } from "./pages/LandingVertical";
import { Chat } from "./pages/Chat";
import { Article } from "./pages/Article";
import RPHead, { RPGrid } from "./pages/rphead";
import { DynamicTitle } from "./utils/useDynamicTitle";

import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/theme";
import Bookmark from "./components/bookmark/Bookmark";
import SymmetricalPattern from "./components/ui/SymmetricalPattern";
import PageTransition from "./components/ui/PageTransition";
import { CornerFrames } from "./components/ui/CornerFrames";
import { OnlineCount } from "./components/ui/OnlineCount";
import { useOnlineUsers } from "./utils/useOnlineUsers";

// Random sentences for eye click
const SENTENCES = ["static holds its own language"];

// Component to handle routes with animations
function RoutesWithAnimation({ mobileMenuOpen, setMobileMenuOpen, ...props }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <LandingVertical
                selectedIndex={null}
                isMobile={props.isMobile}
                mobileIndex={props.mobileIndex}
              />
            </PageTransition>
          }
        />
        <Route
          path="/mix/:guestName"
          element={
            <PageTransition>
              <Guest
                isMobile={props.isMobile}
                setCurrentArticle={props.setCurrentArticle}
                playingGuest={props.playingGuest}
                setPlayingGuest={props.setPlayingGuest}
              />
            </PageTransition>
          }
        />
        <Route
          path="/chat"
          element={
            <PageTransition>
              <Chat
                isMobile={props.isMobile}
                playingGuest={props.playingGuest}
                setChatUser={props.setChatUser}
                chatUser={props.chatUser}
                hasSetUser={props.hasSetUser}
                setHasSetUser={props.setHasSetUser}
              />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <Info isMobile={props.isMobile} />
            </PageTransition>
          }
        />
        <Route
          path="/article/:articleName"
          element={
            <PageTransition>
              <Article
                isMobile={props.isMobile}
                isPlaying={props.playingGuest}
                darkMode={props.darkMode}
                setCurrentArticle={props.setCurrentArticle}
                setScrollPercentage={props.setScrollPercentage}
              />
            </PageTransition>
          }
        />
        <Route
          path="/visitorlog"
          element={
            <PageTransition>
              <RPGrid
                darkMode={props.darkMode}
                isPlaying={props.playingGuest}
                isMobile={props.isMobile}
                selectedQuestion={props.selectedQuestion}
                setSelectedQuestion={props.setSelectedQuestion}
              />
            </PageTransition>
          }
        />
        <Route
          path="/visitorcheck"
          element={
            <PageTransition>
              <RPHead
                darkMode={props.darkMode}
                isPlaying={props.playingGuest}
                isMobile={props.isMobile}
              />
            </PageTransition>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileIndex] = useState(0);
  const [playingGuest, setPlayingGuest] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [hasSetUser, setHasSetUser] = useState(false);
  const [_headerOpen, _setHeaderOpen] = useState(false);
  const [darkMode, _setDarkMode] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lerpedPos, setLerpedPos] = useState({ x: 0, y: 0 });
  const [lerpedTextPos, setLerpedTextPos] = useState({ x: 0, y: 0 });
  const [_patternSize, setPatternSize] = useState(window.innerHeight * 0.6);
  const [eyeSymbol, setEyeSymbol] = useState("+");
  const [randomSentence, setRandomSentence] = useState("");
  const [displayedSentence, setDisplayedSentence] = useState("");
  const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const blinkTimeoutRefs = useRef([]);
  const typewriterTimeoutRef = useRef(null);
  const onlineCount = useOnlineUsers();

  // Handle eye symbol click
  const handleEyeClick = useCallback(() => {
    // Clear any existing typewriter effect
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }

    // Get a random sentence
    const sentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    setRandomSentence(sentence);
    setDisplayedSentence(""); // Reset displayed text

    // Typewriter effect
    let index = 0;
    const typeNextLetter = () => {
      if (index < sentence.length) {
        setDisplayedSentence(sentence.slice(0, index + 1));
        index++;
        typewriterTimeoutRef.current = setTimeout(typeNextLetter, 50);
      } else {
        // Fade out after 3 seconds
        typewriterTimeoutRef.current = setTimeout(() => {
          setRandomSentence("");
          setDisplayedSentence("");
        }, 3000);
      }
    };
    typeNextLetter();
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setPatternSize(window.innerHeight * 0.7); // Update pattern size to 70vh
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let frameId = null;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;

      // Use requestAnimationFrame to throttle updates
      if (!frameId) {
        frameId = requestAnimationFrame(() => {
          setMousePos({ x: lastX, y: lastY });
          frameId = null;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Lerp the position for smooth following
  useEffect(() => {
    let animationId;

    const lerp = (start, end, factor) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      setLerpedPos((prev) => ({
        x: lerp(prev.x, mousePos.x, 0.02), // 0.02 = 2% lerp per frame for smoother motion
        y: lerp(prev.y, mousePos.y, 0.02),
      }));
      // Different lerp amount for text (slower for more lag effect)
      setLerpedTextPos((prev) => ({
        x: lerp(prev.x, mousePos.x, 0.015), // Slower lerp for text
        y: lerp(prev.y, mousePos.y, 0.015),
      }));

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mousePos]);

  // Change symbol based on what's being hovered
  useEffect(() => {
    // Clear any ongoing blink timeouts when hovering
    if (hoveredMenuItem) {
      blinkTimeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      blinkTimeoutRefs.current = [];
    }

    const symbolMap = {
      home: "!",
      homeMenu: "#",
      visitorLog: ")<v>(",
      archive: ".[a].",
      nina: ".*n*.",
      soundcloud: "c(o)c",
      instagram: "[*O*]",
      contact: "|-|",
    };

    setEyeSymbol(symbolMap[hoveredMenuItem] || "+");
  }, [hoveredMenuItem]);

  // Eye blink effect - randomly switch between + and −
  useEffect(() => {
    if (hoveredMenuItem) return; // Don't start blinking if hovering

    const blinkInterval = setInterval(() => {
      // Random chance to blink (30% chance every interval)
      if (Math.random() < 0.3) {
        blinkTimeoutRefs.current[0] = setTimeout(() => setEyeSymbol("−"), 300);
        blinkTimeoutRefs.current[1] = setTimeout(() => setEyeSymbol("+"), 450);
        blinkTimeoutRefs.current[2] = setTimeout(() => setEyeSymbol("−"), 600);
        blinkTimeoutRefs.current[3] = setTimeout(() => setEyeSymbol("+"), 750);
      }
    }, 2000); // Check every 2 seconds

    return () => {
      clearInterval(blinkInterval);
      blinkTimeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      blinkTimeoutRefs.current = [];
    };
  }, [hoveredMenuItem]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <HashRouter>
        <DynamicTitle />

        {/* Online visitor counter */}
        <OnlineCount onlineCount={onlineCount} isMobile={isMobile} />
        <CornerFrames />

        <AudioProvider>
          <Bookmark
            setMobileMenuOpen={setMobileMenuOpen}
            currentArticle={currentArticle}
            onHoverMenuItem={setHoveredMenuItem}
            scrollPercentage={scrollPercentage}
            setPlayingGuest={setPlayingGuest}
            playingGuest={playingGuest}
            isMobile={isMobile}
            chatUser={chatUser}
            setChatUser={setChatUser}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
          />
          {playingGuest && (
            <SoundCloudPlayer
              playingGuest={playingGuest}
              isMobile={isMobile}
              darkMode={darkMode}
            />
          )}
          <RoutesWithAnimation
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          lerpedPos={lerpedPos}
          lerpedTextPos={lerpedTextPos}
          eyeSymbol={eyeSymbol}
          handleEyeClick={handleEyeClick}
          randomSentence={randomSentence}
          displayedSentence={displayedSentence}
          isMobile={isMobile}
          mobileIndex={mobileIndex}
          setCurrentArticle={setCurrentArticle}
          playingGuest={playingGuest}
          setPlayingGuest={setPlayingGuest}
          setChatUser={setChatUser}
          chatUser={chatUser}
          hasSetUser={hasSetUser}
          setHasSetUser={setHasSetUser}
          darkMode={darkMode}
          setScrollPercentage={setScrollPercentage}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
        </AudioProvider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
