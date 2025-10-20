import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { patientAPI, doctorAPI } from "../../services/api";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    profileImage: null,
    imageUrl: null,
    hasImage: false,
    userType: null
  });
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const userType = localStorage.getItem('userType');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');

        if (!token || !userType) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);

        let profileData = {};

        if (userType === 'patient') {
          try {
            const response = await patientAPI.getProfile();
            profileData = {
              firstName: response.patient?.firstName || userData.firstName || 'Patient',
              profileImage: response.patient?.profileImage,
              imageUrl: response.patient?.profileImage 
                ? `http://localhost:5000/uploads/profiles/${response.patient.profileImage}` 
                : null,
              hasImage: !!response.patient?.profileImage,
              userType: 'patient'
            };
          } catch (error) {
            console.error('Error fetching patient profile:', error);
            profileData = {
              firstName: userData.firstName || 'Patient',
              profileImage: null,
              imageUrl: null,
              hasImage: false,
              userType: 'patient'
            };
          }
        } else if (userType === 'doctor') {
          try {
            const response = await doctorAPI.getProfile();
            profileData = {
              firstName: response.doctor?.firstName || userData.firstName || 'Doctor',
              profileImage: response.doctor?.profileImage,
              imageUrl: response.doctor?.profileImage 
                ? `http://localhost:5000/uploads/profiles/${response.doctor.profileImage}` 
                : null,
              hasImage: !!response.doctor?.profileImage,
              userType: 'doctor'
            };
          } catch (error) {
            console.error('Error fetching doctor profile:', error);
            profileData = {
              firstName: userData.firstName || 'Doctor',
              profileImage: null,
              imageUrl: null,
              hasImage: false,
              userType: 'doctor'
            };
          }
        } else if (userType === 'admin') {
          profileData = {
            firstName: userData.firstName || userData.name || 'Admin',
            profileImage: null,
            imageUrl: null,
            hasImage: false,
            userType: 'admin'
          };
        }

        setUserProfile(profileData);
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    
    setUserProfile({
      firstName: '',
      profileImage: null,
      imageUrl: null,
      hasImage: false,
      userType: null
    });
    
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderProfileImage = () => {
    if (loading) {
      return (
        <div className={styles.avatarPlaceholder}>
          <FaUser />
        </div>
      );
    }

    if (userProfile.hasImage && userProfile.imageUrl) {
      return (
        <img
          src={userProfile.imageUrl}
          alt="Profile"
          className={styles.avatar}
          onError={(e) => {
            e.target.src = "/images/user.jpg";
            e.target.onerror = null;
          }}
        />
      );
    }

    return (
      <img
        src="/images/user.jpg"
        alt="User"
        className={styles.avatar}
      />
    );
  };

  const getProfileLink = () => {
    if (userProfile.userType === 'patient') {
      return '/PatientManagement';
    } else if (userProfile.userType === 'doctor') {
      return '/doctorProfile';
    } else if (userProfile.userType === 'admin') {
      return '/admin';
    }
    return '/';
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
        {isLoggedIn && userProfile.userType === 'patient' && (
          <li>
            <NavLink 
              to="/appointment" 
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Appointments
            </NavLink>
          </li>
        )}
      </ul>

      {/* Right: Auth Section */}
      <div className={styles.authSection}>
        {!isLoggedIn ? (
          <>
            <NavLink to="/register" className={styles.signUp}>Sign Up</NavLink>
            <NavLink to="/login" className={styles.loginBtn}>Log In</NavLink>
          </>
        ) : (
          <div className={styles.userSection} ref={dropdownRef}>
            <div
              className={styles.userBox}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {renderProfileImage()}
              <span className={styles.userName}>
                {loading ? 'Loading...' : userProfile.firstName || 'User'}
              </span>
            </div>

            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link
                  to={getProfileLink()}
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  {userProfile.userType === 'admin' ? 'Dashboard' : 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className={styles.dropdownItem}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;