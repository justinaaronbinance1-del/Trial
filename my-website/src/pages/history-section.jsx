import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "../styles/history-section.css";

function HistorySection() {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    // data natin dito 
    const sampleData = [
      {
        id: 1,
        patientName: "Michael Owhen",
        date: dayjs("2025-10-17T14:32:00").format("YYYY-MM-DD"),
        time: dayjs("2025-10-17T14:32:00").format("hh:mm A"),
        heartRate: 82,
        avgBpm: 80,
        maxBpm: 96,
        minBpm: 68,
        activity: "Active",
        anomaly: "Normal",
      },
      {
        id: 2,
        patientName: "Soriano",
        date: dayjs("2025-10-17T09:15:00").format("YYYY-MM-DD"),
        time: dayjs("2025-10-17T09:15:00").format("hh:mm A"),
        heartRate: 95,
        avgBpm: 88,
        maxBpm: 120,
        minBpm: 72,
        activity: "Resting",
        anomaly: "Abnormal spike detected",
      },
      {
        id: 3,
        patientName: "Dan",
        date: dayjs("2025-10-17T08:00:00").format("YYYY-MM-DD"),
        time: dayjs("2025-10-17T08:00:00").format("hh:mm A"),
        heartRate: 70,
        avgBpm: 75,
        maxBpm: 90,
        minBpm: 65,
        activity: "Stationary",
        anomaly: "Normal",
      },
    ];
    setHistoryData(sampleData);
  }, []);

  return (
    <section id="history" className="history-info-container">
      <h2>Patient History</h2>

      <div className="history-row">
        {historyData.map((record) => (
          <div key={record.id} className="history-card horizontal-card">
            <div className="history-header">
              <h3>{record.patientName}</h3>
              <p>
                {record.date} — {record.time}
              </p>
            </div>

            <div className="history-details">
              <div><span>Heart Rate:</span> {record.heartRate} bpm</div>
              <div><span>Activity:</span> {record.activity}</div>
              <div>
                <span>Anomaly:</span>{" "}
                <span
                  className={
                    record.anomaly === "Normal" ? "normal" : "abnormal"
                  }
                >
                  {record.anomaly}
                </span>
              </div>
              <div><span>Avg BPM:</span> {record.avgBpm}</div>
              <div><span>Max BPM:</span> {record.maxBpm}</div>
              <div><span>Min BPM:</span> {record.minBpm}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HistorySection;
