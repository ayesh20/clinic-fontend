import React from "react";
import styles from "./TeamSection.module.css";

const team = [
  { 
    name: "John Carter", 
    role: "CEO & CO-FOUNDER",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.",
    img: "/images/team1.png"
  },
  { 
    name: "Sophie Moore", 
    role: "DENTAL SPECIALIST",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.",
    img: "/images/team2.png"
  },
  { 
    name: "Matt Cannon", 
    role: "ORTHOPEDIC",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.",
    img: "/images/team3.png"
  },
  { 
    name: "Andy Smith", 
    role: "BRAIN SURGEON",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.",
    img: "/images/team4.png"
  },
  { 
    name: "Lily Woods", 
    role: "HEART SPECIALIST",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.",
    img: "/images/team5.png"
  },
  { 
    name: "Patrick Meyer", 
    role: "EYE SPECIALIST",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.",
    img: "/images/team6.png"
  },
];

const TeamSection = () => {
  return (
    <section className={styles.team}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Meet our team members</h2>
          <p className={styles.subtitle}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat gravida malesuada 
            quam commodo id integer nam.
          </p>
        </div>
        
        <div className={styles.grid}>
          {team.map((member, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.imageContainer}>
                <img src={member.img} alt={member.name} className={styles.memberImage} />
              </div>
              <div className={styles.content}>
                <h3 className={styles.name}>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
                <p className={styles.description}>{member.description}</p>
                <div className={styles.socialIcons}>
                  <span className={`${styles.icon} ${styles.facebook}`}>f</span>
                  <span className={`${styles.icon} ${styles.twitter}`}>▼</span>
                  <span className={`${styles.icon} ${styles.instagram}`}>◎</span>
                  <span className={`${styles.icon} ${styles.linkedin}`}>in</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;