import React from "react";
import "../styles/styles-for-all.css";
import "../styles/landing-page.css";
import "../styles/header-button.css";
import "../styles/header.css";
import "../styles/container.css";

import LogoImage from "../images/logo-image.png";



function LandingPage() {
  return (
    <div>
      <div className="header">
        <img
          className="image-logo"
          src={LogoImage}
          alt="Logo"
        />

        <div className="header-buttons">
          <a className="home-button" href="/home-page">
            Home
          </a>
          <a className="statistics-page-button" href="/statistics-page">
            Statistics
          </a>
          <a className="history-button" href="/history-page">
            History
          </a>
          <a className="about-us-button" href="/about-us-page">
            About Us
          </a>
          
        </div>
      </div>

      <div className="box-container">
        <div className="info-container">
          <div className="first-container all-container">1st container</div>
          <div className="second-container all-container">2nd container</div>
          <div className="third-container all-container">3rd container</div>
          <div className="fourth-container all-container">4th container</div>
        </div>

        <div className="second-info-container">container</div>
      </div>
    </div>
  );
}

export default LandingPage;
