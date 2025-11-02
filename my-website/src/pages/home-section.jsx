import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import "../styles/home-section.css";
import Icons from "./icon-collection";

function HomeSection() {

  const [time, settime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      settime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="home-section">

      <div
        className="info-container"

      >
        <div className="first-container ">
          <div className="time-date-info border-effect">
            <div className="date-label"><Icons.Calendar /> Date:</div>
            <div className="date-value">{time.format("MMMM D, YYYY")}</div>
            <div className="time-label"><Icons.Clock /> Time:</div>
            <div className="time-value">{time.format("hh:mm:ss A")}</div>
          </div>
          <div className="device-status border-effect">
            <p>Time of Reading: </p>
            <p>Timestamp display </p>

          </div>
          <div className="personal-info-1 border-effect"></div>

          <div className="personal-info-2 border-effect"></div>
        </div>



        <div className="second-container ">
          <div className="first-stat-div">
            <div className="stat-box lg">Heart Rate</div>
            <div className="stat-box lg">Activity</div>
            <div className="stat-box lg">Anomally</div>
            <div className="stat-box lg db">Device Status</div>
            <div className="stat-box bold">78bpm</div>
            <div className="stat-box bold">Stationary</div>
            <div className="stat-box bold">
              <p className="rg">Warning</p></div>
            <div className="stat-box bold">85%</div>
          </div>

          <div className="graph-div">
            <div className="waveform-text">Heartbeat (PPG) waveform</div>

          </div>
          <div className="second-stat-div">
            <div className="stat-box lg">Avg HR (24hr)</div>
            <div className="stat-box lg">Max HR</div>
            <div className="stat-box lg">Min HR</div>
            <div className="stat-box lg">Anomalies</div>
            <div className="stat-box bold">80bpm</div>
            <div className="stat-box bold">90bpm</div>
            <div className="stat-box bold">50bpm</div>
            <div className="stat-box bold">3</div>
          </div>
        </div>

      </div>
    </section>
  );
}
export default HomeSection;