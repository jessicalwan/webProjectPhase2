import React, { useState } from "react";
import "../styles/FAQ.css";
import { useNavigate } from "react-router-dom";
function FAQs() {
    const navigate = useNavigate();
  const [openIndexes, setOpenIndexes] = useState([]); // Support multiple open FAQs

  const faqs = [
    {
      id: 1,
      question: "How do I book an appointment?",
      answer: "Choose a doctor, select a service, pick an available date and time, then confirm your booking by entering your details."
    },
    {
      id: 2,
      question: "Can I cancel or reschedule an appointment?",
      answer: "Yes. You can cancel your appointment from the Appointments page. To reschedule, cancel the current booking and choose a new time slot."
    },
    {
      id: 3,
      question: "Are doctors verified?",
      answer: "Yes. All doctors listed on our platform are licensed healthcare professionals with verified credentials and experience."
    },
    {
      id: 4,
      question: "Is my personal data secure?",
      answer: "Absolutely. We use enterprise-grade encryption and comply with HIPAA regulations. Your information is stored securely and used only for appointment management."
    },
    {
      id: 5,
      question: "What if the selected time slot is already taken?",
      answer: "If a time slot becomes unavailable before confirmation, you'll be notified immediately and prompted to select another available time."
    },
    {
      id: 6,
      question: "Do I need to register to book an appointment?",
      answer: "Yes. Registration is required to confirm your booking, manage appointments, and ensure continuity of care."
    }
  ];

  const toggleFAQ = (id) => {
    setOpenIndexes(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    setOpenIndexes(openIndexes.length === faqs.length ? [] : faqs.map(faq => faq.id));
  };

  return (
    <div className="faq-page" role="main" aria-label="Frequently Asked Questions">
      <header className="faq-header">
        <h1 className="faq-title">Patient Help Center</h1>
        <p className="faq-subtitle">
          Find answers to frequently asked questions about our appointment system
        </p>
        <div className="faq-stats">
          <span className="stat-item">
            <strong>{faqs.length}</strong> Common Questions
          </span>
          <span className="stat-item">
            <strong>24/7</strong> Support Available
          </span>
        </div>
      </header>

      <div className="faq-controls">
        <button 
          className="toggle-all-btn"
          onClick={toggleAll}
          aria-label={openIndexes.length === faqs.length ? "Collapse all FAQs" : "Expand all FAQs"}
        >
          {openIndexes.length === faqs.length ? "Collapse All" : "Expand All"}
        </button>
        <p className="hint-text">Click on any question to expand</p>
      </div>

      <div className="faq-list" role="region" aria-label="FAQ List">
        {faqs.map((faq) => {
          const isOpen = openIndexes.includes(faq.id);
          
          return (
            <div 
              key={faq.id} 
              className={`faq-item ${isOpen ? 'active' : ''}`}
              role="article"
              aria-expanded={isOpen}
            >
              <div className="faq-header">
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-controls={`faq-answer-${faq.id}`}
                  aria-expanded={isOpen}
                >
                  <span className="question-text">{faq.question}</span>
                  <span className="icon" aria-hidden="true">
                    {isOpen ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </span>
                </button>
              </div>
              
              <div 
                id={`faq-answer-${faq.id}`}
                className="faq-answer-container"
                role="region"
                aria-labelledby={`faq-question-${faq.id}`}
              >
                <div className="faq-answer-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="faq-footer">
        <p className="support-note">
          Still have questions? Our support team is available 24/7.
        </p>
        <div className="action-buttons">
      
          <button className="btn-primary" onClick={() => navigate('/contact')}>Contact Support</button>
          <button className="btn-secondary">View Detailed Guides</button>
        </div>
      </div>
    </div>
  );
}

export default FAQs;