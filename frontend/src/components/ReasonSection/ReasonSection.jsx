import React from "react";
import styles from "./ReasonSection.module.css";

const ReasonSection = () => {
  return (
    <section className={styles.reason}>
      <div className={styles.text}>
        <h2>You have lots of reasons to choose us</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Mattis sit
          phasellus mollis elit aliquam et nullam.
        </p>
      </div>
      <div className={styles.image}>
        <img src="/images/surgery.png" alt="Surgery" />
      </div>
    </section>
  );
};

export default ReasonSection;
