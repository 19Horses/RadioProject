import React, { useState } from "react";

export const Tracklist = ({ selectedGuest }) => {
  const [hoveredTitle, setHoveredTitle] = useState("");
  return (
    <div className="tracklist-container__desktop">
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
                      ? "rgb(255, 0, 90)"
                      : "black",
                }}
              >
                <b
                  style={{
                    backgroundColor:
                      mixTrack?.title === "UNRELEASED" ? "black" : "",
                    fontWeight: mixTrack?.artist === "" ? "100" : "",
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
                      ? "rgb(88, 88, 88)"
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
