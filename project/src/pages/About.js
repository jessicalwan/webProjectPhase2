import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/About.css";

function About() {
  // State to store the list of doctors fetched from backend
  const [doctors, setDoctors] = useState([]);

  // State to track the search input value
  const [searchTerm, setSearchTerm] = useState("");

  // React Router hook to navigate programmatically
  const navigate = useNavigate();

  // Fetch doctors from backend when component mounts
  useEffect(() => {
    fetch("http://localhost:5000/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data)) // store fetched doctors in state
      .catch((err) => console.error("Failed to load doctors", err));
  }, []);

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter((doc) => {
    const term = searchTerm.toLowerCase();
    return (
      doc.name.toLowerCase().includes(term) || // search by doctor's name
      doc.services.some((s) =>
        s.name.toLowerCase().includes(term) // search by service name
      )
    );
  });

  // Navigate to DoctorDetails page when a doctor card is clicked
  const goToDoctor = (doc) => {
    navigate(`/doctor/${doc.id}`, { state: { doctor: doc } });
  };

  return (
    <div className="about-page">
      <h1>Our Doctors & Services</h1>

      {/* Search input to filter doctors */}
      <input
        type="text"
        placeholder="Search doctors or services..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Grid of doctor cards */}
      <div className="doctor-grid">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="doctor-card"
            onClick={() => goToDoctor(doc)}
          >
            {/* Show doctor's image if available */}
            {doc.image ? (
              <img
                src={doc.image}
                alt={doc.name}
                className="doctor-photo"
              />
            ) : (
              <div className="no-image">No Image</div>
            )}

            {/* Doctor's name */}
            <h2>{doc.name}</h2>

            {/* List of services offered by the doctor */}
            <ul className="service-list">
              {doc.services.map((service, i) => (
                <li key={i}>{service.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
