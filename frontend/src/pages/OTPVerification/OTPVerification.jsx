import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './OTPVerification.module.css';
import axios from 'axios';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [email] = useState(localStorage.getItem('resetEmail') || 'contact@dscode.com');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      if (!otp[index] && index > 0) inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1].focus();
    else if (e.key === 'ArrowRight' && index < 4) inputRefs.current[index + 1].focus();
  };

  const handleInput = (index, e) => {
    const value = e.target.value;
    if (value.length > 1) {
      const lastDigit = value.slice(-1);
      const newOtp = [...otp];
      newOtp[index] = lastDigit;
      setOtp(newOtp);
      if (index < 4) inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d{5}$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 5);
      setOtp(newOtp);
      newOtp.forEach((digit, index) => {
        if (inputRefs.current[index]) inputRefs.current[index].value = digit;
      });
      if (inputRefs.current[4]) inputRefs.current[4].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    try {
      const res = await axios.post('http://localhost:5000/api/password/verify-otp', {
        email,
        otp: code,
      });

      if (res.data.success) {
        navigate('/SetNewPassword');
      } else {
        alert(res.data.message || 'Invalid OTP');
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/password/forgot-password', { email });
      if (res.data.success) {
        setTimeLeft(60);
        setIsResendDisabled(true);
        setOtp(['', '', '', '', '']);
      } else {
        alert(res.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const handleInputClick = (index) => {
    if (inputRefs.current[index]) inputRefs.current[index].focus();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Check your email</h1>
        <p className={styles.subtitle}>
          We sent a reset link to <span className={styles.email}>{email}</span>
        </p>
        <p className={styles.instruction}>Enter 5-digit code from the email</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onInput={(e) => handleInput(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                onClick={() => handleInputClick(index)}
                className={styles.otpInput}
                required
              />
            ))}
          </div>

          <button
            type="submit"
            className={styles.verifyButton}
            disabled={otp.join('').length !== 5}
          >
            Verify Code
          </button>
        </form>

        <div className={styles.resendContainer}>
          <p className={styles.resendText}>
            Haven't got the email yet?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResendDisabled}
              className={styles.resendButton}
            >
              <strong>Resend email</strong>
              {isResendDisabled && ` (${timeLeft}s)`}
            </button>
          </p>
        </div>

        <Link to="/forgot-password" className={styles.backLink}>
          ← Back to Forgot Password
        </Link>
      </div>
    </div>
  );
};

export default OTPVerification;
