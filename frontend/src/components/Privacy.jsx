import React from 'react';
import './StaticPages.css';

function Privacy() {
  const lastUpdated = 'May 15, 2023';

  return (
    <div className="static-page">
      <div className="static-container">
        <h1 className="static-title">Privacy Policy</h1>
        
        <div className="policy-metadata">
          <p><strong>Last Updated:</strong> {lastUpdated}</p>
        </div>
        
        <section className="static-section">
          <p className="policy-intro">
            At MovieBuddy, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website or use our service.
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
            policy, please do not access the site.
          </p>
        </section>
        
        <section className="static-section">
          <h2>Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect 
            via the Website includes:
          </p>
          
          <h3>Personal Data</h3>
          <p>
            Personally identifiable information, such as your name, email address, and telephone number, 
            that you voluntarily give to us when you register with the Website or when you choose to 
            participate in various activities related to the Website. You are under no obligation to 
            provide us with personal information of any kind, however your refusal to do so may prevent 
            you from using certain features of the Website.
          </p>
          
          <h3>Derivative Data</h3>
          <p>
            Information our servers automatically collect when you access the Website, such as your IP 
            address, your browser type, your operating system, your access times, and the pages you have 
            viewed directly before and after accessing the Website.
          </p>
          
          <h3>Financial Data</h3>
          <p>
            Financial information, such as data related to your payment method (e.g., valid credit card 
            number, card brand, expiration date) that we may collect when you purchase, order, return, 
            exchange, or request information about our services from the Website. We store only very 
            limited, if any, financial information that we collect. Otherwise, all financial information 
            is stored by our payment processor and you are encouraged to review their privacy policy and 
            contact them directly for responses to your questions.
          </p>
          
          <h3>User Content</h3>
          <p>
            Content such as reviews, ratings, preferences, and saved lists that you choose to upload or 
            provide when using our service.
          </p>
        </section>
        
        <section className="static-section">
          <h2>Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, 
            and customized experience. Specifically, we may use information collected about you via the 
            Website to:</p>
          <ul className="policy-list">
            <li>Create and manage your account.</li>
            <li>Deliver targeted advertising, newsletters, and other information regarding promotions to you.</li>
            <li>Email you regarding your account or order.</li>
            <li>Enable user-to-user communications.</li>
            <li>Generate movie recommendations based on your preferences and viewing history.</li>
            <li>Increase the efficiency and operation of the Website.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Website.</li>
            <li>Notify you of updates to the Website.</li>
            <li>Offer new products, services, and/or recommendations to you.</li>
            <li>Perform other business activities as needed.</li>
            <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
            <li>Process payments and refunds.</li>
            <li>Request feedback and contact you about your use of the Website.</li>
            <li>Resolve disputes and troubleshoot problems.</li>
            <li>Respond to customer service requests.</li>
          </ul>
        </section>
        
        <section className="static-section">
          <h2>Disclosure of Your Information</h2>
          <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
          
          <h3>By Law or to Protect Rights</h3>
          <p>
            If we believe the release of information about you is necessary to respond to legal process, 
            to investigate or remedy potential violations of our policies, or to protect the rights, 
            property, and safety of others, we may share your information as permitted or required by 
            any applicable law, rule, or regulation.
          </p>
          
          <h3>Third-Party Service Providers</h3>
          <p>
            We may share your information with third parties that perform services for us or on our behalf, 
            including payment processing, data analysis, email delivery, hosting services, customer service, 
            and marketing assistance.
          </p>
          
          <h3>Marketing Communications</h3>
          <p>
            With your consent, or with an opportunity for you to withdraw consent, we may share your 
            information with third parties for marketing purposes.
          </p>
          
          <h3>Business Transfers</h3>
          <p>
            If we reorganize or sell all or a portion of our assets, undergo a merger, or are acquired by 
            another entity, we may transfer your information to the successor entity.
          </p>
        </section>
        
        <section className="static-section">
          <h2>Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal 
            information. While we have taken reasonable steps to secure the personal information you provide 
            to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, 
            and no method of data transmission can be guaranteed against any interception or other type of 
            misuse.
          </p>
        </section>
        
        <section className="static-section">
          <h2>Policy for Children</h2>
          <p>
            We do not knowingly solicit information from or market to children under the age of 13. If you 
            become aware of any data we have collected from children under age 13, please contact us using 
            the contact information provided below.
          </p>
        </section>
        
        <section className="static-section">
          <h2>Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at:
          </p>
          <div className="contact-info">
            <p>MovieBuddy</p>
            <p>123 Cinema Avenue</p>
            <p>Los Angeles, CA 90210</p>
            <p>Email: privacy@moviebuddy.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Privacy; 