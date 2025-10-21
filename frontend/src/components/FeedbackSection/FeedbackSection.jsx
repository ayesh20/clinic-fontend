import React, { useState } from "react";
import axios from "axios";
import styles from "./FeedbackSection.module.css";
import toast from "react-hot-toast";

const FeedbackSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.title || !formData.content) {
      toast.error("Please fill out all fields!");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/feedback", formData);
      toast.success("Feedback submitted successfully!");
      setFormData({ name: "", title: "", content: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.feedback}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Add Your Feedback</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="title"
            placeholder="Your Title (e.g., Patient, Engineer)"
            value={formData.title}
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="Your Message"
            value={formData.content}
            onChange={handleChange}
          ></textarea>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default FeedbackSection;
