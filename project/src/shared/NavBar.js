import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* Logo / Name */}
        <div className="nav-logo">BlueCare</div>

        {/* Hamburger for Mobile */}
        <div 
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Links */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>Doctors</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          <li><Link to="/appointments" onClick={() => setMenuOpen(false)}>Appointments</Link></li>
        <li><Link to="/faqs" onClick={() => setMenuOpen(false)}>FAQ</Link></li>
        </ul>

      </div>
    </nav>
  );
}

export default NavBar;
