import React from "react";
import styles from "./DoctorCard.module.css";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorCard = ({ id, image, name, specialty, rating }) => {
  return (

    <Link
      to={`/doctors/${id}/book`}
      className={styles.cardLink}
    >
      <div className={styles.card}>
        <img src={image} alt={name} className={styles.image} />
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.specialty}>{specialty}</p>
        <p className={styles.description}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.
        </p>
        <div className={styles.rating}>
          <Star size={14} className={styles.icon} />
          <span>{rating}</span>
        </div>
      </div>
    </Link>

  );
};

export default DoctorCard;
