import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">

        {/* About Section */}
        <div className="footer-section">
          <h3>BlueCare Hub</h3>
          <p>Your trusted platform for online medical consultations. Providing quality care with certified doctors at your fingertips.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">Doctors</Link></li>
            <li><Link to="/appointments">Appointments</Link></li>
            <li><Link to="/faqs">FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📞+1 (800) 123-4567</p>
          <p>📧 contact@bluecarehub.com</p>
          <p>📍 Chouf, Lebanon</p>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="footer-socials">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://wa.me/96170000000" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2025 BlueCare Hub • All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
