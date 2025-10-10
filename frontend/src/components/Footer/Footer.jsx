import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerMain}>
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Healthcare</h3>
            <p className={styles.copyright}>
              Copyright © 2022 BBK Templates<br />
              All Rights Reserved
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.columnTitle}>Product</h4>
            <ul className={styles.linkList}>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Case studies</a></li>
              <li><a href="#">Reviews</a></li>
              <li><a href="#">Updates</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.columnTitle}>Company</h4>
            <ul className={styles.linkList}>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Culture</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.columnTitle}>Support</h4>
            <ul className={styles.linkList}>
              <li><a href="#">Getting started</a></li>
              <li><a href="#">Help center</a></li>
              <li><a href="#">Server status</a></li>
              <li><a href="#">Report a bug</a></li>
              <li><a href="#">Chat support</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.columnTitle}>Follow us</h4>
            <ul className={styles.linkList}>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">YouTube</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;