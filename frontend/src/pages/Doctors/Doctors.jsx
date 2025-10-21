import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Doctors.module.css";
import axios from "axios";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState("All Categories");
  const navigate = useNavigate();

  const fetchDoctors = async (specialty = "") => {
    try {
      let url = "http://localhost:5000/api/doctors";
      if (specialty && specialty !== "All Categories") {
        url += `/specialization/${specialty}`;
      }
      const response = await axios.get(url);
      setDoctors(response.data.doctors || response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSpecialization(value);
    fetchDoctors(value);
  };

  const handleDoctorClick = (doctor) => {
    navigate("/appointment", { state: { doctor } });
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />

      <div className={styles.header}>
        <h2>Available Doctors For You</h2>
        <p>Meet Your Best Consultant</p>
      </div>

      <div className={styles.filter}>
        <label>Filter By Category</label>
        <select value={specialization} onChange={handleFilterChange}>
          <option>All Categories</option>
          <option>Cardiologist</option>
          <option>Neurologist</option>
          <option>Dentist</option>
          <option>Pediatrician</option>
        </select>
      </div>

      <div className={styles.cardsContainer}>
        {loading ? (
          <p>Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          doctors.map((doc) => (
            <div
              key={doc._id}
              className={styles.doctorCard}
              onClick={() => handleDoctorClick(doc)}
            >
              <img
                src={doc.profilePicture || "/images/doctor1.png"}
                alt={doc.fullName}
                className={styles.doctorImage}
              />
              <h3 className={styles.doctorName}>{doc.fullName}</h3>
              <p className={styles.specialty}>{doc.specialization}</p>
              <p className={styles.description}>
                Lorem ipsum dolor sit amet consecte adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.
              </p>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Doctors;
