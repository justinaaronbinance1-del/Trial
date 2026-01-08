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
          <h4>Front-end Developers</h4>
          <p>Roldan Aguila</p>
          <p>Kimberly Luceñada</p>
          <p>Audrei Lopez</p>
          <p>Yuri Gwynette Padua</p>


        </div>
        <div className="footer-section">
          <h4>Back-end Developers</h4>
          <p>Albert De Villa</p>
          <p>Justin Aaron Soriano</p>
          <p>Michael Owhen Bughaw II</p>



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
