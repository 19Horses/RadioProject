import React, { useState, useEffect } from "react";
import chevron from "../assets/chevron.png"; // Adjust the import path as necessary
import leftchevron from "../assets/left chevron.png"; // Adjust the import path as necessary

const starSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const StarSignStep = ({
  inputs,
  setInputs,
  step,
  setStep,
  handleNext,
  isMobile,
}) => {
  const [index, setIndex] = useState(0);
  const [showStarSignLabel, setShowStarSignLabel] = useState(true);

  const handleClickNext = (e) => {
    e.preventDefault();

    if (step === 2) {
      setShowStarSignLabel(false);
      setTimeout(() => setStep(3), 200);
    }
  };

  useEffect(() => {
    const initialIndex = starSigns.findIndex(
      (sign) => sign === inputs.starsign
    );
    if (initialIndex !== -1) {
      setIndex(initialIndex);
    } else {
      setInputs((prev) => ({ ...prev, starsign: starSigns[0] }));
    }
  }, []);

  const handleLeft = () => {
    const newIndex = (index - 1 + starSigns.length) % starSigns.length;
    setIndex(newIndex);
    setInputs((prev) => ({ ...prev, starsign: starSigns[newIndex] }));
  };

  const handleRight = () => {
    const newIndex = (index + 1) % starSigns.length;
    setIndex(newIndex);
    setInputs((prev) => ({ ...prev, starsign: starSigns[newIndex] }));
  };

  // 🛑 If we're not on step 2, hide this component
  if (step !== 2) return null;

  return (
    <div
      style={{
        opacity: showStarSignLabel ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button
          type="button"
          onClick={handleLeft}
          aria-label="Previous Star Sign"
          style={{ paddingLeft: "0", width: isMobile ? "2vh" : "1.4vh" }}
        >
          <img
            style={{ width: isMobile ? "2vh" : "1.4vh" }}
            src={leftchevron}
          />
        </button>
        <div
          style={{
            fontFamily: "dot",
            textTransform: "uppercase",
            fontSize: isMobile ? "2vh" : "1.4vh",
            overflow: "hidden",
            width: "auto",
            textAlign: "center",
            paddingTop: isMobile ? "0" : ".2vh",
            fontWeight: "1000",
          }}
        >
          <span>&nbsp;{starSigns[index]}&nbsp;</span>
        </div>
        <button
          type="button"
          onClick={handleRight}
          aria-label="Nexr Star Sign"
          style={{ paddingLeft: "0", width: isMobile ? "2vh" : "1.4vh" }}
        >
          <img style={{ width: isMobile ? "2vh" : "1.4vh" }} src={chevron} />
        </button>
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}></div>
    </div>
  );
};

export default StarSignStep;
