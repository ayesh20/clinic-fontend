import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={styles.navbar}>
      {/* Left: Logo */}
      <div className={styles.logoSection}>
        <img src="/images/logo.png" alt="Healthcare Logo" className={styles.logo} />
        <h2 className={styles.logoText}>Healthcare</h2>
      </div>

      {/* Center: Nav Links */}
      <ul className={styles.navLinks}>
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/doctors" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Doctors
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/contactus" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            ContactUs
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/appointments" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Appointments
          </NavLink>
        </li>
      </ul>

      {/* Right: Auth Buttons */}
      <div className={styles.authSection}>
        <NavLink to="/register" className={styles.signUp}>Sign Up</NavLink>
        <button className={styles.loginBtn}>Log In</button>
      </div>
    </nav>
  );
};

export default Navbar;