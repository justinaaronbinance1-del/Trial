
import React, { useEffect, useState } from "react";

const BACKEND_URL_LATEST = "http://localhost:8000/latest";
const BACKEND_URL_DAILY = "http://localhost:8000/daily";

const SensorData = ({ username, setLatestData, setDailyData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!setLatestData || !username) return;

    const fetchData = async () => {
      try {
        console.log("Attempting to fetch latest data for:", username);

        const response = await fetch(BACKEND_URL_LATEST);

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Received data:", data);

        setLatestData(data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [setLatestData, username]);

  useEffect(() => {
    if (!setDailyData || !username) return;
    const fetchDaily = async () => {
      try {
        console.log("Fetching Daily Readings for:", username);
        const res = await fetch(`${BACKEND_URL_DAILY}?username=${encodeURIComponent(username)}`);
        const json = await res.json();

        console.log("Received DAILY data:", json);

        if (json.status === "Success") {
          setDailyData(json.data);
        }

      } catch (error) {
        console.error("Error fetching daily data:", error);
      }
    };
    fetchDaily();
    const interval = setInterval(fetchDaily, 5000);
    return () => clearInterval(interval);
  }, [setDailyData, username]);



  return null;
};

export default SensorData;
