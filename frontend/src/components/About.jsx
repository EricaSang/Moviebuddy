import React from 'react';
import './StaticPages.css';

function About() {
  return (
    <div className="static-page">
      <div className="static-container">
        <h1 className="static-title">About Us</h1>
        
        <section className="static-section">
          <h2>Our Story</h2>
          <p>
            MovieBuddy was founded in 2023 with a simple mission: to connect movie enthusiasts with the films they love. 
            What started as a passion project has grown into a comprehensive platform for discovering, exploring, and 
            discussing movies from around the world.
          </p>
        </section>
        
        <section className="static-section">
          <h2>Our Mission</h2>
          <p>
            At MovieBuddy, we believe that great movies have the power to inspire, educate, and transform. Our mission 
            is to create the most user-friendly and comprehensive movie discovery platform, helping people find films 
            that resonate with them, regardless of genre, era, or country of origin.
          </p>
        </section>
        
        <section className="static-section">
          <h2>What We Offer</h2>
          <div className="feature-grid">
            <div className="feature">
              <h3>Extensive Database</h3>
              <p>Access information on thousands of movies, from Hollywood blockbusters to indie gems.</p>
            </div>
            
            <div className="feature">
              <h3>Personalized Recommendations</h3>
              <p>Our algorithm learns your preferences to suggest movies you'll love.</p>
            </div>
            
            <div className="feature">
              <h3>User Reviews</h3>
              <p>Read authentic opinions from our community of movie enthusiasts.</p>
            </div>
            
            <div className="feature">
              <h3>Watch Lists</h3>
              <p>Create and manage lists of movies you want to watch or have already seen.</p>
            </div>
          </div>
        </section>
        
        <section className="static-section">
          <h2>Our Team</h2>
          <p>
            MovieBuddy is powered by a diverse team of film lovers, tech experts, and creative thinkers. 
            United by our passion for cinema, we work tirelessly to improve and expand our platform.
          </p>
          
          <div className="team-members">
            <div className="team-member">
              <div className="member-avatar"></div>
              <h3>Apoorva K.C</h3>
              <p>Founder & CEO</p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar"></div>
              <h3>Apoorva K.C</h3>
              <p>Chief Content Officer</p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar"></div>
              <h3>Apoorva K.C</h3>
              <p>Lead Developer</p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar"></div>
              <h3>Apoorva K.C</h3>
              <p>UX Designer</p>
            </div>
          </div>
        </section>
        
        <section className="static-section">
          <h2>Join Us on Our Journey</h2>
          <p>
            We're just getting started, and we invite you to be part of our growing community. Whether you're 
            a casual moviegoer or a dedicated cinephile, MovieBuddy is designed with you in mind.
          </p>
          <p>
            Have questions or suggestions? We'd love to hear from you! Visit our <a href="/contact">Contact page</a> to get in touch.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About; 