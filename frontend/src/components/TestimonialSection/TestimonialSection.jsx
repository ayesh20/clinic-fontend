import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./TestimonialSection.module.css";

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/feedback");
        setTestimonials(res.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchFeedbacks();
  }, []);

  const nextSlide = () => {
    if (testimonials.length > 3) {
      setIndex((prev) => (prev + 3) % testimonials.length);
    }
  };

  const prevSlide = () => {
    if (testimonials.length > 3) {
      setIndex((prev) =>
        prev - 3 < 0 ? testimonials.length - (testimonials.length % 3 || 3) : prev - 3
      );
    }
  };

  const visibleTestimonials = testimonials.slice(index, index + 3);

  return (
    <section className={styles.testimonial}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Testimonial</h2>
          <p className={styles.subtitle}>
            Read what our patients have to say about their experience with us.
          </p>
          <div className={styles.divider}></div>
        </div>

        {testimonials.length > 0 ? (
          <div className={styles.carouselWrapper}>
            <button
              className={`${styles.navButton} ${styles.left}`}
              onClick={prevSlide}
              disabled={testimonials.length <= 3}
            >
              <ChevronLeft size={24} />
            </button>

            <div className={styles.carousel}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  className={styles.slide}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.5 }}
                >
                  {visibleTestimonials.map((item, i) => (
                    <div key={i} className={styles.card}>
                      <h3 className={styles.quote}>"{item.title}"</h3>
                      <p className={styles.message}>{item.content}</p>
                      <p className={styles.author}>{item.name}</p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              className={`${styles.navButton} ${styles.right}`}
              onClick={nextSlide}
              disabled={testimonials.length <= 3}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        ) : (
          <p className={styles.empty}>No feedback yet. Be the first to share!</p>
        )}
      </div>
    </section>
  );
};

export default TestimonialSection;
