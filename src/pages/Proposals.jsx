import React, { useMemo } from "react";
import { djs as items } from "./items";
import "./Proposals.css";

export const Proposals = ({ isMobile }) => {
  // Filter items same as landing page
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (item.dontShow === true) return false;
        if (item.type === "mix" || item.type === "radiogram") return true;
        return false;
      })
      .reverse();
  }, []);

  return (
    <div className="proposals-container">
      {/* Infinite Auto-scrolling Carousel */}
      <div className="proposals-carousel-wrapper">
        <div className="proposals-carousel">
          {/* Triple items for seamless infinite scroll */}
          {[...filteredItems, ...filteredItems, ...filteredItems].map(
            (item, index) => (
              <div
                key={`${item.id || index}-${index}`}
                className="proposals-carousel-item"
              >
                <img
                  src={item.src3 || item.ipSrc || item.src}
                  alt={item.title}
                  loading="eager"
                />
              </div>
            ),
          )}
        </div>
      </div>

      <div
        className="proposals-content"
        style={{ width: isMobile ? "80%" : "60%" }}
      >
        <h1>Proposals</h1>
        <p>
          Thank you for your interest in collaborating with us. We’re always
          happy to discuss opportunities to participate in RADIO Project.
        </p>
        <p>
          You’re welcome to:
          <br />→ Contribute an article for our{" "}
          <span style={{ fontFamily: "NeueHaasDisplayMedium" }}>
            RADIOGRAMS,
          </span>{" "}
          or... <br />→ Contribute a DJ Mix for our{" "}
          <span style={{ fontFamily: "NeueHaasDisplayMedium" }}>
            TRANSMISSIONS.
          </span>
        </p>
        <p>
          For{" "}
          <span style={{ fontFamily: "NeueHaasDisplayMedium" }}>
            RADIOGRAMS...
          </span>
          <br />
          Please send us your article proposal and contact information via email
          to{" "}
          <a href="mailto:contact@radioproject.live">
            contact@radioproject.live
          </a>
          .
        </p>
        <p>
          For{" "}
          <span style={{ fontFamily: "NeueHaasDisplayMedium" }}>
            TRANSMISSIONS...
          </span>
          <br />
          Please send us your DJ mix proposal and contact information via email
          to{" "}
          <a href="mailto:contact@radioproject.live">
            contact@radioproject.live
          </a>
          .
        </p>
        <p>
          Best,
          <br />
          Elisha,{" "}
          <span style={{ color: "#acacac" }}>
            RADIO Project HEAD.
            <br />
            Start the conversation!
          </span>
        </p>
      </div>
    </div>
  );
};
