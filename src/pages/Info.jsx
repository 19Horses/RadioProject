import React from "react";

export const Info = ({ isMobile }) => (
  <div className={`info-container ${isMobile ? "info-mob-addon" : ""}`}>
    <p>
      <b>RADIO PROJECT</b> is a space for auditory, verbal and written agency.
    </p>
    <p>
      <b>RADIO PROJECT</b> aims to spotlight individuals by broadcasting mixes
      and conducting interviews, and to inform through written articles.
    </p>

    <a
      href="https://www.instagram.com/mkprote/"
      style={{
        color: "black",
        textDecoration: "none",
        fontSize: "2.2vh",
      }}
      target="_blank"
    >
      {" "}
      by <b>Elisha Olunaike</b>
    </a>
    <br />
    <br />
    <br />

    <a
      href="mailto:contact@radioproject.live"
      style={{ color: "black", textDecoration: "none" }}
      target="_blank"
    >
      Contact
    </a>
    {isMobile ? <div style={{ height: "5vh" }} /> : <></>}
  </div>
);
