import { useEffect, useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { AudioProvider } from "./AudioContext";
import { Header } from "./components/Header";
import SoundCloudPlayer from "./components/SoundcloudPlayer";
import { Guest } from "./pages/Guest";
import { Info } from "./pages/Info";
import { Landing } from "./pages/Landing";
import { Chat } from "./pages/Chat";
import { Article } from "./pages/Article";
import RPHead, { RPGrid } from "./pages/rphead";
import { DynamicTitle } from "./utils/useDynamicTitle";

import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/theme";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileIndex] = useState(0);
  const [playingGuest, setPlayingGuest] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [hasSetUser, setHasSetUser] = useState(false);
  const [headerOpen, setHeaderOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <HashRouter>
        <DynamicTitle />
        {/* {isMobile && <div className={"gradient-overlay-tl"} />} */}
        <Header
          isMobile={isMobile}
          isPlaying={playingGuest}
          headerOpen={headerOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        {/* {!isMobile && (
          <a
            style={{
              position: "fixed",

              cursor: "pointer",
              zIndex: "99999999999",
              fontSize: "2.5vh",
            }}
            onClick={() => setDarkMode((prev) => !prev)}
          >
            ⏼
          </a>
        )} */}
        {playingGuest && (
          <AudioProvider>
            <SoundCloudPlayer
              playingGuest={playingGuest}
              isMobile={isMobile}
              darkMode={darkMode}
            />
          </AudioProvider>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <Landing
                selectedIndex={null}
                isMobile={isMobile}
                mobileIndex={mobileIndex}
              />
            }
          />
          <Route
            path="/rp/:guestName"
            element={
              <Guest
                isMobile={isMobile}
                setPlayingGuest={setPlayingGuest}
                isPlaying={playingGuest}
                darkMode={darkMode}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <Chat
                isMobile={isMobile}
                playingGuest={playingGuest}
                setChatUser={setChatUser}
                chatUser={chatUser}
                hasSetUser={hasSetUser}
                setHasSetUser={setHasSetUser}
              />
            }
          />
          <Route path="/about" element={<Info isMobile={isMobile} />} />
          <Route
            path="/rg/:articleName"
            element={
              <Article
                isMobile={isMobile}
                isPlaying={playingGuest}
                darkMode={darkMode}
              />
            }
          />
          <Route path="/visitorlog" element={<RPHead isMobile={isMobile} />} />
          <Route
            path="/visitorcheck"
            element={
              <RPGrid
                darkMode={darkMode}
                isPlaying={playingGuest}
                isMobile={isMobile}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
