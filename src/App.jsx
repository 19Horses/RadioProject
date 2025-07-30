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

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileIndex] = useState(0);
  const [playingGuest, setPlayingGuest] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [hasSetUser, setHasSetUser] = useState(false);
  const [headerOpen, setHeaderOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <HashRouter>
      <div className={"gradient-overlay-tl"} />
      <Header
        isMobile={isMobile}
        isPlaying={playingGuest}
        headerOpen={headerOpen}
      />
      {playingGuest && (
        <AudioProvider>
          <SoundCloudPlayer playingGuest={playingGuest} isMobile={isMobile} />
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
          element={<Article isMobile={isMobile} isPlaying={playingGuest} />}
        />
        <Route path="/visitorlog" element={<RPHead isMobile={isMobile} />} />
        <Route
          path="/visitorcheck"
          element={<RPGrid isPlaying={playingGuest} isMobile={isMobile} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
