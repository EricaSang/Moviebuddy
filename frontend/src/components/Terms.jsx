import React from 'react';
import './StaticPages.css';

function Terms() {
  const lastUpdated = 'May 15, 2023';

  return (
    <div className="static-page">
      <div className="static-container">
        <h1 className="static-title">Terms of Service</h1>
        
        <div className="policy-metadata">
          <p><strong>Last Updated:</strong> {lastUpdated}</p>
        </div>
        
        <section className="static-section">
          <p className="policy-intro">
            Welcome to MovieBuddy! These Terms of Service ("Terms") govern your access to and use of the 
            MovieBuddy website, mobile application, and services (collectively, the "Service"). Please 
            read these Terms carefully before using our Service.
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you do not agree 
            to these Terms, please do not use the Service.
          </p>
        </section>
        
        <section className="static-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account or using any part of the Service, you acknowledge that you have read, 
            understood, and agree to be bound by these Terms. If you are using the Service on behalf of 
            an organization, you agree to these Terms on behalf of that organization and represent that 
            you have the authority to do so.
          </p>
        </section>
        
        <section className="static-section">
          <h2>2. Description of Service</h2>
          <p>
            MovieBuddy provides a platform for users to discover, explore, and discuss movies. Our Service 
            may include features such as movie information, ratings, reviews, recommendations, and user 
            accounts. We may modify, replace, or discontinue any aspect of the Service at any time.
          </p>
        </section>
        
        <section className="static-section">
          <h2>3. User Accounts</h2>
          <p>
            To access certain features of the Service, you must create a user account. You are responsible 
            for maintaining the confidentiality of your account credentials and for all activities that 
            occur under your account. You agree to:
          </p>
          <ul className="policy-list">
            <li>Provide accurate and complete information when creating your account.</li>
            <li>Update your information to keep it current.</li>
            <li>Protect the security of your account.</li>
            <li>Notify us immediately of any unauthorized use of your account.</li>
            <li>Accept responsibility for all activities that occur under your account.</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate your account if any information provided during 
            the registration process or thereafter proves to be inaccurate, false, or misleading, or if 
            you violate any provision of these Terms.
          </p>
        </section>
        
        <section className="static-section">
          <h2>4. User Content</h2>
          <p>
            Our Service allows you to post, link, store, share, and otherwise make available certain 
            information, text, graphics, videos, or other material ("User Content"). You retain any rights 
            that you may have in your User Content.
          </p>
          <p>
            By posting User Content on or through the Service, you grant us a worldwide, non-exclusive, 
            royalty-free license to use, copy, modify, adapt, distribute, and display such content in 
            connection with providing and promoting the Service.
          </p>
          <p>
            You are solely responsible for your User Content and the consequences of posting it. We do not 
            endorse any User Content or opinions expressed by users. By posting User Content, you represent 
            and warrant that:
          </p>
          <ul className="policy-list">
            <li>You own or have the necessary rights to use and authorize us to use your User Content.</li>
            <li>Your User Content does not violate the rights of any third party.</li>
            <li>Your User Content complies with these Terms and all applicable laws.</li>
          </ul>
        </section>
        
        <section className="static-section">
          <h2>5. Prohibited Activities</h2>
          <p>
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul className="policy-list">
            <li>Using the Service for any illegal purpose or in violation of any laws.</li>
            <li>Posting or transmitting unauthorized or unsolicited advertising, promotional materials, spam, or any other form of solicitation.</li>
            <li>Impersonating any person or entity, or falsely stating or misrepresenting your affiliation with a person or entity.</li>
            <li>Interfering with or disrupting the Service or servers or networks connected to the Service.</li>
            <li>Attempting to gain unauthorized access to any part of the Service, other accounts, or computer systems.</li>
            <li>Scraping, data-mining, or using automated methods to collect content from the Service.</li>
            <li>Posting content that is defamatory, obscene, offensive, or harmful.</li>
            <li>Infringing upon the intellectual property rights of others.</li>
          </ul>
        </section>
        
        <section className="static-section">
          <h2>6. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding User Content), features, and functionality are 
            and will remain the exclusive property of MovieBuddy and its licensors. The Service is protected 
            by copyright, trademark, and other laws of both the United States and foreign countries. Our 
            trademarks and trade dress may not be used in connection with any product or service without 
            the prior written consent of MovieBuddy.
          </p>
        </section>
        
        <section className="static-section">
          <h2>7. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior 
            notice or liability, for any reason, including, without limitation, if you breach these Terms.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately cease. If you wish to terminate 
            your account, you may simply discontinue using the Service or delete your account through the 
            settings.
          </p>
        </section>
        
        <section className="static-section">
          <h2>8. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. MOVIEBUDDY EXPRESSLY DISCLAIMS 
            ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE 
            IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            MOVIEBUDDY DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, 
            OR THAT ANY DEFECTS IN THE SERVICE WILL BE CORRECTED.
          </p>
        </section>
        
        <section className="static-section">
          <h2>9. Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL MOVIEBUDDY, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, 
            BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING 
            WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </p>
          <ul className="policy-list">
            <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE;</li>
            <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE;</li>
            <li>ANY CONTENT OBTAINED FROM THE SERVICE; OR</li>
            <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.</li>
          </ul>
        </section>
        
        <section className="static-section">
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. We will provide notice of 
            any changes by posting the updated Terms on this page. Your continued use of the Service after 
            any such changes constitutes your acceptance of the new Terms.
          </p>
        </section>
        
        <section className="static-section">
          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, 
            without regard to its conflict of law provisions.
          </p>
        </section>
        
        <section className="static-section">
          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="contact-info">
            <p>MovieBuddy</p>
            <p>123 Cinema Avenue</p>
            <p>Los Angeles, CA 90210</p>
            <p>Email: legal@moviebuddy.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Terms; 