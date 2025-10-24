// ContactUs.js
import React from 'react';
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from './ContactUs.module.css';

const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

const ContactUs = () => {
  const [form, setForm] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
    terms: false
  });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.message || !form.terms) {
      alert('Please fill all required fields and accept the terms.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          topic: form.topic || 'general',
          message: form.message,
          termsAccepted: form.terms
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send');

      alert('Message sent! We’ll get back to you shortly.');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        topic: '',
        message: '',
        terms: false
      });
    } catch (err) {
      alert(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />

      <div className={styles.heroSection}>
        <div className={styles.heroImage}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Contact Us</h1>
            <p className={styles.pageDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          {/* Wrap as a form */}
          <form className={styles.formSection} onSubmit={handleSubmit} noValidate>
            {/* First Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <h3 className={styles.label}>First name</h3>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <h3 className={styles.label}>Email</h3>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Second Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <h3 className={styles.label}>Last name</h3>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Enter your last name"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <h3 className={styles.label}>Phone number</h3>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className={styles.divider}></div>

            {/* Topic */}
            <div className={styles.formGroup}>
              <h3 className={styles.label}>Choose a topic</h3>
              <select
                name="topic"
                value={form.topic}
                onChange={handleChange}
                className={styles.selectField}
              >
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
                name="message"
                value={form.message}
                onChange={handleChange}
                className={styles.textareaField}
                placeholder="Type your message..."
                rows="5"
                required
              />
            </div>

            <div className={styles.divider}></div>

            {/* Checkbox */}
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
                className={styles.checkboxInput}
                required
              />
              <label htmlFor="terms" className={styles.checkboxLabel}>
                I accept the terms
              </label>
            </div>

            <div className={styles.divider}></div>

            {/* Submit */}
            <div className={styles.submitSection}>
              <button className={styles.submitButton} type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;