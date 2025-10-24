import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SuccessfulReset.module.css';

const SuccessfulReset = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <svg className={styles.checkIcon} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#49BBBD" />
            <path d="M30,50 L45,65 L70,35" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        
        <h1 className={styles.title}>Password Reset Successful</h1>
        <p className={styles.subtitle}>
          Your password has been successfully reset. Click confirm to login with your new password.
        </p>
        
        <button className={styles.confirmButton} onClick={handleConfirm}>
          Confirm
        </button>
        
        <button className={styles.backLink} onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
            <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessfulReset;
