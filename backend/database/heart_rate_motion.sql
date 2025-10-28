CREATE DATABASE IF NOT EXISTS health_monitoring;
USE health_monitoring;
CREATE TABLE heart_rate_motion_readings(
  id INT PRIMARY KEY AUTO_INCREMENT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  # MPU6050
  accX FLOAT,
  accY FLOAT,
  accZ FLOAT,
  gyroX FLOAT,
  gyroY FLOAT,
  gyroZ FLOAT,
  # MAX30102
  heart_rate INT NOT NULL,
  spo2 FLOAT NOT NULL,
  # ML model
  predicted_activity VARCHAR(50) DEFAULT NULL,
  stud_condition VARCHAR(20) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
CREATE TABLE heart_rate_summary (
  id INT PRIMARY KEY AUTO_INCREMENT,
  summary_date DATE DEFAULT (CURRENT_DATE),
  avg_heart_rate INT,
  min_heart_rate INT,
  max_heart_rate INT,
  total_readings INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
CREATE INDEX idx_summary_date ON heart_rate_summary (summary_date);
CREATE INDEX idx_recorded_at ON heart_rate_motion_readings (recorded_at);
CREATE INDEX idx_predicted_activity ON heart_rate_motion_readings(predicted_activity);
CREATE INDEX idx_stud_condition ON heart_rate_motion_readings(stud_condition);