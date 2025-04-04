import { useEffect, useState } from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { AudioProvider } from "./AudioContext";
import { Guest } from "./Guest";
import Header from "./header";
import { Info } from "./Info";
import { Landing } from "./Landing";
import { Logo } from "./Logo";
import SoundCloudPlayer from "./SoundcloudPlayer";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileIndex] = useState(0);
  const [playingGuest, setPlayingGuest] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <HashRouter>
      <Header />
      <Logo isMobile={isMobile} />
      {playingGuest && (
        <AudioProvider>
          <SoundCloudPlayer playingGuest={playingGuest} />
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
        <Route path="/about" element={<Info isMobile={isMobile} />} />
        <Route
          path="/:guestName"
          element={
            <Guest isMobile={isMobile} setPlayingGuest={setPlayingGuest} />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
