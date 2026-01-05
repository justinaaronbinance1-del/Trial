import { useState, useEffect } from "react";
import "../styles/user-agreement.css";

export default function UserAgreement() {
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    // Disable scrolling when agreement is visible
    if (!accepted) {
      document.body.style.overflow = "hidden";
    }

    // Re-enable scrolling only when accepted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [accepted]);

  if (accepted) return null;

  return (
    <div className="agreement-overlay">
      <div className="agreement-box">
        <h2>StudPulse User Agreement</h2>

        <p>
          StudPulse is a student health monitoring platform that displays
          health-related data such as heart rate, oxygen level, and physical
          activity.
        </p>

        <p>
          This website does not use a login or authentication system.
          As a result, all health data displayed on StudPulse is publicly
          accessible to anyone who uses the website.
        </p>

        <p>
          By accepting this agreement, you acknowledge and agree that your
          health data may be viewed by other users and that StudPulse is
          intended for educational and informational purposes only.
        </p>

        {!declined ? (
          <div className="agreement-buttons">
            <button className="accept" onClick={() => setAccepted(true)}>
              Accept
            </button>
            <button className="decline" onClick={() => setDeclined(true)}>
              Decline
            </button>
          </div>
        ) : (
          <p className="decline-message">
            You have declined the User Agreement. Access to StudPulse is not permitted.
          </p>
        )}
      </div>
    </div>
  );
}
