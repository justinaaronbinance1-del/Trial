import React from "react";
import "../styles/about-section.css";

function AboutSection() {
  return (
    <section id="about-us" className="about-us-section">
      <div className="about-inner-container">

        {/* HEADER */}
        <div className="about-header">
          <h2 className="about-title">About StudPulse</h2>
          <p className="about-description">
            An IoT-powered health monitoring system designed to help students track their vital signs,
            detect stress patterns, and maintain optimal wellness through real-time data insights.
          </p>
        </div>

        {/* MISSION CARD */}
        <div className="mission-card">
          <h3 className="mission-title">Our Mission</h3>
          <p className="mission-text">
            We believe that student wellness is fundamental to academic success. <strong>StudPulse</strong> empowers
            students with actionable health insights by combining cutting-edge IoT sensors, artificial intelligence,
            and intuitive data visualization to create a comprehensive health monitoring ecosystem.
          </p>
        </div>

        {/* TECHNOLOGY STACK */}
        <div className="techstack-section">
          <h2 className="techstack-title">Technology Stack</h2>
          <div className="techstack-container">

            <div className="tech-card">
              <div className="tech-icon">❤️</div>
              <h3 className="tech-name">MAX30102</h3>
              <p className="tech-description">
                Heart rate sensor for vital signs monitoring
              </p>
            </div>

            <div className="tech-card">
              <div className="tech-icon">⚡</div>
              <h3 className="tech-name">MPU6050</h3>
              <p className="tech-description">
                Motion sensor for movement and activity tracking
              </p>
            </div>

            <div className="tech-card">
              <div className="tech-icon">📶</div>
              <h3 className="tech-name">ESP32</h3>
              <p className="tech-description">
                WiFi-enabled microcontroller for data transmission
              </p>
            </div>

            <div className="tech-card">
              <div className="tech-icon">🧠</div>
              <h3 className="tech-name">ML Algorithms</h3>
              <p className="tech-description">
                Random Forest algorithm for anomaly detection
              </p>
            </div>

          </div>
        </div>

        {/* COMMUNITY CARD */}
        <div className="community-card">
          <h3 className="community-title">🌐 Join the StudPulse Community</h3>
          <p className="community-text">
            We're constantly improving StudPulse to better serve student health and wellness.
            Connect with us to share feedback, report issues, or learn more about our technology.  Join the StudPulse Community!
          </p>
        </div>

      </div>
    </section>
  );
}

export default AboutSection;
