import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { formatTooltipLabel } from "../helper/chart-helper";

function LineChart({ dailyData }) {
  const lineChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!dailyData || dailyData.length === 0) return;

    const xLabels = dailyData.map((_, index) => index + 1);
    const HRDatasets = dailyData.map(d => d.heartRate);
    const spo2Datasets = dailyData.map(d => d.spo2);

    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(lineChartRef.current, {
      type: "line",
      data: {
        labels: xLabels,
        datasets: [
          {
            label: "Heart Rate(BPM)",
            data: HRDatasets,
            borderColor: "rgb(255,0,0)",
            backgroundColor: "rgba(255,99,132,0.2)",
            fill: true,
            tension: 0.3
          },
          {
            label: "SpO₂(%)",
            data: spo2Datasets,
            borderColor: "rgb(0,0,255)",
            backgroundColor: "rgba(54,162,235,0.2)",
            fill: true,
            tension: 0.3
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return formatTooltipLabel(dailyData, context.dataIndex, true);
              }
            }
          },
          title: {
            display: true,
            text: "Heart Rate & SpO₂ Trend",
            font: {
              size: 18
            },
            color: "rgb(255,255,255)",
          },
          legend: {
            labels: {
              color: "rgb(255,255,255)"
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              color: "rgb(255,255,255)"
            },
            ticks: {
              color: "rgb(255,255,255)"
            }
          },
          y: {
            title: {
              display: true,
              text: "Values",
              color: "rgb(255,255,255)",

            },
            beginAtZero: false,
          },
        }
      },
    });


  }, [dailyData]);
  return <canvas ref={lineChartRef}></canvas>

} export default LineChart;