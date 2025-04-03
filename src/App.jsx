import "./App.css";
import { AudioProvider } from "./AudioContext";
import ClosedPage from "./closedPage";
import { HashRouter, Route, Routes } from "react-router-dom";

function App() {
  console.log("hey");
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
