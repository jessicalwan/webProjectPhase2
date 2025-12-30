import React, { useState } from "react";
import axios from "axios";
import "../styles/Contact.css";

function Contact() {
  // ---------- Form Data State ----------
  // Stores input values from the user
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  // ---------- Status & Loading State ----------
  // For showing submission messages and loading state
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ---------- Handle Input Changes ----------
  // Updates formData state when user types/selects input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // ---------- Handle Form Submission ----------
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setIsLoading(true);
    setStatus("Sending your message...");

    try {
      // Send data to backend API
      const response = await axios.post("http://localhost:5000/contact", formData);
      
      if (response.data.ok) {
        // Success feedback
        setStatus("Message sent successfully! We'll contact you soon.");
        // Reset form inputs
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (error) {
      // Handle errors (network or server)
      console.error("Error:", error);
      setStatus("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Contact Info ----------
  const contactInfo = {
    address: "123 Health Street, Medical City",
    phone: "+1 (800) 123-4567",
    email: "support@bluecare.com",
    hours: "Mon-Fri: 8AM-8PM, Sat: 9AM-5PM"
  };

  return (
    <div className="contact-page">
      {/* ---------- Page Header ---------- */}
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We're here to help. Get in touch with us for any questions.</p>
      </div>

      {/* ---------- Contact Info Cards ---------- */}
      <div className="contact-info-cards">
        <div className="info-card">
          <div className="card-icon">📞</div>
          <h3>Call Us</h3>
          <p>{contactInfo.phone}</p>
        </div>
        
        <div className="info-card">
          <div className="card-icon">✉️</div>
          <h3>Email Us</h3>
          <p>{contactInfo.email}</p>
        </div>
        
        <div className="info-card">
          <div className="card-icon">📍</div>
          <h3>Visit Us</h3>
          <p>{contactInfo.address}</p>
        </div>
      </div>

      {/* ---------- Contact Form ---------- */}
      <div className="contact-form-section">
        <h2>Send a Message</h2>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Subject */}
          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select a topic</option>
              <option value="appointment">Appointment Booking</option>
              <option value="general">General Inquiry</option>
              <option value="technical">Technical Support</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>

          {/* Message */}
          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message here..."
              rows="5"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </button>

          {/* Status Message */}
          {status && (
            <div className={`status-message ${isLoading ? 'loading' : ''}`}>
              {status}
            </div>
          )}
        </form>
      </div>

      {/* ---------- Business Hours ---------- */}
      <div className="business-hours">
        <h3>Business Hours</h3>
        <p>{contactInfo.hours}</p>
        <p>Closed on Sundays and public holidays</p>
      </div>
    </div>
  );
}

export default Contact;
