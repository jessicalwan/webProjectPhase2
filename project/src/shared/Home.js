import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import background1 from '../assets/medical-background.jpg';
import background2 from '../assets/doctor.jpg';
import background3 from '../assets/doctor-patient.jpg';

import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  const images = [background1, background2, background3];

  const [index, setIndex] = useState(0);

  // Automatic image slideshow every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="home">
      <div
        className="slideshow"
        style={{ backgroundImage: `url(${images[index]})` }}
      ></div>

      <div className="home-content">
        <h1 className="hospital-name">✦ Chouf City Medical Center ✦</h1>

        <p
          className="search-link"
          onClick={() => navigate('/about')}
        >
          Search for doctor or service →
        </p>
      </div>
    </div>
  );
}

export default Home;