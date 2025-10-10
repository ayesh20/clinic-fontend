// ContactUs.js
import React from 'react';
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from './ContactUs.module.css';

const ContactUs = () => {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      
      {/* Hero Image Section - Only Image */}
      <div className={styles.heroSection}>
        <div className={styles.heroImage}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          {/* Page Title and Description */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Contact Us</h1>
            <p className={styles.pageDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          {/* Form Section */}
          <div className={styles.formSection}>
            {/* First Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <h3 className={styles.label}>First name</h3>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder="Enter your first name"
                />
              </div>
              <div className={styles.formGroup}>
                <h3 className={styles.label}>Email</h3>
                <input 
                  type="email" 
                  className={styles.inputField}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Second Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <h3 className={styles.label}>Last name</h3>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder="Enter your last name"
                />
              </div>
              <div className={styles.formGroup}>
                <h3 className={styles.label}>Phone number</h3>
                <input 
                  type="tel" 
                  className={styles.inputField}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className={styles.divider}></div>

            {/* Topic Selection - Dropdown */}
            <div className={styles.formGroup}>
              <h3 className={styles.label}>Choose a topic</h3>
              <select className={styles.selectField}>
                <option value="">Select one...</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="billing">Billing Question</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.divider}></div>

            {/* Message */}
            <div className={styles.formGroup}>
              <h3 className={styles.label}>Message</h3>
              <textarea 
                className={styles.textareaField}
                placeholder="Type your message..."
                rows="5"
              ></textarea>
            </div>

            <div className={styles.divider}></div>

            {/* Checkbox */}
            <div className={styles.checkboxGroup}>
              <input 
                type="checkbox" 
                id="terms" 
                className={styles.checkboxInput}
              />
              <label htmlFor="terms" className={styles.checkboxLabel}>
                I accept the terms
              </label>
            </div>

            <div className={styles.divider}></div>

            {/* Submit Button */}
            <div className={styles.submitSection}>
              <button className={styles.submitButton}>Submit</button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactUs;