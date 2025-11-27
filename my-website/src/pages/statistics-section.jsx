import { useState, useEffect } from "react";
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


  const handleUserChange = (e) => {
    const selected = e.target.value;
    setSelectedUser(selected);
    setDailyData([]);


  }
  useEffect(() => {
    console.log("🟦 DAILY DATA UPDATED:", dailyData);
  }, [dailyData]);

  return (
    <section id="statistics" className="statistics-info-container">
      <SensorData
        username={selectedUser}
        setDailyData={setDailyData}
        setUserList={setUsers}
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
          <PieChart dailyData={dailyData} selectedUser={selectedUser} />
        </div>
        <div className="chart-box">
          <h3>Activity Categories</h3>
          <p>Visual comparison of different activity levels (in minutes)</p>
          <BarAndLineChart dailyData={dailyData} selectedUser={selectedUser} />
        </div>
        <div className="chart-box">
          <h3>Heart Rate Monitoring</h3>
          <p>Track resting vs active heart rate over time (beats per minute)</p>
          <LineChart dailyData={dailyData} selectedUser={selectedUser} />
        </div>
      </div>
    </section>
  );
}

export default StatisticsSection;
