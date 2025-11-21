import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

import "../styles/statistics-section.css";
import SensorData from "./connection-backend";
import PieChart from "../components/pie-chart";
import BarAndLineChart from "../components/bar-line-chart";
import LineChart from "../components/line-chart";


function StatisticsSection() {
  const now = dayjs();
  const formatNow = now.format("MMM DD, YYYY");


  const [dailyData, setDailyData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [latestData, setLatestData] = useState(null);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  }

  return (
    <section id="statistics" className="statistics-info-container">
      <SensorData username={selectedUser} setDailyData={setDailyData}
        setUserList={setUsers}
        setLatestData={setLatestData}
      />
      <h2>Activity & Health Statistics for {formatNow}</h2>
      <div className="drop-down-holder">
        <select className="drop-down" value={selectedUser} onChange={handleUserChange}>
          <option value="">Select A User</option>
          {users.map((user, idx) => (
            <option key={idx} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>
      <div className="charts-container">
        <div className="chart-box">
          <h3>Activity Breakdown</h3>
          <p>Percent of time spent Active, Stationary, and Resting</p>
          <PieChart dailyData={dailyData} />
        </div>
        <div className="chart-box">
          <h3>Activity Categories</h3>
          <p>Visual comparison of different activity levels (in minutes)</p>
          <BarAndLineChart dailyData={dailyData} />
        </div>
        <div className="chart-box">
          <h3>Heart Rate Monitoring</h3>
          <p>Track resting vs active heart rate over time (beats per minute)</p>
          <LineChart dailyData={dailyData} />
        </div>
      </div>
    </section>
  );
}

export default StatisticsSection;
