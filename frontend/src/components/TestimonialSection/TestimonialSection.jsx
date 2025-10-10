import React from "react";
import styles from "./TestimonialSection.module.css";

const testimonials = [
  { 
    name: "John Carter", 
    quote: "An amazing service",
    description: "Lorem ipsum dolor sit ametdill col consectetur adipiscing lectus a nunc mauris scelerisque sed egestas."
  },
  { 
    name: "Sophie Moore", 
    quote: "One of a kind service",
    description: "Ultrices eros in cursus turpis massa tincidunt sem nulla pharetra diam sit amet nisl suscipit adipis."
  },
  { 
    name: "Andy Smith", 
    quote: "The best service",
    description: "Convallis posuere morbi leo urna molestie at elementum eu facilisis sapien pellentesque habitant."
  },
];

const TestimonialSection = () => {
  return (
    <section className={styles.testimonial}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Testimonial</h2>
          <p className={styles.subtitle}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar<br />
            elementum tempus hac tellus libero accumsan.
          </p>
          <div className={styles.divider}></div>
        </div>
        
        <div className={styles.grid}>
          {testimonials.map((testimonial, i) => (
            <div key={i} className={styles.card}>
              <h3 className={styles.quote}>"{testimonial.quote}"</h3>
              <p className={styles.description}>{testimonial.description}</p>
              <div className={styles.author}>
                <strong>{testimonial.name}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;