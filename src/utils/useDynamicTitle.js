import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function DynamicTitle() {
  const location = useLocation();
  const path = location.pathname; // Works with BrowserRouter

  useEffect(() => {
    const titleMap = {
      "/": "RADIO Project",
      "/visitorlog": "Visitor Log | RADIO Project",
      "/visitorcheck": "Visitor Check | RADIO Project",
      "/mix/edenplus": "game arts | Listen on RADIO Project",
      "/mix/dvd": "BUILD! | Listen on RADIO Project",
      "/mix/bebeluna": "Ghost in the Shell | Listen on RADIO Project",
      "/article/anouk": "The Promise of Freedom in the Western Sphere | Read on RADIO Project",
      "/article/manny": "A Conversation with Manny | Read on RADIO Project"
    };

    document.title = titleMap[path] || "RADIO Project";
  }, [path]);

  return null;
}
