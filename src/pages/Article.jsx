import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { djs } from "./items";

export const Article = ({ isMobile, isPlaying }) => {
  const { articleName } = useParams();

  const articleSelected = djs.find((article) => article.url === articleName);

  const [atTop, setAtTop] = useState(true);

  const [fadeIn, setFadeIn] = useState(false);
  const [allowScrollFade, setAllowScrollFade] = useState(false);

  useEffect(() => {
    const fadeTimeout = setTimeout(() => {
      setFadeIn(true);
      // enable scroll-based fading after fade-in finishes (1s = transition duration)
      setTimeout(() => setAllowScrollFade(true), 1000);
    }, 50); // initial trigger delay to apply opacity: 0

    return () => clearTimeout(fadeTimeout);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Selected Article */}
      {articleSelected != null && !isMobile && (
        <>
          <div className="article-content__desktop">
            <p
              className="article-content-text__desktop"
              dangerouslySetInnerHTML={{
                __html: articleSelected?.description,
              }}
            />
          </div>
          <div
            className="article-info-container"
            style={{
              transition: "opacity 1s ease-in-out",
            }}
          >
            <div
              className="selected-article-container"
              style={{
                opacity: fadeIn ? 1 : 0,
                bottom: atTop ? "65.5vh" : "8vh",
                transition: "bottom 1.5s, opacity 0.5s",
                transitionDelay: ".3s",
              }}
            >
              <a
                target="_blank"
                href={articleSelected?.igLink}
                style={{ bottom: "0" }}
              >
                <img
                  src={articleSelected?.src2}
                  style={{ height: "19vh", width: "19vh", objectFit: "cover" }}
                />
              </a>
              <div className="">
                <div style={{ fontSize: "2.7vh", lineHeight: "3vh" }}>
                  <span
                    style={{
                      fontFamily: "Helvetica",
                      fontWeight: "100",
                      padding: "2px 5px", // Optional for better visibility
                    }}
                  >
                    {articleSelected?.rpCount}
                  </span>
                  {<br />}
                  <span
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      padding: "2px 5px", // Optional for better visibility
                    }}
                  >
                    <b>{articleSelected?.title}</b>
                  </span>
                </div>
                <a
                  href={articleSelected?.igLink}
                  target="_blank"
                  style={{
                    fontWeight: "1000",
                    color: "black",
                    textDecoration: "none",
                    lineHeight: "4vh",
                  }}
                >
                  {articleSelected?.title2}
                </a>
                <br />
                <br />
                <div
                  style={{
                    transition: "opacity 0.5s",
                    fontSize: "1.7vh",
                    lineHeight: "2vh",
                    opacity: atTop ? 1 : 0,
                  }}
                >
                  <p style={{ margin: "0" }}>{articleSelected?.tag}</p>

                  <p style={{ margin: "0" }}>
                    {articleSelected?.broadcastDate +
                      " | " +
                      articleSelected?.length}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="article-summary"
              style={{
                position: "fixed",
                top: "35vh",
                left: "3vw",
                width: "28vw",
                fontFamily: "Helvetica",
                opacity: fadeIn ? (atTop ? 1 : 0) : 0,
                transition: fadeIn
                  ? atTop
                    ? "opacity 0.7s"
                    : "opacity 0.3s"
                  : "opacity 0.3s",
                fontSize: "2vh",
                backgroundColor: atTop ? "rgb(247, 247, 247)" : "transparent",
                transitionDelay: !fadeIn
                  ? "0s"
                  : allowScrollFade
                  ? atTop
                    ? "1.4s"
                    : "0s"
                  : ".3s", // default to visible until scroll fade kicks in
              }}
            >
              <p>{articleSelected?.summary}</p>
            </div>
          </div>
        </>
      )}
      {articleSelected && isMobile ? (
        <div>
          <div className="article-content-text__mobile">
            <div
              className="selected-article-container-mob"
              style={{
                transition: "bottom 1.5s, opacity 0.5s",
                transitionDelay: ".3s",
                width: isPlaying != null ? "90%" : "",
              }}
            >
              <a
                target="_blank"
                href={articleSelected?.igLink}
                style={{ bottom: "0" }}
              >
                <img
                  src={articleSelected?.src2}
                  style={{
                    height: "28vw",
                    width: "28vw",
                    objectFit: "cover",
                    paddingLeft: "2vw",
                  }}
                />
              </a>
              <div style={{ paddingLeft: "3vw" }}>
                <div
                  style={{
                    fontSize: "4.5vw",
                    lineHeight: "6.2vw",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Helvetica",
                      fontWeight: "100",
                    }}
                  >
                    {articleSelected?.rpCount}
                  </span>
                  <br />
                  <span
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      padding: "2px 5px", // Optional for better visibility
                    }}
                  >
                    <b>{articleSelected?.title}</b>
                  </span>
                </div>
                <a
                  href={articleSelected?.igLink}
                  target="_blank"
                  style={{
                    fontWeight: "1000",
                    color: "black",
                    textDecoration: "none",
                    lineHeight: "4vh",
                    fontSize: "4vw",
                  }}
                >
                  {articleSelected?.title2}
                </a>
                <br />
                <br />
                <div
                  style={{
                    fontSize: "3vw",
                    lineHeight: "4vw",
                  }}
                >
                  <p style={{ margin: "0" }}>{articleSelected?.tag}</p>

                  <p style={{ margin: "0" }}>
                    {articleSelected?.broadcastDate +
                      " | " +
                      articleSelected?.length}
                  </p>
                </div>
              </div>
            </div>
            <p
              className="article-content-description__mobile"
              style={{
                fontFamily: "Helvetica",
                fontSize: "5vw",
                width: isPlaying != null ? "90%" : "92%",
                marginLeft: "3vw",
                paddingBottom: isPlaying != null ? "20px" : "10px",
              }}
              dangerouslySetInnerHTML={{
                __html: articleSelected?.description,
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};
