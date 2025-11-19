import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";


import "../styles/statistics-section.css";
import SensorData from "./connection-backend";

function StatisticsSection() {


  // State for daily data
  const [dailyData, setDailyData] = useState([]);

  // Chart refs
  const pieChartRef = useRef(null);
  const pieChartInstance = useRef(null);

  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);

  const heartRateChartRef = useRef(null);
  const heartRateChartInstance = useRef(null);

  // PIE CHART - updates when dailyData changes
  useEffect(() => {
    if (!dailyData || dailyData.length === 0) return;

    let runningNum = 0;
    let stationaryNum = 0;
    let walkingNum = 0;

    dailyData.forEach(d => {
      if (d.stud_condition === "Running") runningNum += 1;
      else if (d.stud_condition === "Stationary") stationaryNum += 1;
      else if (d.stud_condition === "Walking") walkingNum += 1;
    });

    let pieLabels = ["Walking", "Stationary", "Running"];
    let dataLabels = [walkingNum, stationaryNum, runningNum];
    let colorLabels = ["#87CEFA", "#4169E1", "#000080"];

    if (walkingNum === 0 && stationaryNum === 0 && runningNum === 0) {
      pieLabels = ["No Readings!"];
      dataLabels = [1];
      colorLabels = ["#808080"];
    }

    if (!pieChartInstance.current) {
      pieChartInstance.current = new Chart(pieChartRef.current, {
        type: "pie",
        data: { labels: pieLabels, datasets: [{ data: dataLabels, backgroundColor: colorLabels }] },
        options: {
          plugins: {
            title: { display: true, text: "Activity Distribution", font: { size: 18 }, color: "#ffffff" },
            legend: { position: "bottom", labels: { color: "#ffffff", font: { size: 12 } } },
          },
        },
      });
    } else {
      const chart = pieChartInstance.current;
      chart.data.labels = pieLabels;
      chart.data.datasets[0].data = dataLabels;
      chart.data.datasets[0].backgroundColor = colorLabels;
      chart.update();
    }
  }, [dailyData]);

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
      if (pieChartInstance.current) pieChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (heartRateChartInstance.current) heartRateChartInstance.current.destroy();
    };
  }, []);

  return (
    <section id="statistics" className="statistics-info-container">
      <SensorData setDailyData={setDailyData} />
      <h2>Activity & Health Statistics </h2>
      <div className="charts-container">
        <div className="chart-box">
          <h3>Activity Breakdown</h3>
          <p>Percent of time spent Active, Stationary, and Resting</p>
          <canvas ref={pieChartRef}></canvas>
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
