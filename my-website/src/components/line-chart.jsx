import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { formatTooltipLabel } from "../helper/chart-helper";

function LineChart({ dailyData, selectedUser }) {
  const lineChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!dailyData || dailyData.length === 0) return;

    const MAX_DATA = 50;
    const trimmed = dailyData.length > MAX_DATA
      ? dailyData.slice(-MAX_DATA)
      : dailyData;


    const xLabels = trimmed.map((_, index) => index + 1);
    const HRDatasets = trimmed.map(d => d.heartRate);
    const spo2Datasets = trimmed.map(d => d.spo2);

    if (!chartInstance.current) {

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
                  return formatTooltipLabel(trimmed, context.dataIndex, true);
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
    } else {
      chartInstance.current.data.labels = xLabels;
      chartInstance.current.data.datasets[0].data = HRDatasets;
      chartInstance.current.data.datasets[1].data = spo2Datasets;
      chartInstance.current.update("none");
    }



  }, [dailyData]);

  useEffect(() => {
    return () => {


      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, [selectedUser]);

  return <canvas ref={lineChartRef}></canvas>

} export default LineChart;