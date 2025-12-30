import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Appointments.css";

export default function Appointments() {
  // State for storing bookings grouped by doctor
  const [bookingsByDoctor, setBookingsByDoctor] = useState({});
  const [loading, setLoading] = useState(true);

  // State for controlling the mini modal and selected booking
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const navigate = useNavigate();

  // Function to load bookings from backend
  const loadBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/bookings");
      const grouped = {};

      // Group bookings by doctorId for easier display
      res.data.forEach((b) => {
        const docId = String(b.doctorId);
        if (!grouped[docId]) grouped[docId] = [];
        grouped[docId].push(b);
      });

      setBookingsByDoctor(grouped);
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load bookings on component mount
  useEffect(() => {
    loadBookings();
  }, []);

  // Show loading message if fetching data
  if (loading) return <p>Loading appointments...</p>;

  // Show message if no bookings exist
  if (Object.keys(bookingsByDoctor).length === 0)
    return <p>No appointments yet.</p>;

  return (
    <div className="appointments-page">
      <h1>Appointments</h1>

      {/* Loop through each doctor's bookings */}
      {Object.keys(bookingsByDoctor).map((docId) => {
        const list = bookingsByDoctor[docId];

        return (
          <div className="doctor-table-card" key={docId}>
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Service</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Loop through bookings for this doctor */}
                {list.map((b, i) => (
                  <tr key={b.id}>
                    <td>{i + 1}</td>
                    <td>{b.username}</td>
                    <td>{b.doctorName}</td>
                    <td>{b.service}</td>
                    <td>{b.day}</td>
                    <td>{b.time}</td>
                    <td>{b.duration}</td>
                    <td>
                      {/* Open mini modal on Cancel button click */}
                      <button
                        className="cancel-btn"
                        onClick={() => {
                          setSelectedBooking(b);
                          setShowModal(true);
                        }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* MINI MODAL */}
      {showModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Manage Appointment</h2>
            <p>What would you like to do?</p>

            <div className="modal-actions">
              {/* UPDATE → navigate to DoctorDetails page with booking data */}
              <button
                className="update-btn"
                onClick={() =>
                  navigate(`/doctor/${selectedBooking.doctorId}`, {
                    state: {
                      isUpdate: true, // flag for update mode
                      bookingId: selectedBooking.id, // pass booking ID
                      bookingData: selectedBooking, // pass full booking data
                    },
                  })
                }
              >
                Update
              </button>

              {/* DELETE → delete booking via backend API */}
              <button
                className="delete-btn"
                onClick={async () => {
                  if (!window.confirm("Delete this appointment?")) return;

                  // Call backend to delete booking
                  await axios.delete(
                    `http://localhost:5000/bookings/${selectedBooking.id}`
                  );

                  // Close modal and reload bookings
                  setShowModal(false);
                  loadBookings();
                }}
              >
                Delete
              </button>

              {/* CLOSE → just close the modal */}
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
