export function formatTooltipLabel(dailyData, index, includeSpo2 = false) {
  const d = dailyData[index];
  const date = new Date(d.recorded_at)
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  let label = `Time: ${hours}:${minutes} ${ampm}, HR: ${d.heartRate}`;

  if (includeSpo2 && d.spo2 !== undefined) {
    label += `, SpO₂: ${d.spo2}`;
  } else {
    label += `, Activity: ${d.predicted_activity}`;
  }

  return label;
}