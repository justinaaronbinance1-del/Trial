import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import dayjs from "dayjs";

import "../styles/statistics-section.css";
import SensorData from "./connection-backend";
import PieChart from "../components/pie-chart";


function StatisticsSection() {
  const now = dayjs();
  const formatNow = now.format("MMM DD, YYYY");

  // State for daily data
  const [dailyData, setDailyData] = useState([]);

  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);

  const heartRateChartRef = useRef(null);
  const heartRateChartInstance = useRef(null);


  // BAR & LINE CHARTS - initialize once
  useEffect(() => {
    // Bar chart
    barChartInstance.current = new Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels: ["Steps", "Accel X", "Accel Y", "Accel Z"],
        datasets: [{ label: "Sensor Data", data: [3500, -1200, 0.8, 0.5], backgroundColor: "#4BC0c0" }],
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: "#ffffff" } }, title: { display: true, text: "Activity Metrics", color: "#ffffff", font: { size: 18 } } },
        scales: {
          x: { title: { display: true, text: "Metrics", color: "#ffffff" }, ticks: { color: "#ffffff" } },
          y: { title: { display: true, text: "Values", color: "#ffffff" }, ticks: { color: "#ffffff" }, beginAtZero: true },
        },
      },
    });

    // Line chart
    heartRateChartInstance.current = new Chart(heartRateChartRef.current, {
      type: "line",
      data: {
        labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"],
        datasets: [
          { label: "Heart rate(BPM)", data: [72, 75, 80, 78, 82, 76], borderColor: "#FF6384", backgroundColor: "rgba(255,99,132,0.2)", fill: true, tension: 0.3 },
          { label: "SpO₂ (%)", data: [98, 97, 96, 98, 97, 99], borderColor: "#36A2EB", backgroundColor: "rgba(54,162,235,0.2)", fill: true, tension: 0.3 },
        ],
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: "Heart Rate & SpO₂ Trend (MAX30102)", font: { size: 18 }, color: "#ffffff" }, legend: { labels: { color: "#ffffff" } } },
        scales: {
          x: { title: { display: true, text: "Time of Day", color: "#ffffff" }, ticks: { color: "#ffffff" } },
          y: { title: { display: true, text: "Values", color: "#ffffff" }, ticks: { color: "#ffffff" }, beginAtZero: false },
        },
      },
    });

    // CLEANUP: destroy charts on unmount
    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (heartRateChartInstance.current) heartRateChartInstance.current.destroy();
    };
  }, []);

  return (
    <section id="statistics" className="statistics-info-container">
      <SensorData setDailyData={setDailyData} />
      <h2>Activity & Health Statistics for {formatNow}</h2>
      <div className="drop-down">dropdown </div>
      <div className="charts-container">
        <div className="chart-box">
          <h3>Activity Breakdown</h3>
          <p>Percent of time spent Active, Stationary, and Resting</p>
          <PieChart dailyData={dailyData} />
        </div>
        <div className="chart-box">
          <h3>Activity Categories</h3>
          <p>Visual comparison of different activity levels (in minutes)</p>
          <canvas ref={barChartRef}></canvas>
        </div>
        <div className="chart-box">
          <h3>Heart Rate Monitoring</h3>
          <p>Track resting vs active heart rate over time (beats per minute)</p>
          <canvas ref={heartRateChartRef}></canvas>
        </div>
      </div>
    </section>
  );
}

export default StatisticsSection;
