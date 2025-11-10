import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Textfit } from 'react-textfit';

import "../styles/home-section.css";
import Icons from "./icon-collection";
import SensorData from "./connection-backend";

function HomeSection() {

  const [time, settime] = useState(dayjs());
  const [sensorData, setSensorData] = useState(null);

  const {
    recorded_at = "-", ax = "-", ay = "-", az = "-", gx = "-", gy = "-", gz = "-", heart_rate = "-", spo2 = "-", predicted_activity = "-", stud_condition = "-", avg_heart_rate = "-", min_heart_rate = "-", max_heart_rate = "-", total_readings = "-"
  } = sensorData || {};

  useEffect(() => {
    const timer = setInterval(() => {
      settime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="home-section">

      <SensorData setParentData={setSensorData} />

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
            <Textfit mode="single" min={8} max={16}><p>Time of Reading:</p></Textfit>
            <Textfit mode="single" min={8} max={16}>  <p>{recorded_at}</p></Textfit>


          </div>
          <div className="sensor-info-1 border-effect" >
            <Textfit mode="single" min={8} max={16}><p>Motion Sensor</p></Textfit>
            <Textfit mode="single" min={8} max={16}><p>AX:{ax} AY:{ay} AZ:{az}</p></Textfit>
            <Textfit mode="single" min={8} max={16}><p>GX:{gx} GY:{gy} GZ:{gz}</p></Textfit>
          </div>

          <div className="sensor-info-1 border-effect">
            <Textfit mode="single" min={8} max={16}><p>Heart Rate & Oxygen Level</p></Textfit>
            <Textfit mode="single" min={8} max={16}><p>HR: {heart_rate} BPM</p></Textfit>
            <Textfit mode="single" min={8} max={16}><p>SPO2: {spo2} %</p></Textfit>
          </div>
        </div>



        <div className="second-container ">
          <div className="first-stat-div">
            <div className="stat-box lg">Heart Rate</div>
            <div className="stat-box lg">Activity</div>
            <div className="stat-box lg">Anomally</div>
            <div className="stat-box lg db">Device Status</div>
            <div className="stat-box bold">{heart_rate} BPM</div>
            <div className="stat-box bold">{predicted_activity}</div>
            <div className="stat-box bold">
              <p className="rg">{stud_condition}</p></div>
            <div className="stat-box bold">Connected</div>
          </div>

          <div className="graph-div">
            <div className="waveform-text">Heartbeat (PPG) waveform</div>

          </div>
          <div className="second-stat-div">
            <div className="stat-box lg">Avg HR (24hr)</div>
            <div className="stat-box lg">Max HR</div>
            <div className="stat-box lg">Min HR</div>
            <div className="stat-box lg">Anomalies</div>
            <div className="stat-box bold">{avg_heart_rate} BPM</div>
            <div className="stat-box bold">{max_heart_rate} BPM</div>
            <div className="stat-box bold">{min_heart_rate} BPM</div>
            <div className="stat-box bold">{total_readings}</div>
          </div>
        </div>

      </div>
    </section>
  );
}
export default HomeSection;