import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function DynamicTitle() {
  const location = useLocation();
  const path = location.pathname; // ✅ This is what works with HashRouter

  useEffect(() => {
    const titleMap = {
      "/": "Archive | RADIO Project",
      "/visitorlog": "Visitor Log | RADIO Project",
      "/visitorcheck": "Visitor Check | RADIO Project",
      "/rp/ubi": "RP1 ♪ games that touch the arts | RADIO Project",
      "/rp/dvd": "RP2 ♪ BUILD! | RADIO Project",
      "/rp/bebeluna": "RP3 ♪ Ghost in the Shell | RADIO Project",
      "/rg/anouk" : "The Promise of Freedom in the Western Sphere | RADIO Project"
    };

    document.title = titleMap[path] || "RADIO Project";
  }, [path]);

  return null;
}
