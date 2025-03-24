import "./App.css";
import ClosedPage from "./closedPage";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Router
        future={{
          v7_startTransition: true,
        }}
      >
        <Routes key={location.pathname}>
          <Route path="*" exact element={<ClosedPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
