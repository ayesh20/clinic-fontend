import React from "react";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textArea}>
            <h1>
              Providing Quality <span>Healthcare</span> For A{" "}
              <span className={styles.highlight}>Brighter And Healthy</span> Future
            </h1>
            <p className={styles.subtitle}>
              You have lots of reasons to choose us. Some people do not understand, 
              although it seems psychotherapeutic to players in order.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.primaryBtn}>Get Started</button>
              <button className={styles.secondaryBtn}>Learn More</button>
            </div>
          </div>

          <div className={styles.imageArea}>
            <div className={styles.imageContainer}>
              <div className={styles.circleBackground}></div>
              <img 
                src="/images/doctor.png" 
                alt="Professional Doctor" 
                className={styles.doctorImage} 
              />
              <div className={styles.floatingElement1}></div>
              <div className={styles.floatingElement2}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;