import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useItems } from "../ItemsContext";

export function DynamicTitle() {
  const location = useLocation();
  const path = location.pathname;
  const djs = useItems();

  useEffect(() => {
    // Static pages
    const staticTitles = {
      "/": "RADIOproject",
      "/visitorlog": "Visitor Log | RADIOproject",
      "/visitorcheck": "Visitor Check | RADIOproject",
      "/proposals": "Proposals | RADIOproject",
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
        ? `${item.title} | Listen on RADIOproject`
        : "RADIOproject";
      return;
    }

    if (articleMatch) {
      const slug = articleMatch[1];
      const item = djs.find((d) => d.url === slug && d.type === "radiogram");
      document.title = item
        ? `${item.title} | Read on RADIOproject`
        : "RADIOproject";
      return;
    }

    document.title = "RADIOproject";
  }, [path, djs]);

  return null;
}
