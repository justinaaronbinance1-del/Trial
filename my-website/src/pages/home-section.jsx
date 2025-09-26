import React from "react";

import "../styles/home-section.css";

function HomeSection({ marginTop }) {
  return (
    <section id="home" className="home-section"
      style={{ marginTop: `${marginTop}px` }}>

      <div
        className="info-container"

      >
        <div className="first-container ">1st container</div>
        <div className="second-container ">
          <div className="first-stat-div">
            <div className="stat-box lg">Heart Rate</div>
            <div className="stat-box lg">Activity</div>
            <div className="stat-box lg">Anomally</div>
            <div className="stat-box lg">Device Battery</div>
            <div className="stat-box bold">78bpm</div>
            <div className="stat-box bold">Stationary</div>
            <div className="stat-box bold">
              <p className="rg">Warning</p></div>
            <div className="stat-box bold">85%</div>
          </div>

          <div className="second-stat-div">
            <div className="stat-box lg">Heart Rate</div>
            <div className="stat-box lg">Activity</div>
            <div className="stat-box lg">Anomally</div>
            <div className="stat-box lg">Device Battery</div>
            <div className="stat-box bold">78bpm</div>
            <div className="stat-box bold">Stationary</div>
            <div className="stat-box bold">warning</div>
            <div className="stat-box bold">85%</div>
          </div>
          <div className="graph-div">1st</div>
        </div>

      </div>
    </section>
  );
}
export default HomeSection;