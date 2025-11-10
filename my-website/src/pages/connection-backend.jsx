
import React, { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:8000/latest";

const SensorData = ({ setParentData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Attempting to fetch from:", BACKEND_URL); // <--- ADD THIS

        const response = await fetch(BACKEND_URL);

        console.log("Response status:", response.status); // <--- ADD THIS

        const data = await response.json();

        console.log("Received data:", data); // <--- ADD THIS

        setParentData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sensor data:", error); // <--- THIS shows failure
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [setParentData]);

  if (loading) return null;
  return null;
};

export default SensorData;
