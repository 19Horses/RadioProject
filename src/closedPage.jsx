import React, { useEffect, useMemo, useState } from "react";
import { Article } from "./Article.jsx";
import { AudioProvider } from "./AudioContext.jsx";
import { Guest } from "./Guest.jsx";
import Header from "./header";
import { Info } from "./Info.jsx";
import { djs as items } from "./items.js";
import { Landing } from "./Landing.jsx";
import { Logo } from "./Logo.jsx";
import SoundCloudPlayer from "./SoundcloudPlayer.jsx";

export default function ClosedPage() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [playingGuest, setPlayingGuest] = useState(null);

  const selectedGuest = useMemo(() => {
    if (selectedIndex !== null) {
      return items[selectedIndex];
    } else {
      return null;
    }
  }, [selectedIndex]);

  const [infoSelected, setInfoSelected] = useState(false);
  const [articleHeaderSelected, setarticleHeaderSelected] = useState(false);
  const [articleSelected, setArticleSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileIndex] = useState(0);

  const resetInfo = () => {
    setSelectedIndex(null);
    setArticleSelected(null);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("articleFadeIn");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("p:not(red)");
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  });

  return (
    <>
      <div className={"gradient-overlay-tl"} />
      {playingGuest && (
        <AudioProvider>
          <SoundCloudPlayer playingGuest={playingGuest} />
        </AudioProvider>
      )}
      <Header
        onInfoClick={() => {
          setInfoSelected(true);
          resetInfo();
          setarticleHeaderSelected(false);
          setArticleSelected(null);
          scrollToTop();
        }}
        onArticleClick={() => {
          setInfoSelected(false);
          setarticleHeaderSelected(true);
          setArticleSelected(null);
          resetInfo();
          scrollToTop();
        }}
        onRadioClick={() => {
          setInfoSelected(false);
          setSelectedIndex(null);
          setarticleHeaderSelected(false);
          setArticleSelected(null);
          scrollToTop();
        }}
      />
      <Logo
        onClick={() => {
          resetInfo();
          setInfoSelected(false);
        }}
        isMobile={isMobile}
      />
      {!infoSelected && !articleHeaderSelected && (
        <Landing
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          isMobile={isMobile}
          mobileIndex={mobileIndex}
        />
      )}
      {infoSelected && <Info isMobile={isMobile} />}
      {selectedIndex != null && (
        <Guest
          isMobile={isMobile}
          selectedGuest={selectedGuest}
          setPlayingGuest={setPlayingGuest}
        />
      )}
      <Article
        articleHeaderSelected={articleHeaderSelected}
        articleSelected={articleSelected}
        isMobile={isMobile}
        setArticleSelected={setArticleSelected}
        scrollToTop={scrollToTop}
        resetInfo={resetInfo}
      />
    </>
  );
}
