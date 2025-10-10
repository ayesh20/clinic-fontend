import React, { useState } from "react";
import styles from "./PatientManagement.module.css";

export default function PatientManagement() {
  const [profilePic, setProfilePic] = useState("/default-profile.jpg");
  const [formData, setFormData] = useState({
    bio: "Hello! I’m a patient at the clinic.",
    firstName: "Tharindu",
    lastName: "Perera",
    telNo: "0712345678",
    address1: "No. 12",
    address2: "Main Street",
    address3: "Colombo",
    birthday: { year: 1999, month: "May", day: 15 },
  });

  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBirthdayChange = (field, value) => {
    setFormData({
      ...formData,
      birthday: { ...formData.birthday, [field]: value },
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className={styles.profileWrapper}>
       <div className={styles.container}>
      <h2 className={styles.title}>Edit Profile</h2>

      <div className={styles.profileContainer}>
        <div className={styles.imageSection}>
          <img
            src={profilePic}
            alt="Profile"
            className={styles.profileImage}
          />
          <label className={styles.uploadBtn}>
            Upload Photo
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>
        </div>

        <form onSubmit={handleSubmit} className={styles.formSection}>
          <div className={styles.formGroup}>
            <label>Bio</label>
            <textarea
              name="bio"
              className={styles.textarea}
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                className={styles.input}
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                className={styles.input}
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Telephone Number</label>
            <input
              type="tel"
              name="telNo"
              className={styles.input}
              value={formData.telNo}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Address Line 1</label>
            <input
              type="text"
              name="address1"
              className={styles.input}
              value={formData.address1}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Address Line 2</label>
            <input
              type="text"
              name="address2"
              className={styles.input}
              value={formData.address2}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Address Line 3</label>
            <input
              type="text"
              name="address3"
              className={styles.input}
              value={formData.address3}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Birthday</label>
            <div className={styles.birthdayRow}>
              <select
                value={formData.birthday.year}
                onChange={(e) => handleBirthdayChange("year", e.target.value)}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={formData.birthday.month}
                onChange={(e) => handleBirthdayChange("month", e.target.value)}
              >
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={formData.birthday.day}
                onChange={(e) => handleBirthdayChange("day", e.target.value)}
              >
                {days.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className={styles.saveBtn}>
            Save Changes
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
