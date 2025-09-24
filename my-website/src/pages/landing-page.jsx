import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import "../styles/global.css";
import "../styles/landing-page.css";
import "../styles/header-button.css";
import "../styles/header.css";
import "../styles/container.css";

import LogoImage from "../images/logo-image.png";
import HomeSection from "./home-section"


function LandingPage() {


  //Header clicking effect

  const [active, setActive] = useState("home");
  const [homeMarginTop, setHomeMarginTop] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);

          }
        }
        );
      },
      { threshold: 0.6 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Handle click for smooth scrolling and immediate underline update
  const handleClick = (sectionId) => (e) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActive(sectionId);
    }
  };
  //

  return (
    <div>
      <div className="header">
        <img
          className="image-logo"
          src={LogoImage}
          alt="Logo"
        />

        <div className="header-buttons">
          <Link to="home"
            smooth={false}
            offset={-120}
            className={`button-nav-link ${active === "home" ? "active" : ""}`}
          >
            Home
          </Link>

          <Link to="statistics"
            smooth={false}
            offset={-120}
            className={`button-nav-link ${active === "statistics" ? "active" : ""}`}>
            Statistics
          </Link>

          <a href="#history" className={`button-nav-link ${active === "history" ? "active" : ""}`} >
            History
          </a>
          <a href="#about-us" className={`button-nav-link ${active === "about-us" ? "active" : ""}`} >
            About Us
          </a>

        </div>
      </div>

      <HomeSection marginTop={homeMarginTop} />

      <section id="statistics" className="statistics-info-container">
        Statistics content here...
      </section>

      <section id="history" className="history-info-container">
        History content here...
      </section>

      <section id="about-us" className="about-us-info-container">
        About Us content here...
      </section>


    </div>
  );
}

export default LandingPage;
