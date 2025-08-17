import React, { useState } from "react";

export const Tracklist = ({ selectedGuest, darkMode }) => {
  const [hoveredTitle, setHoveredTitle] = useState("");
  return (
    <div
      className="tracklist-container__desktop"
      style={{ filter: darkMode ? "invert(1)" : "none" }}
    >
      <table className="tracklist-table__desktop">
        {selectedGuest.tracklist.map((mixTrack, index) => (
          <React.Fragment key={index}>
            {mixTrack.title === "RADIO (a)" ||
            mixTrack.title === "PROJECT" ||
            mixTrack.title === "RADIO (b)" ? (
              <tr className="tracklist-header-spacer__desktop"></tr>
            ) : null}
            <tr
              className="tracklist-item__desktop"
              style={{
                animationDelay: `${index * 0.0375}s`,
              }}
              onMouseEnter={() => {
                setHoveredTitle(mixTrack.title);
              }}
              onMouseLeave={() => setHoveredTitle("")}
            >
              <td
                className="tracklist-item-title__desktop"
                style={{
                  transition: "color 0.3s",

                  color:
                    hoveredTitle === mixTrack?.title &&
                    mixTrack?.title !== "UNRELEASED"
                      ? darkMode
                        ? "rgb(0, 255, 165)"
                        : "rgb(255, 0, 90)"
                      : "black",
                }}
              >
                <b
                  style={{
                    backgroundColor:
                      mixTrack?.title === "UNRELEASED" ? "black" : "",
                    fontWeight: mixTrack?.artist === "" ? "100" : "",
                    fontFamily:
                      mixTrack.title === "RADIO (a)" ||
                      mixTrack.title === "PROJECT" ||
                      mixTrack.title === "RADIO (b)"
                        ? "dot"
                        : "",
                    fontSize:
                      mixTrack.title === "RADIO (a)" ||
                      mixTrack.title === "PROJECT" ||
                      mixTrack.title === "RADIO (b)"
                        ? "1.7vh"
                        : "",
                  }}
                >
                  {mixTrack.title}
                </b>
              </td>
              <td
                style={{
                  transition: "color 0.3s",
                  color:
                    hoveredTitle === mixTrack?.title &&
                    mixTrack?.title !== "UNRELEASED"
                      ? darkMode
                        ? "rgb(0, 255, 166)"
                        : "rgb(255, 0, 90)"
                      : "rgb(137, 137, 137)",
                  fontWeight: "100",
                }}
              >
                {mixTrack.artist}
              </td>
            </tr>
          </React.Fragment>
        ))}
      </table>
    </div>
  );
};
