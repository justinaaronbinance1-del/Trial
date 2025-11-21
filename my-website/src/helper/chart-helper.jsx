export function formatTooltipLabel(dailyData, index) {
  const d = dailyData[index];
  const date = new Date()
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `Time: ${hours}:${minutes} ${ampm}, HR: ${d.heartRate}, spo2: ${d.spo2}, Activity: ${d.predicted_activity}`;
}