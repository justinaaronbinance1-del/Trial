import "../styles/footer-section.css";

function FooterSection() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: studpulse@gmail.com</p>
          <p>Phone: +63 9456789911</p>
          <p>Location: Philippines</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Developers</h4>
          <p>Phone: +63 9456789911</p>
          <p>Location: Philippines</p>
          <p>Phone: +63 9456789911</p>
          <p>Location: Philippines</p>


        </div>
        <div className="footer-section">
          <h4></h4>
          <h4></h4>
          <p>Phone: +63 9456789911</p>
          <p>Location: Philippines</p>
          <p>Phone: +63 9456789911</p>
          <p>Location: Philippines</p>


        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© 2025 StudPulse. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default FooterSection;
