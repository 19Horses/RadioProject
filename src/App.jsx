import "./App.css";
import { AudioProvider } from "./AudioContext";
import ClosedPage from "./closedPage";
import { useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

function App() {
  useEffect(() => {
    const updateBodyHeight = () => {
      document.body.style.height = `${window.innerHeight}px`;
    };

    updateBodyHeight();
    window.addEventListener("resize", updateBodyHeight);

    return () => window.removeEventListener("resize", updateBodyHeight);
  }, []);
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ClosedPage />} />
        <Route path="/rp1-ubi" element={<ClosedPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
