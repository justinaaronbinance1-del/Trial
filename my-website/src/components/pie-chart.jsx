import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function PieChart({ dailyData }) {


  const pieChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!dailyData || dailyData.length === 0) return;

    let runningNum = 0;
    let stationaryNum = 0;
    let walkingNum = 0;

    dailyData.forEach(d => {
      if (d.predicted_activity === "Running") runningNum++;
      else if (d.predicted_activity === "Stationary") stationaryNum++;
      else if (d.predicted_activity === "Walking") walkingNum++;

    });

    const pieLabels = ["Walking", "Stationary", "Running"];
    const dataLabels = [walkingNum, stationaryNum, runningNum];
    const colorLabels = ["#87CEFA", "#4169E1", "#000080"];

    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(pieChartRef.current, {
      type: "pie",
      data: {
        labels: pieLabels,
        datasets: [{
          data: dataLabels,
          backgroundColor: colorLabels
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Activity Distribution",
            font: { size: 18 },
            color: "#ffffff"
          },
          legend: {
            position: "bottom",
            labels: {
              color: "#ffffff",
              font: { size: 12 }

            }
          },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, [dailyData]);
  return <canvas ref={pieChartRef}></canvas>;
}
export default PieChart;