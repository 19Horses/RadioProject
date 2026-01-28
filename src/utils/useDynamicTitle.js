import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { djs } from "../pages/items";

export function DynamicTitle() {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    // Static pages
    const staticTitles = {
      "/": "RADIO Project",
      "/visitorlog": "Visitor Log | RADIO Project",
      "/visitorcheck": "Visitor Check | RADIO Project",
      "/proposals": "Proposals | RADIO Project",
    };

    if (staticTitles[path]) {
      document.title = staticTitles[path];
      return;
    }

    // Dynamic pages - extract type and slug from path
    const mixMatch = path.match(/^\/mix\/(.+)$/);
    const articleMatch = path.match(/^\/article\/(.+)$/);

    if (mixMatch) {
      const slug = mixMatch[1];
      const item = djs.find((d) => d.url === slug && d.type === "mix");
      document.title = item
        ? `${item.title} | Listen on RADIO Project`
        : "RADIO Project";
      return;
    }

    if (articleMatch) {
      const slug = articleMatch[1];
      const item = djs.find((d) => d.url === slug && d.type === "radiogram");
      document.title = item
        ? `${item.title} | Read on RADIO Project`
        : "RADIO Project";
      return;
    }

    document.title = "RADIO Project";
  }, [path]);

  return null;
}
