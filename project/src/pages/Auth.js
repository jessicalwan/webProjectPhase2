import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user came from booking flow; store booking info if available
  const bookingInfo = location.state?.fromBooking ? location.state : null;

  // State to store user registration form data
  const [registerData, setRegisterData] = useState({
    fullName: "",
    phone: "",
    email: ""
  });

  // Handle form submission for registration + booking
  const handleRegister = async (e) => {
    e.preventDefault();
    const { fullName, phone, email } = registerData;

    // Validate fields
    if (!fullName || !phone || !email) {
      return alert("Please fill all fields.");
    }

    // Ensure booking info exists
    if (!bookingInfo) {
      return alert("Booking info missing. Go back to doctors page.");
    }

    try {
      // Send POST request to backend to register user and create booking
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          email,
          doctorId: bookingInfo.doctorId,
          service: bookingInfo.service,
          day: bookingInfo.day,
          time: bookingInfo.time,
          duration: bookingInfo.duration
        })
      });

      const data = await response.json();

      if (data.ok) {
        // Successful registration + booking
        alert("Registration successful and appointment booked!");
        navigate("/appointments"); // Redirect to appointments page
      } else {
        // Backend returned an error
        alert("Error: " + data.message);
      }
    } catch (err) {
      // Network or other errors
      console.error(err);
      alert("Error connecting to server. Check console.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register & Confirm Appointment</h2>

        {/* Display booking summary if booking info exists */}
        {bookingInfo && (
          <div
            className="booking-summary"
            style={{ textAlign: "left", marginBottom: "16px" }}
          >
            <p><strong>Doctor:</strong> {bookingInfo.doctorName}</p>
            <p><strong>Service:</strong> {bookingInfo.service}</p>
            <p><strong>Day:</strong> {bookingInfo.day}</p>
            <p><strong>Time:</strong> {bookingInfo.time}</p>
          </div>
        )}

        {/* Registration form */}
        <form className="auth-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={registerData.fullName}
            onChange={(e) =>
              setRegisterData({ ...registerData, fullName: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={registerData.phone}
            onChange={(e) =>
              setRegisterData({ ...registerData, phone: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
            required
          />

          {/* Submit button */}
          <button type="submit">Confirm Registration & Booking</button>
        </form>
      </div>
    </div>
  );
}
