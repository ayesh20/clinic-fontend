import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faUser, faVenusMars, faHeart, faStethoscope, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import styles from "./DoctorProfile.module.css";
import Navbar from '../../components/Navbar/Navbar'; 
import Footer from '../../components/Footer/Footer'; 
import axios from "axios";

// Temporary image URL
const TEMP_DOCTOR_IMAGE = 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Dr+Anya';

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("Select");
  const [specialization, setSpecialization] = useState("Select");

  // Fetch doctor profile on load
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const token = localStorage.getItem("authToken"); // token stored by login
      if (!token) {
        console.warn("No doctor token found. Please login.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/doctors/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const doctorData = res.data.doctor || res.data; // backend may return { doctor: {...} }
        setDoctor(doctorData);
        setBio(doctorData.bio || "");
        setGender(doctorData.gender || "Select");
        setSpecialization(doctorData.specialization || "Select");
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
        alert("Session expired or not authorized. Please login again.");
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  const handleEditPhotoClick = () => {
    setIsEditingPhoto(!isEditingPhoto);
    alert(`Photo Editing mode is now: ${!isEditingPhoto ? 'ON' : 'OFF'}`);
  };
  
     const handleMakeAppointment = () => {
  navigate('/viewappointment');
};

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must login first!");
      return;
    }

    try {
      const payload = { bio, gender, specialization };
      const res = await axios.put(
        "http://localhost:5000/api/doctors/profile",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Profile updated successfully!");
      setDoctor(res.data.doctor || res.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className={styles.container}>
          <h2>Loading your profile...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div>
        <Navbar />
        <div className={styles.container}>
          <h2>Please login to view your profile</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title}>Manage Your Profile</h1>

        {/* Profile Image */}
        <div className={styles.profileSection}>
          <div className={styles.profileImageContainer}>
            <img 
              src={doctor.profilePicture ? `http://localhost:5000${doctor.profilePicture}` : TEMP_DOCTOR_IMAGE}
              alt="Doctor Profile"
              className={styles.profileImage}
            />
          </div>
          <div className={styles.nameAndEdit}>
            <p className={styles.doctorName}>{doctor.fullName || "Unknown Doctor"}</p>
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
            <strong>Bio</strong>
          </label>
          <div className={styles.bioContainer}>
            <textarea
              className={`${styles.input} ${styles.textArea}`}
              placeholder="Enter your professional biography..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        {/* Full Name */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FontAwesomeIcon icon={faUser} className={styles.icon} />
            Full Name
          </label>
          <input type="text" value={doctor.fullName || ""} readOnly className={styles.input} />
        </div>

        {/* Gender */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FontAwesomeIcon icon={faVenusMars} className={styles.icon} />
            Gender
          </label>
          <select 
            className={styles.input} 
            value={gender} 
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="Select">Select Gender</option>
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
          <input type="text" value={doctor.dob || ""} readOnly className={styles.input} />
        </div>

        {/* Specialization */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FontAwesomeIcon icon={faStethoscope} className={styles.icon} />
            Specialization
          </label>
          <select 
            className={styles.input} 
            value={specialization} 
            onChange={(e) => setSpecialization(e.target.value)}
          >
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
          <input type="email" value={doctor.email || ""} readOnly className={styles.input} />
        </div>

        {/* Contact Number */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FontAwesomeIcon icon={faPhone} className={styles.icon} />
            Contact Number
          </label>
          <input type="tel" value={doctor.phone || ""} readOnly className={styles.input} />
        </div>
       
       <button className={styles.appointmentButton} onClick={handleMakeAppointment}>
  Make Appointment
</button>
        {/* Save Changes */}
        <button className={styles.saveButton} onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorProfile;
