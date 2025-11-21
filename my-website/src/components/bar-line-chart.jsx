import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import dayjs from "dayjs";

function BarAndLineChart({ dailyData }) {
  const barAndLineChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!dailyData || dailyData.length === 0) return;

    const labels = dailyData.map(d => d.recorded_at);
    const heartRateData = dailyData.map(d => d.heartRate);
    const activityData = dailyData.map(d => {
      if (d.predicted_activity === "Stationary") return 0;
      if (d.predicted_activity === "Walking") return 1;
      if (d.predicted_activity === "Running") return 2;
      return 0;
    });
    const activityColor = {
      "Stationary": "#87CEFA",
      "Walking": "#4169E1",
      "Running": "#000080",
    };

    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(barAndLineChartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            type: "line",
            label: "Heart Rate",
            data: heartRateData,
            borderColor: "#FF6384",
            backgroundColor: "rgba(255,99,132,0.2)",
            yAxisID: "y1",
            tension: 0.3,
            fill: false,
          },
          {
            type: "bar",
            label: "Activity",
            data: activityData,
            backgroundColor: dailyData.map(d => {
              d.stud_condition !== "Normal" ? "#FF0000" : activityColor[d.predicted_activity]
            }),
            yAxisID: "y2",
          },

        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "rgb(255,255,255)" },
          },
          title: {
            display: true, text: "Heart Rate & Activity",
            color: "rgb(255,255,255)",
          },
        },
        scales: {
          y1: {
            type: "linear",
            position: "left",
            title: {
              display: true,
              text: "BPM",
              color: "rgb(255,255,255)"
            },
          },
          y2: {
            type: "linear",
            position: "right",
            display: false,
          },
          x: {
            ticks: { color: "rgb(255,255,255)" },
          },
        },
      },
    });

  }, [dailyData]);
  return <canvas ref={barAndLineChartRef}></canvas>
} export default BarAndLineChart;