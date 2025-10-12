import React from "react";
import styles from "./AppointmentCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

const AppointmentCard = ({ name, email, issue, phone, date, time }) => {
  return (
    <div className={styles.card}>
      <h4>{name}</h4>
      <p><FontAwesomeIcon icon={faEnvelope} /> {email}</p>
      <p>{issue}</p>
      <p><FontAwesomeIcon icon={faPhone} /> {phone}</p>
      <p>{date}</p>
      <p>{time}</p>
    </div>
  );
};

export default AppointmentCard;
