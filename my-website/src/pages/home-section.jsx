import React from "react";

import "../styles/home-section.css";

function HomeSection({ marginTop }) {
  return (
    <section id="home" className="home-container"
      style={{ marginTop: `${marginTop}px` }}>

      <div
        className="info-container"

      >
        <div className="first-container all-container">1st container</div>
        <div className="second-container all-container">2nd container</div>

      </div>
    </section>
  );
}
export default HomeSection;