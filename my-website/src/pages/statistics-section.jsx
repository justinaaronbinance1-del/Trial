import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";


import "../styles/statistics-section.css";

function StatisticsSection() {

  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const heartRateChartRef = useRef(null);


  useEffect(() => {
    const activityPie = new Chart(pieChartRef.current, {
      //Piechart(activity breakdown)
      type: "pie",
      data: {
        labels: ["Walking", "Sitting", "Running"],
        datasets: [
          {
            data: [40, 30, 30], //placeholder only % (MPU6050 data)
            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Activity Distribution", //MPU6050
            font: { size: 18 },
            color: "#ffffff",

          },
          legend: {
            position: "bottom",
            labels: {
              color: "#ffffff",
              font: { size: 12 },
            },
          },
        },
      },
    });
    //Bar chart(steps and motion from mpu6050)
    const activityBar = new Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels: ["Steps", "Accel X", "Accel Y", "Accel Z"],
        datasets: [
          {
            label: "Sensor Data",
            data: [3500, 1.2, 0.8, 0.5], //placeholder values
            backgroundColor: "#4BC0c0",

          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#ffffff" },
          },
          title: {
            display: true,
            text: "Activity Metrics",
            color: "#ffffff",
            font: { size: 18 },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "Metrics", color: "#ffffff" },
            ticks: { color: "#ffffff" }
          },
          y: {
            title: { display: true, text: "Values", color: "#ffffff" },
            ticks: { color: "#ffffff" },
            beginAtZero: true
          },
        },
      },
    });

    //Line chart (Heart Rate + SpO2 from MAX30102)
    const heartRateChart = new Chart(heartRateChartRef.current, {
      type: "line",
      data: {
        labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"],
        datasets: [
          {
            label: "Heart rate(BPM)",
            data: [72, 75, 80, 78, 82, 76], //placeholder for the actual data
            borderColor: "#FF6384",
            backgroundColor: "rgba(255,99,132,0.2)",
            fill: true,
            tension: 0.3,
          },
          {
            label: "SpO₂ (%)",
            data: [98, 97, 96, 98, 97, 99],//placeholder for the actual values
            borderColor: "#36A2EB",
            backgroundColor: "rgba(54,162,235,0.2)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Heart Rate & SpO₂ Trend (MAX30102)",
            font: { size: 18 },
          },
        },
        scales: {
          x: { title: { display: true, text: "Time of Day" } },
          y: { title: { display: true, text: "Values" }, beginAtZero: false },
        },
      },
    });

    return () => {
      activityPie.destroy();
      activityBar.destroy();
      heartRateChart.destroy();
    };
  }, []);


  return (
    <section id="statistics" className="statistics-info-container">
      <h2> Activity & Health Statistics</h2>
      <p>
        Track the student's activity levels and heart rate patterns for better health insights.
      </p>

      <div className="charts-container">



        <div className="chart-box">
          <h3>Activity Breakdown</h3>
          <p>Percent of time spent Active, Stationary, and Resting</p>
          <canvas ref={pieChartRef}></canvas>

        </div>

        <div className="chart-box">
          <h3>Activity Categories (Bar Chart)</h3>
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