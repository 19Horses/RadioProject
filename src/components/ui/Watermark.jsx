import React from "react";
import "./Watermark.css";

const Watermark = ({
  timeOnPage,
  mouseX,
  mouseY,
  tag,
  title,
  title2,
  title3,
  length,
  broadcastDay,
  broadcastMonth,
  broadcastYear,
  broadcastTime,
  broadcastDate,
  scrollPercentage = 0,
  onHoverChange,
}) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const formatLengthToMinutes = (timeString) => {
    if (!timeString) return "";

    // Parse MM:SS format
    const parts = timeString.split(":");
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);

      // Round to nearest minute
      const totalMinutes = Math.round(minutes + seconds / 60);

      return `${totalMinutes} Minute Read`;
    }

    return timeString; // Return original if format doesn't match
  };

  const calculateProgress = (timeString) => {
    if (!timeString) return 0;

    // Parse MM:SS format to get total seconds
    const parts = timeString.split(":");
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      const totalSeconds = minutes * 60 + seconds;

      // Calculate percentage
      const percentage = Math.min((timeOnPage / totalSeconds) * 100, 100);
      return percentage;
    }

    return 0;
  };

  const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear().toString().slice(-2);
    return `${month}/${year}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getCurrentYear = () => {
    const now = new Date();
    return now.getFullYear().toString();
  };

  return (
    <div
      className="watermark-container"
      onMouseEnter={() => onHoverChange && onHoverChange(true)}
      onMouseLeave={() => onHoverChange && onHoverChange(false)}
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        width: "45%",
        height: "auto",
        zIndex: 1000,
        fontFamily: "NeueHaasDisplayRoman",
        display: "flex",
        flexDirection: "column",
        gap: "1px",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: "7px",
            lineHeight: "1",
            position: "relative",
            bottom: "-4px",
            color: "#434a47",
          }}
        >
          {scrollPercentage.toFixed(0)}%
        </div>
        <div
          style={{
            fontSize: "10px",
            fontFamily: "NeueHaasDisplayMedium",
            textAlign: "right",
            color: "#434a47",
          }}
        >
          {formatLengthToMinutes(length)}
        </div>
      </div>
      {/* Scroll progress bar */}
      <div
        style={{
          width: "100%",
          height: "10px",
          backgroundColor: "#dfdfdf",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${scrollPercentage}%`,
            height: "100%",
            backgroundColor: "#FF337B",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "3px",
          alignItems: "center",
          top: "2px",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            lineHeight: "1",
            color: "#434a47",
            fontFamily: "Helvetica",
            fontWeight: "bold",
          }}
        >
          {broadcastMonth}/{broadcastYear}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1px",
            height: "100%",
          }}
        >
          <img src={"./timearrow.svg"} className="arrow-fade-1" />
          <img src={"./timearrow.svg"} className="arrow-fade-2" />
          <img src={"./timearrow.svg"} className="arrow-fade-3" />
        </div>
        <div
          style={{
            position: "relative",
            left: "-1px",
            fontSize: "13px",
            lineHeight: "1",
            color: "#434a47",
            fontFamily: "Helvetica",
            fontWeight: "bold",
          }}
        >
          {getCurrentDate()}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          position: "relative",
          top: "1px",
          flexDirection: "row",
          gap: "3px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "6px",
            lineHeight: "1",
            color: "#434a47",
            fontFamily: "Helvetica",
            letterSpacing: "-0.05em",
          }}
        >
          {broadcastTime}
        </div>

        {/* <div
          style={{
            position: "absolute",
            left: "15px",
            width: "33px",
            height: "1px",
            backgroundColor: "black",
          }}
        /> */}

        <div
          style={{
            position: "absolute",
            left: "50px",
            fontSize: "6px",
            lineHeight: "1",
            color: "#434a47",
            fontFamily: "Helvetica",
            letterSpacing: "-0.05em",
          }}
        >
          {getCurrentTime()}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "3px",
            position: "absolute",
            top: "1px",
            right: "0px",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              textAlign: "left",
              width: "16px",
              fontFamily: "NeueBit-Regular",
              color: "#434a47",
            }}
          >
            {mouseX}
          </div>
          <div
            style={{
              fontSize: "9px",
              textAlign: "right",
              width: "16px",
              fontFamily: "NeueBit-Regular",
              color: "#434a47",
            }}
          >
            {mouseY}
          </div>
        </div>
      </div>
      {/* <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "3px",
          position: "relative",
          top: "3px",
        }}
      >
        <img src={"./question.svg"} style={{ width: "12px", height: "auto" }} />
        <div
          style={{
            fontSize: "7px",
            lineHeight: ".9",
            color: "black",
            fontFamily: "NeueBit-Regular",
          }}
        >
          The article{" "}
          <span
            style={{ fontFamily: "PPNeueBit-Bold", textTransform: "uppercase" }}
          >
            {title}{" "}
          </span>
          related to{" "}
          <span
            style={{ fontFamily: "PPNeueBit-Bold", textTransform: "uppercase" }}
          >
            {tag}{" "}
          </span>
          was written by{" "}
          <span
            style={{ fontFamily: "PPNeueBit-Bold", textTransform: "uppercase" }}
          >
            {title3},{" "}
          </span>
          <span
            style={{ fontFamily: "PPNeueBit-Bold", textTransform: "uppercase" }}
          >
            {title2}
          </span>
        </div>
      </div> */}

      {/* <div>Mouse X: {mouseX}</div>
        <div>Mouse Y: {mouseY}</div>
        <div>Tag: {tag}</div>
        <div>Title2: {title2}</div>
        <div>Title3: {title3}</div>
        <div>Length: {length}</div> */}
    </div>
  );
};

export default Watermark;
