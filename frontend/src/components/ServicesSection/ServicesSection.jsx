import React from "react";
import styles from "./ServicesSection.module.css";

const services = [
  { title: "Dental treatments", img: "/images/dental.png" },
  { title: "Bones treatments", img: "/images/bones.png" },
  { title: "Diagnosis", img: "/images/diagnosis.png" },
  { title: "Cardiology", img: "/images/cardiology.png" },
  { title: "Surgery", img: "/images/surgery2.png" },
  { title: "Eye care", img: "/images/eyecare.png" },
];

const ServicesSection = () => {
  return (
    <section className={styles.services}>
      <h2>Services we provide</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      <div className={styles.grid}>
        {services.map((srv, i) => (
          <div key={i} className={styles.card}>
            <img src={srv.img} alt={srv.title} />
            <h4>{srv.title}</h4>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
