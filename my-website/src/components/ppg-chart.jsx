import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function PPGChart({ websocketURL }) {
  const [ppgData, setPpgData] = useState([]);
  const [redData, setRedData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(websocketURL);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setPpgData((prev) => {
        const updated = [...prev, data.ir];
        if (updated.length > 200) updated.shift();
        return updated;
      });

      setRedData((prev) => {
        const updated = [...prev, data.red];
        if (updated.length > 200) updated.shift();
        return updated;
      });

    };
    return () => ws.close();
  }, [websocketURL]);

  const chartData = {
    labels: ppgData.map((_, index) => index),
    datasets: [
      {
        label: "Heartbeat Reading",
        data: ppgData,
        borderColor: "rgb(255, 0, 0)",
        borderWidth: 1.5,
        tension: 0.3,
        pointRadius: 0
      },
      {
        label: "Oxygen Reading",
        data: redData,
        borderColor: "rgb(0,0,255)",
        borderWidth: 1.5,
        tension: 0.3,
        pointRadius: 0

      }
    ]
  };
  const options = {
    responsive: true,
    animation: false,
    scales: {
      x: {
        display: false,

      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Values"
        },
        ticks: {
          beginatZero: true
        }
      }
    }

  };
  return <Line data={chartData} options={options} />;

} export default PPGChart;