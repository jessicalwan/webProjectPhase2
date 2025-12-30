import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Auth.css"; // Reuse existing Auth/confirmation CSS

export default function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get booking info passed via state from previous page
  const bookingInfo = location.state;

  // If no booking info exists, show a simple message
  if (!bookingInfo) {
    return <p>No booking information found.</p>;
  }

  const { doctor, service, date, time } = bookingInfo;

  // State to store user input data
  const [userData, setUserData] = useState({
    full_name: "",
    phone: "",
    email: "",
  });

  // Loading state for button disable / spinner
  const [loading, setLoading] = useState(false);

  // Handle input field changes
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Confirm booking & register user
  const handleConfirm = async () => {
    const { full_name, phone, email } = userData;

    // Validate user fields
    if (!full_name || !phone || !email) {
      return alert("Please fill all user details before confirming.");
    }

    // Prepare payload for backend
    const payload = {
      full_name,
      phone,
      email,
      doctorId: doctor.id,
      service: service.name ?? service, // handle object or string
      day: date,
      time,
      duration: service.duration ?? 1,
    };

    setLoading(true); // start loading

    try {
      // Send registration + booking request
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.ok) {
        // Success: show alert and navigate to appointments
        alert("Appointment confirmed!");
        navigate("/appointments");
      } else {
        // Backend error
        alert(data.message || "Error confirming appointment. Try another slot.");
      }
    } catch (err) {
      // Network or unexpected error
      console.error(err);
      alert("Error connecting to server. Check console.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Confirm Your Appointment</h2>

        {/* Booking Summary */}
        <p><strong>Doctor:</strong> {doctor?.name}</p>
        <p><strong>Service:</strong> {service?.name ?? service}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {time}</p>

        {/* User input form */}
        <h3>Your Information</h3>
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={userData.full_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={userData.phone}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
        />

        {/* Confirm button */}
        <button onClick={handleConfirm} disabled={loading}>
          {loading ? "Confirming..." : "Confirm Appointment"}
        </button>
      </div>
    </div>
  );
}
