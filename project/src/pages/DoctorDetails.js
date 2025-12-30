import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/DoctorDetails.css";

export default function DoctorDetails() {
  const { id } = useParams(); // Doctor ID from URL
  const navigate = useNavigate();
  const location = useLocation();

  // ---------- Update Mode ----------
  // Check if this page is opened to update an existing booking
  const bookingData = location.state?.bookingData;
  const isUpdate = !!bookingData; // true if updating an existing booking

  // ---------- State ----------
  const [doctor, setDoctor] = useState(null); // Doctor details
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedService, setSelectedService] = useState(""); // Service dropdown
  const [selectedDay, setSelectedDay] = useState(""); // Day dropdown
  const [selectedTime, setSelectedTime] = useState(""); // Time slot

  // ---------- Fetch Doctor ----------
  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await axios.get(`http://localhost:5000/doctors/${id}`);
        const data = res.data;
        setDoctor(data);

        // ---------- Prefill for Update ----------
        if (isUpdate && bookingData) {
          setSelectedService(bookingData.service_name);
          setSelectedDay(bookingData.day);
          setSelectedTime(bookingData.time);
        } else if (data.services.length > 0) {
          setSelectedService(data.services[0].name); // default to first service
        }
      } catch (err) {
        console.error("Failed to fetch doctor:", err);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctor();
  }, [id, isUpdate, bookingData]);

  if (loading) return <p>Loading doctor details...</p>;
  if (!doctor) return <h2 className="not-found-msg">Doctor not found — please return to Doctors page.</h2>;

  // ---------- Available Slots ----------
  const dayObj = selectedDay ? doctor.timeSlots.find(d => d.day === selectedDay) : null;
  const availableSlots = dayObj ? dayObj.slots : [];

  // ---------- Handle Booking / Update ----------
  const handleSubmit = async () => {
    if (!selectedService || !selectedDay || !selectedTime) {
      return alert("Please select service, day, and time.");
    }

    const duration = doctor.services.find(s => s.name === selectedService)?.duration || 1;

    try {
      if (isUpdate) {
        // ---------- Update Existing Booking ----------
        await axios.put(`http://localhost:5000/bookings/${bookingData.id}`, {
          service: selectedService,
          day: selectedDay,
          time: selectedTime,
          duration
        });
        alert("Booking updated successfully!");
        navigate("/appointments"); // Go back to appointments page
      } else {
        // ---------- New Booking ----------
        navigate("/auth", {
          state: {
            fromBooking: true,
            doctorId: doctor.id,
            doctorName: doctor.name,
            service: selectedService,
            day: selectedDay,
            time: selectedTime,
            duration
          }
        });
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="doctor-details-container">
      {/* ---------- Doctor Info ---------- */}
      <div className="doctor-header">
        <img src={doctor.image} alt={doctor.name} className="doctor-image" />
        <div className="doctor-info">
          <h2>{doctor.name}</h2>
          <h4 className="specialty">{doctor.specialty}</h4>
          <p className="doctor-description">{doctor.description}</p>
        </div>
      </div>

      {/* ---------- Services ---------- */}
      <div className="services-section">
        <h3>Select Service</h3>
        <select
          className="service-select"
          value={selectedService}
          onChange={e => setSelectedService(e.target.value)}
        >
          <option value="">-- Choose service --</option>
          {doctor.services.map(s => (
            <option key={s.name} value={s.name}>
              {s.name} ({s.duration} hr{s.duration > 1 ? "s" : ""})
            </option>
          ))}
        </select>
      </div>

      {/* ---------- Days ---------- */}
      <div className="day-section">
        <h3>Select Day</h3>
        <select
          className="day-select"
          value={selectedDay}
          onChange={e => {
            setSelectedDay(e.target.value);
            setSelectedTime(""); // reset time when day changes
          }}
        >
          <option value="">-- Choose day --</option>
          {doctor.timeSlots.map(d => (
            <option key={d.day} value={d.day}>{d.day}</option>
          ))}
        </select>
      </div>

      {/* ---------- Time Slots ---------- */}
      {selectedDay && (
        <div className="times-section">
          <h3>Available times on {selectedDay}</h3>
          {availableSlots.length === 0 ? (
            <p className="no-slots">No more time offered for this day.</p>
          ) : (
            <div className="times-grid">
              {availableSlots.map(t => (
                <button
                  key={t}
                  className={`time-btn ${selectedTime === t ? "active" : ""}`}
                  onClick={() => setSelectedTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------- Submit / Update Button ---------- */}
      <div className="actions" style={{ marginTop: 18 }}>
        <button className="set-btn" onClick={handleSubmit}>
          {isUpdate ? "Update Booking" : "Continue"}
        </button>
      </div>
    </div>
  );
}
