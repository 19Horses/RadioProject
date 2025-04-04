import React from "react";
import { writers as items2 } from "./articles";

export const Article = ({
  articleHeaderSelected,
  articleSelected,
  isMobile,
  setArticleSelected,
  scrollToTop,
  resetInfo,
}) => {
  return (
    <>
      {articleHeaderSelected && articleSelected === null && (
        <div
          className={` ${
            isMobile
              ? "selected-artist-container-mob-addon"
              : "selected-article-container_desktop"
          }`}
        >
          <div
            className="all-left-cont"
            style={{
              top: isMobile ? "10%" : "",
              width: "96%",
              height: "100%",
            }}
          >
            {items2.map((pic) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "2vh",
                    height: "9vh",
                  }}
                  onClick={() => {
                    setArticleSelected(pic);
                    scrollToTop();
                  }}
                >
                  <div
                    className="artist-pics"
                    style={{
                      height: "9vh",
                      width: "9vh",
                    }}
                  >
                    <a target="_blank">
                      <img
                        src={pic.src}
                        className="selected-artist-image"
                        style={{ width: "fit-content", flexShrink: "0" }}
                      />
                    </a>
                  </div>
                  <div style={{ width: "60%", paddingLeft: "1vh" }}>
                    <div className="slight-info" style={{ fontSize: "1vh" }}>
                      <a
                        style={{
                          fontWeight: "100",
                          fontSize: "1vh",
                          textDecoration: "none",
                          cursor: "pointer",
                          color: "black",
                          textTransform: "uppercase",
                        }}
                        target="_blank"
                      >
                        <b>{pic.title}</b>
                      </a>
                    </div>

                    <div
                      className={"scrolling-title-container-mob-article-addon"}
                      style={{ width: "100%" }}
                    >
                      <p>{pic.title2}</p>
                    </div>
                    <div
                      className={"scrolling-title-container-mob-article-addon"}
                      style={{ width: "100%", bottom: 0 }}
                    >
                      <p style={{ fontSize: ".8vh" }}>{pic.releaseDate}</p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "stretch", // Ensures child elements stretch to full height
                      border: "1px solid black",
                      paddingLeft: ".8vh",
                      paddingRight: ".8vh",
                      fontSize: ".8vh",
                      height: "25%",
                      margin: "auto",
                      marginRight: "0",
                      marginLeft: "0",
                      width: "15%",
                    }}
                  >
                    <p
                      style={{
                        textAlign: "center",
                        justifyContent: "center",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <b>{pic?.tag}</b>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
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
              <a onClick={() => resetInfo()} target="_blank">
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
