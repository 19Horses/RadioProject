import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ClosedPage from "./closedPage";

function App() {
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
