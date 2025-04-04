import { useEffect, useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { AudioProvider } from "./AudioContext";
import { Guest } from "./pages/Guest";
import Header from "./components/Header";
import { Info } from "./pages/Info";
import { Landing } from "./pages/Landing";
import SoundCloudPlayer from "./components/SoundcloudPlayer";

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
      <div className={"gradient-overlay-tl"} />
      <Header isMobile={isMobile} />
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
