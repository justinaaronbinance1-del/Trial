import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function ActivityCategoriesChart({ dailyData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {

    if (!dailyData || dailyData.length === 0) return;

    // ---- Limit data to last 50 samples ----
    const MAX_DATA = 20;
    const trimmed = dailyData.length > MAX_DATA
      ? dailyData.slice(-MAX_DATA)
      : dailyData;

    // ---- Prepare Data ----
    const xLabels = trimmed.map((_, i) => i + 1);


    // Convert activity into numeric series
    const activityNum = trimmed.map(d => {
      if (d.predicted_activity === "Stationary") return 1;
      if (d.predicted_activity === "Walking") return 2;
      if (d.predicted_activity === "Running") return 3;
      return 1;
    });

    // Colors for the activity
    const activityColors = trimmed.map(d => {
      if (d.predicted_activity === "Stationary") return "#6aa0ff";
      if (d.predicted_activity === "Walking") return "#ffd34d";
      if (d.predicted_activity === "Running") return "#ff6b6b";
      return "gray";
    });

    // Destroy previous instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }


    chartInstance.current = new Chart(chartRef.current, {
      type: "scatter", // scatter chart to show discrete points
      data: {
        labels: xLabels,
        datasets: [
          {
            label: "Activity",
            data: activityNum.map((y, i) => ({ x: i + 1, y })),
            pointBackgroundColor: activityColors,
            pointRadius: 8,
            showLine: false // no line, just points
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: "rgba(0,0,0,0.8)",
            cornerRadius: 6,
            padding: 10,
            callbacks: {
              label: function (ctx) {
                const d = trimmed[ctx.dataIndex];
                return `Activity: ${d.predicted_activity}`;
              }
            }
          },
          title: {
            display: true,
            text: "Activity Over Time (Last 20 Samples)",
            color: "white",
            padding: 10
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Sample Number",
              color: "white",
              padding: { top: 10 }
            },
            ticks: {
              color: "white"
            },
            grid: { color: "rgba(255,255,255,0.1)" }
          },
          y: {
            title: {
              display: true,
              text: "Activity",
              color: "white",
              padding: { top: 10 }
            },
            ticks: {
              color: "white",
              stepSize: 1,
              callback: (v) => {
                if (v === 1) return "Stationary";
                if (v === 2) return "Walking";
                if (v === 3) return "Running";
                return "";
              }
            },
            min: 0.5,
            max: 3.5,
            grid: { color: "rgba(255,255,255,0.1)" }
          }
        }
      }
    });
  }, [dailyData]);

  return (
    <div style={{ height: "350px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default ActivityCategoriesChart;
