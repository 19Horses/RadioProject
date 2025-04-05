import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { writers as items2 } from "./articles";

export const Article = ({ isMobile }) => {
  const { articleName } = useParams();

  const articleSelected = items2.find((article) => article.url === articleName);
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
      {/* Selected Article */}
      {articleSelected != null && (
        <>
          {!isMobile ? (
            <div className="article-content__desktop">
              <p
                className="article-content-text__desktop"
                dangerouslySetInnerHTML={{
                  __html: articleSelected?.description,
                }}
              />
            </div>
          ) : null}
          <div
            className={` ${
              isMobile
                ? "mobile-article-container"
                : "selected-article-container"
            }`}
          >
            <div className="description-container">
              <p className="description-header" style={{ fontSize: "3.7vh" }}>
                <span
                  style={{
                    fontFamily: "Helvetica",
                    fontWeight: "100",
                  }}
                >
                  {articleSelected?.rpCount}
                </span>{" "}
                <span
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    padding: "2px 5px", // Optional for better visibility
                  }}
                >
                  <b>{articleSelected?.title2}</b>
                </span>
              </p>
            </div>

            <div className="artist-pics">
              <a target="_blank">
                <img
                  src={articleSelected?.src}
                  className="selected-artist-image"
                />
              </a>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "2vh",
              }}
            >
              {" "}
              <div>
                <p className="slight-info" style={{ fontSize: "1.2vh" }}>
                  <a
                    style={{
                      fontWeight: "100",
                      fontSize: "2vh",
                      lineHeight: "1.5",
                      textDecoration: "none",
                      cursor: "pointer",
                      color: "black",
                    }}
                    href={articleSelected?.igLink}
                    target="_blank"
                  >
                    <b>{articleSelected.title}</b>
                  </a>
                  <br />
                  <span
                    style={{
                      fontWeight: "100",
                    }}
                  >
                    {articleSelected?.releaseDate}
                  </span>
                  <br />
                  <span
                    style={{
                      fontWeight: "100",
                    }}
                  >
                    {articleSelected?.length}
                  </span>
                </p>
              </div>
              <div className="article-tag__mobile">
                <p className="article-tag-text__mobile">
                  {articleSelected?.tag}
                </p>
              </div>
              <div className="article-socials__desktop">
                <a href={articleSelected?.igLink} target="_blank">
                  <img src="/ig.jpg" className="sc-logo" />
                </a>
              </div>
            </div>
            {isMobile ? (
              <>
                <p
                  className="article-content-text__mobile"
                  dangerouslySetInnerHTML={{
                    __html: articleSelected?.description,
                  }}
                />
              </>
            ) : null}
          </div>
        </>
      )}
    </>
  );
};
