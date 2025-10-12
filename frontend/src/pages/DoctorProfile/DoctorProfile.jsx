import React, { useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faUser, faVenusMars, faHeart, faStethoscope, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import styles from "./DoctorProfile.module.css";
import Navbar from '../../components/Navbar/Navbar'; 
import Footer from '../../components/Footer/Footer'; 

// Temporary image URL (using a placeholder)
const TEMP_DOCTOR_IMAGE = 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Dr+Anya';

const DoctorProfile = () => {
  // Use state hook for a button action (e.g., photo edit status)
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  const handleEditPhotoClick = () => {
    setIsEditingPhoto(!isEditingPhoto);
    alert(`Photo Editing mode is now: ${!isEditingPhoto ? 'ON' : 'OFF'}`);
  };

  const handleSaveChanges = () => {
      alert("Changes saved successfully!");
  }

  return (
    
    <div>
      <Navbar />

      {/* Main Profile Content */}
      <div className={styles.container}>
        <h1 className={styles.title}>Manage Your Profile</h1>

        {/* ... (Rest of your profile content) ... */}
        
        <div className={styles.profileSection}>
          <div className={styles.profileImageContainer}>
            <img src={TEMP_DOCTOR_IMAGE} alt="Doctor Profile" className={styles.profileImage} />
          </div>
          <div className={styles.nameAndEdit}>
            <p className={styles.doctorName}>Dr. Anya Sharma</p>
            <button 
              className={styles.editButton}
              onClick={handleEditPhotoClick}
            >
              {isEditingPhoto ? 'Cancel Edit' : 'Edit Photo'}
            </button>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Personal Information</h2>
        
        {/* Bio */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FontAwesomeIcon icon={faAddressCard} className={styles.icon} />
            <strong>Bio</strong> <span className={styles.bioAd}>(AD)</span>
          </label>
          <div className={styles.bioContainer}>
              <textarea className={`${styles.input} ${styles.textArea}`} placeholder="Enter your professional biography here..."></textarea>
          </div>
        </div>
        
        {/* Full Name */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FontAwesomeIcon icon={faUser} className={styles.icon} />
            Full Name
          </label>
          <input type="text" defaultValue="Dr. Anya" readOnly className={styles.input} />
        </div>
        
        {/* Gender */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FontAwesomeIcon icon={faVenusMars} className={styles.icon} />
            Gender
          </label>
          <select className={styles.input} defaultValue="Female">
            <option value="Select">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FontAwesomeIcon icon={faHeart} className={styles.icon} />
            Date of Birth
          </label>
          <input type="text" defaultValue="1993/04/22" readOnly className={styles.input} />
        </div>

        {/* Specialization */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FontAwesomeIcon icon={faStethoscope} className={styles.icon} />
            Specialization
          </label>
          <select className={styles.input} defaultValue="Cardiologist">
            <option value="Select">Select Specialization</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Dermatologist">Dermatologist</option>
          </select>
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
            Email
          </label>
          <input type="email" defaultValue="Anya@gmail.com" readOnly className={styles.input} />
        </div>

        {/* Contact Number */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FontAwesomeIcon icon={faPhone} className={styles.icon} />
            Contact Number
          </label>
          <input type="tel" defaultValue="+1 2344556 78899" readOnly className={styles.input} />
        </div>

        {/* Save Changes Button */}
        <button className={styles.saveButton} onClick={handleSaveChanges}>Save Changes</button>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorProfile;