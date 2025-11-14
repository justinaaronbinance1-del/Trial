import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Textfit } from 'react-textfit';

import "../styles/home-section.css";
import SensorData from "./connection-backend";

function HomeSection() {


  const [sensorData, setSensorData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState("");


  const handleChange = (e) => {
    setInputValue(e.target.value); // Update state when input changes
  };

  const handleClick = async () => {
    if (!inputValue.trim()) return alert("Please enter a username!");

    const formData = new FormData();
    formData.append("username", inputValue.trim());

    try {
      const response = await fetch("http://localhost:8000/register_user", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log("Register user result: ", result);

      if (result.status.toLowerCase() === "success") {
        alert(result.message);
        setUsername(result.username); // pass this to SensorData
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("Failed to register user.");
    }
    setInputValue("");
  };

  const {
    recorded_at = "--", ax = "--", ay = "--", az = "--", gx = "--", gy = "--", gz = "--", heart_rate = "--", spo2 = "--", predicted_activity = "--", stud_condition = "--", avg_heart_rate = "--", min_heart_rate = "--", max_heart_rate = "--", total_readings = "--", device_status = "Disconnected"
  } = sensorData || {};

  const timestamp = recorded_at;
  const readableTime = dayjs(timestamp).format("MMM. D, YYYY | h:mmA");

  function studentCondition(condition) {
    let message;

    if (condition === "Normal") {
      return "Normal";
    } else if (condition === "No valid heart rate!") {
      return "Not Valid!";
    } else if (!condition || condition === "--") {
      return "--"

    } else {
      return "Anomally!"
    }
  }

  let condition_of_student = studentCondition(stud_condition);

  const statusColor = device_status === "Connected" ? "green" : "red";

  return (
    <section id="home" className="home-section">
      {
        username && (

          <SensorData
            username={username}
            setLatestData={setSensorData} />
        )}

      <div
        className="info-container"

      >
        <div className="first-container ">
          <div className="user-and-button">
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="Type your name..."
            />
            <button onClick={handleClick}>Submit</button>
          </div>

          <div className="device-status border-effect">
            <Textfit mode="single" min={8} max={16}><p style={{ display: "flex", alignItems: "center", gap: "8px", color: "white" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: statusColor, display: "inline-block", }}></span>Device: <span style={{ color: statusColor }}>{device_status}</span></p></Textfit>
            <Textfit mode="single" min={8} max={16}>  <p>User: {username}</p></Textfit>


          </div>

          <div className="sensor-info-1 border-effect">
            <Textfit mode="single" min={8} max={16}><p>Time of Reading: </p></Textfit>
            <Textfit mode="single" min={8} max={16}><p>{recorded_at}</p></Textfit>

          </div>

          <div className="sensor-info-1 border-effect" >
            <Textfit mode="single" min={8} max={16}><p>Motion Sensor</p></Textfit>
            <Textfit mode="single" min={8} max={16}><p>AX:{ax} | AY:{ay} | AZ:{az}</p></Textfit>
            <Textfit mode="single" min={8} max={16}><p>GX:{gx} | GY:{gy} | GZ:{gz}</p></Textfit>
          </div>


        </div>



        <div className="second-container ">
          <div className="first-stat-div">
            <div className="stat-box lg">Heart Rate</div>
            <div className="stat-box lg">Activity</div>
            <div className="stat-box lg">Condition</div>
            <div className="stat-box lg db">Oxygen Level</div>
            <div className="stat-box bold">{heart_rate} BPM</div>
            <div className="stat-box bold">{predicted_activity}</div>
            <div className="stat-box bold">
              {condition_of_student}</div>
            <div className="stat-box bold">{spo2} %</div>
          </div>

          <div className="graph-div">
            <div className="waveform-text">Heartbeat (PPG) waveform</div>

          </div>
          <div className="second-stat-div">
            <div className="stat-box lg">Avg HR (24hr)</div>
            <div className="stat-box lg">Max HR</div>
            <div className="stat-box lg">Min HR</div>
            <div className="stat-box lg">Readings</div>
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