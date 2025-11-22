
import { useEffect, useState } from "react";

const BACKEND_URL_LATEST = "http://localhost:8000/latest";
const BACKEND_URL_DAILY = "http://localhost:8000/daily";
const BACKEND_URL_USERS_LIST = "http://localhost:8000/user_list";
const BACKEND_URL_HISTORY = "http://localhost:8000";

const SensorData = ({ username, setLatestData, setDailyData, setUserList, setHistory }) => {
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
    if (!setDailyData) return;
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

  useEffect(() => {
    if (!setUserList) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch(BACKEND_URL_USERS_LIST);
        const json = await response.json();

        if (json.users) {
          setUserList(json.users);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchUsers();
    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);

  }, [setUserList]);


  useInsertionEffect(() => {
    if (!setHistory || username) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BACKEND_URL_HISTORY}?username=${encodeURIComponent(username)}`);
        const json = await res.json();

        if (json.status === "success") {
          setHistory(json);

        }
      } catch (error) {
        console.erro("Error Fetching history", error);
      }
    };
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, [setHistory, username]);

  return null;
};

export default SensorData;

//iimport na sa may history part
