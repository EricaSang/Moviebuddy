import React, { useState } from 'react';
import './StaticPages.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // In a real application, you would send this data to your backend
    setFormSubmitted(true);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="static-page">
      <div className="static-container">
        <h1 className="static-title">Contact Us</h1>
        
        <section className="static-section">
          <p className="contact-intro">
            We'd love to hear from you! Whether you have a question about features, pricing, 
            need a demo, or anything else, our team is ready to answer all your questions.
          </p>
        </section>
        
        <div className="contact-grid">
          <div className="contact-info">
            <section className="static-section">
              <h2>Get in Touch</h2>
              <div className="contact-method">
                <h3>Email</h3>
                <p>support@moviebuddy.com</p>
              </div>
              
              <div className="contact-method">
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
              </div>
              
              <div className="contact-method">
                <h3>Address</h3>
                <p>
                  MovieBuddy Headquarters<br />
                  123 Cinema Avenue<br />
                  Los Angeles, CA 90210<br />
                  United States
                </p>
              </div>
              
              <div className="contact-method">
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9am - 6pm PST</p>
              </div>
            </section>
            
            <section className="static-section">
              <h2>Follow Us</h2>
              <div className="social-links">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">YouTube</a>
              </div>
            </section>
          </div>
          
          <div className="contact-form-container">
            <h2>Send Us a Message</h2>
            
            {formSubmitted ? (
              <div className="success-message">
                <h3>Thank you for contacting us!</h3>
                <p>We've received your message and will get back to you as soon as possible.</p>
                <button 
                  className="reset-form-btn"
                  onClick={() => setFormSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            )}
          </div>
        </div>
        
        <section className="static-section">
          <h2>FAQ</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>How do I create an account?</h3>
              <p>
                To create an account, click the "Sign Up" button in the top right corner of the page.
                Fill out the registration form with your details and follow the instructions.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>Is MovieBuddy free to use?</h3>
              <p>
                MovieBuddy offers both free and premium plans. The basic features are free,
                while premium plans offer additional features like advanced filtering and no advertisements.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>How do I reset my password?</h3>
              <p>
                If you forgot your password, click on the "Login" button, then select "Forgot Password".
                Follow the instructions sent to your email to reset your password.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>Can I suggest a movie to be added?</h3>
              <p>
                Yes! We welcome suggestions. Use the contact form above and include as much information
                about the movie as possible. Our content team reviews all suggestions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact; 