import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ add this
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Doctors.module.css";
import axios from "axios";

const API_ORIGIN = "http://localhost:5000";
const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  withCredentials: false,
});

const toAbsolute = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_ORIGIN}${path}`;
};

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate(); // ✅ add this

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr("");
        const res = await api.get("/doctors");
        const list = Array.isArray(res.data) ? res.data : res.data.doctors || [];
        setDoctors(list);
      } catch (e) {
        console.error("Failed to load doctors:", e);
        setErr(e?.response?.data?.message || e.message || "Failed to load doctors");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredDoctors =
    filter === "All"
      ? doctors
      : doctors.filter(
          (doc) =>
            doc.specialization?.toLowerCase() === filter.toLowerCase()
        );

  const handleDoctorClick = (doctor) => {
    navigate("/appointment", { state: { doctor } }); // ✅ passing doctor data
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.header}>
        <h2>Available Doctors For You</h2>
        <p>Meet Your Best Consultant</p>
      </div>

      <div className={styles.filter}>
        <label htmlFor="category">Filter By Category:</label>
        <div className={styles.selectWrapper}>
          <select
            id="category"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Cardiologist</option>
            <option>Neurologist</option>
            <option>Dentist</option>
            <option>Pediatrician</option>
            <option>Dermatologist</option>
          </select>
          <span className={styles.arrow}>▼</span>
        </div>
      </div>

      <div className={styles.cardsContainer}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              className={styles.doctorCard}
              onClick={() => handleDoctorClick(doc)} // ✅ navigate on click
            >
              <img
                src={toAbsolute(doc.profilePicture)}
                alt={doc.fullName}
                className={styles.doctorImage}
              />
              <h3 className={styles.doctorName}>Dr. {doc.fullName}</h3>
              <p className={styles.specialty}>
                {(doc.specialization || "General").toUpperCase()}
              </p>
              <p className={styles.description}>
                {doc.bio?.slice(0, 80) ||
                  "Dedicated and experienced medical professional focused on providing the best care."}
              </p>
            </div>
          ))
        ) : !loading && !err ? (
          <div style={{ padding: 16 }}>No doctors found.</div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
};

export default Doctors;
