import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SetNewPassword.module.css';
import axios from 'axios';

const SetNewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Passwords don't match");
    }

    if (password.length < 8) {
      return alert("Password must be at least 8 characters long");
    }

    const email = localStorage.getItem('resetEmail');
    if (!email) {
      return alert('Email not found. Please restart the password reset process.');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/password/reset-password', {
        email,
        newPassword: password,
      });

      if (res.data.success) {
        localStorage.removeItem('resetEmail');
        navigate('/SuccessfulReset');
      } else {
        alert(res.data.message || 'Password reset failed');
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Password reset failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Set a new password</h1>
        <p className={styles.subtitle}>
          Create a new password. Ensure it differs from previous ones for security
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Password Field */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                placeholder="Enter your new password"
                required
              />
              <div className={styles.passwordDots}>
                {password.length > 0 && (showPassword ? password : '•'.repeat(password.length))}
              </div>
              <button
                type="button"
                className={styles.visibilityToggle}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.inputField}
                placeholder="Confirm your new password"
                required
              />
              <div className={styles.passwordDots}>
                {confirmPassword.length > 0 && (showConfirmPassword ? confirmPassword : '•'.repeat(confirmPassword.length))}
              </div>
              <button
                type="button"
                className={styles.visibilityToggle}
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className={styles.divider}></div>

          <button type="submit" className={styles.updateButton}>
            Update Password
          </button>
        </form>

        <Link to="/login" className={styles.backLink}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default SetNewPassword;
