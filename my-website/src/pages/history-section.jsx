import { useState, useEffect } from "react";
import dayjs from "dayjs";
import SensorData from "./connection-backend";
import "../styles/history-section.css";


function HistorySection() {
  const [latestHistory, setLatestHistory] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});


  const toggleFlip = (username) => {
    setFlippedCards(prev => ({
      ...prev,
      [username]: !prev[username]
    }));
  };

  return (
    <>

      <SensorData setLatestHistory={setLatestHistory} />
      {console.log("Latest History Data:", latestHistory)}

      <section id="history" className="history-info-container">


        <h2>Patient History</h2>

        <div className="history-row">
          {latestHistory.map(user => (
            <div
              key={user.username}
              className={`history-card horizontal-card ${flippedCards[user.username] ? "flipped" : ""}`}
              onClick={() => toggleFlip(user.username)}
            >

              <div className="card-front">
                <div className="history-header">
                  <h3>{user.username}</h3>
                  {user.latest?.recorded_at && (
                    <p>
                      {dayjs(user.latest.recorded_at).format("YYYY-MM-DD")} —{" "}
                      {dayjs(user.latest.recorded_at).format("hh:mm A")}
                    </p>
                  )}
                </div>

                {user.latest && (
                  <div className="history-details">
                    <div><span>Heart Rate:</span> {user.latest.heartRate} bpm</div>
                    <div><span>Activity:</span> {user.latest.activity}</div>
                    <div>
                      <span>Anomaly:</span>{" "}
                      <span className={user.latest.anomaly === "Normal" ? "normal" : "abnormal"}>
                        {user.latest.anomaly}
                      </span>
                    </div>
                    <div><span>Avg BPM:</span> {user.latest.avgBpm || "-"}</div>
                    <div><span>Max BPM:</span> {user.latest.maxBpm || "-"}</div>
                    <div><span>Min BPM:</span> {user.latest.minBpm || "-"}</div>
                  </div>
                )}
              </div>


              <div className="card-back">
                <h4>Last 10 Readings</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>HR</th>
                      <th>Activity</th>
                      <th>Anomaly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.history?.map(record => (
                      <tr key={record.id}>
                        <td>{dayjs(record.timestamp).format("YYYY-MM-DD")}</td>
                        <td>{dayjs(record.timestamp).format("hh:mm A")}</td>
                        <td>{record.heartRate}</td>
                        <td>{record.activity}</td>
                        <td className={record.anomaly === "Normal" ? "normal" : "abnormal"}>
                          {record.anomaly}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default HistorySection;