import React from "react";


import "../styles/intro-section.css";

import Icons from "./icon-collection";

function IntroSection() {
  return (
    <section id="Intro" className="intro-section">
      <div className="group-title">
        <h1 className="main-title">
          Iot Health & Activity Dashboard
        </h1>
        <h3 className="sub-title">
          Real-time student vitals & stress detection
        </h3>
      </div>

      <div className="cards">
        <div className="indiv-card">
          <h2> <Icons.Checklist />
            Project Overview</h2>
          <p>A web-based system that monitors students’ vital signs and activity. Using MAX30102 and MPU6050 sensors with
            ESP32, data is analyzed by AI to detect stress or fatigue patterns.</p>
        </div>
        <div className="indiv-card">
          <h2><Icons.Wrench /> How it Works</h2>
          <p>Heart rate and motion data → Sent via ESP32 → Processed by Isolation Forest AI → Displayed live and
            historically on an interactive dashboard.</p>
        </div>
        <div className="indiv-card">
          <h2><Icons.Target />Purpose</h2>
          <p>Help students monitor stress, fatigue, and activity patterns for better wellness and
            productivity.</p>
        </div>
        <div className="indiv-card">
          <h2><Icons.Lightbulb /> Key Features</h2>
          <p>Real-time data visualization, historical trends, AI-powered alerts, and easy-to-understand dashboards that
            support proactive student health management.</p>
        </div>
      </div>
    </section>


  );
}
export default IntroSection;