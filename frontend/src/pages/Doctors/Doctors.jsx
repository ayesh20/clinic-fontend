import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import DoctorCard from "../../components/DoctorCard/DoctorCard";
import styles from "./Doctors.module.css";

const Doctors = () => {
  const doctors = [
    { id: 1, image: "/images/doctor1.png", name: "Dr. John Carter", specialty: "CARDIOLOGIST", rating: 4.7 },
    { id: 2, image: "/images/doctor1.png", name: "Dr. John Carter", specialty: "CARDIOLOGIST", rating: 4.7 },
    { id: 3, image: "/images/doctor1.png", name: "Dr. John Carter", specialty: "CARDIOLOGIST", rating: 4.7 },
    { id: 4, image: "/images/doctor1.png", name: "Dr. John Carter", specialty: "CARDIOLOGIST", rating: 4.7 },
    { id: 5, image: "/images/doctor1.png", name: "Dr. John Carter", specialty: "CARDIOLOGIST", rating: 4.7 },
    { id: 6, image: "/images/doctor1.png", name: "Dr. John Carter", specialty: "CARDIOLOGIST", rating: 4.7 },
  ];

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.header}>
        <h2>Available Doctors For You</h2>
        <p>Meet Your Best Consultant</p>
      </div>

      <div className={styles.filter}>
        <label>Filter By Category</label>
        <select>
          <option>All Categories</option>
          <option>Cardiologist</option>
          <option>Neurologist</option>
          <option>Dentist</option>
          <option>Pediatrician</option>
        </select>
      </div>

      <div className={styles.cardsContainer}>
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} {...doc} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Doctors;
