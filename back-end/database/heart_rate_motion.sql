CREATE DATABASE health_monitoring;
USE health_monitoring;

CREATE TABLE heart_rate_motion_readings(
  id INT PRIMARY KEY AUTO_INCREMENT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  --MPU6050
  accX FLOAT,
  accY FLOAT,
  accZ FLOAT,
  gyroX FLOAT,
  gyroY FLOAT,
  gyroZ FLOAT,
  --MAX30102
  heart_rate INT,
  spo2 FLOAT,
  --ML model
  predicted_activity VARCHAR(50) DEFAULT NULL,
  condition VARCHAR(20) DEFAULT NULL

);