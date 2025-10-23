import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import DoctorCard from "../../components/DoctorCard/DoctorCard";
import styles from "./Doctors.module.css";
import axios from 'axios'

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
  const [err, setErr] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr("");

        const res = await api.get("/doctors",);
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
        {Array.isArray(doctors) && doctors.length > 0 ? (
          doctors.map((doc) => (
            <DoctorCard
              key={doc._id}
              id={doc._id}
              image={toAbsolute(doc.profilePicture) }
              name={doc.fullName}
              specialty={(doc.specialization || "").toUpperCase()}
              rating={doc.rating ?? 4.7}
              doctor={doc}
            />
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
