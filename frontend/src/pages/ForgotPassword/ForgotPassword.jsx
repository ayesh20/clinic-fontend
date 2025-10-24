import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Use full backend URL
      const res = await axios.post('http://localhost:5000/api/password/forgot-password', { email });

      if (res.data.success) {
        // Save email to localStorage for OTP verification
        localStorage.setItem('resetEmail', email);

        // Navigate to OTP verification page
        navigate('/OTPVerification', { state: { email } });
      } else {
        setMessage(res.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || error.message || 'Error sending OTP'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Forgot password</h1>
        <p className={styles.subtitle}>
          Please enter your email to reset the password
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <h2 className={styles.emailLabel}>Your Email</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.divider}></div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>

        {message && <p className={styles.message}>{message}</p>}

        <Link to="/" className={styles.backLink}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
