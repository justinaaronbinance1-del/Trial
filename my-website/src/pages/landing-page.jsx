import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";

import Icons from "./icon-collection";


import "../styles/global.css";
import "../styles/header-button.css";
import "../styles/header.css";
import "../styles/container.css";

import LogoImage from "../images/logo-image.png";
import HomeSection from "./home-section";
import IntroSection from "./intro-section";
import StatisticsSection from "./statistics-section";



function LandingPage() {

  const [active, setActive] = useState("home");



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
  const offsetNum = -120;

  return (
    <div>

      <header className="header">
        <Link to="Intro"
          smooth={false}
          offset={offsetNum}
          className={`logo-link ${active === "Intro" ? "active" : ""}`}>
          <img
            className="image-logo"
            src={LogoImage}
            alt="Logo"
          />
        </Link>

        <nav className="header-buttons">
          <Link to="home"
            smooth={false}
            offset={offsetNum}
            className={`button-nav-link ${active === "home" ? "active" : ""}`}
          >
            Home
          </Link>

          <Link to="statistics"
            smooth={false}
            offset={-85}
            className={`button-nav-link ${active === "statistics" ? "active" : ""}`}>
            Statistics
          </Link>

          <Link to="history"
            smooth={false}
            offset={offsetNum}
            className={`button-nav-link ${active === "history" ? "active" : ""}`} >
            History
          </Link>
          <Link to="about-us"
            smooth={false}
            offset={offsetNum}
            className={`button-nav-link ${active === "about-us" ? "active" : ""}`} >
            About Us
          </Link>

          <div>
            <Icons.UserIcon />
          </div>


        </nav>
      </header>

      <IntroSection />
      <HomeSection />
      <StatisticsSection />
      <HistorySection />

      <section id="about-us" className="about-us-info-container">
        About Us content here...
      </section>

      <footer>

      </footer>
    </div>
  );
}

export default LandingPage;
