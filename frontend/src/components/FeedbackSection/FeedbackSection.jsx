import React from "react";
import styles from "./FeedbackSection.module.css";

const FeedbackSection = () => {
  return (
    <section className={styles.feedback}>
      <h2>Add Your Feedback</h2>
      <form className={styles.form}>
        <input type="text" placeholder="Your Name" />
        <input type="email" placeholder="Your Email" />
        <textarea placeholder="Your Message"></textarea>
        <button type="submit">Submit</button>
      </form>
    </section>
  );
};

export default FeedbackSection;
