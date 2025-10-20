import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { patientAPI } from "../../services/api"; 
import styles from './Signup.module.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [about, setAbout] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneno, setPhoneno] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        if (!firstName || !lastName) {
            toast.error('Please provide both first and last name');
            return;
        }

        setLoading(true);

        try {
            const userData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                phone: phoneno || '',
                about: about || '',
                address: address || ''
            };

            const response = await patientAPI.register(userData);
            toast.success("Registration successful! Redirecting to login...");
            console.log('Registration successful:', response);
            
            // Navigate to login page after a short delay
            setTimeout(() => {
                navigate('/', { 
                    state: { 
                        message: 'Registration successful! Please login with your credentials.',
                        email: email
                    }
                });
            }, 1500);
        } catch (error) {
            console.error('Registration failed:', error);
            toast.error(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                {/* Left Image */}
                <div className={styles.imageSection}>
                    <img src="/signup1.png" alt="Register" className={styles.loginImage}/>
                </div>

                {/* Right Form */}
                <div className={styles.formSection}>
                    <div className={styles.formContainer}>
                        
                        {/* Header Section */}
                        <div className={styles.headerSection}>
                            <h1 className={styles.welcomeTitle}>Welcome to Health Care</h1>
                            <p className={styles.subtitle}>Register to start your life protection</p>

                            {/* Tabs */}
                            <div className={styles.tabButtons}>
                                <button 
                                    className={`${styles.tabBtn} ${styles.inactive}`}
                                    type="button"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </button>
                                <button 
                                    className={`${styles.tabBtn} ${styles.active}`}
                                    type="button"
                                >
                                    Register
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className={styles.input}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.formRow1}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="firstName" className={styles.label}>First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        className={styles.input}
                                        placeholder="First name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                               
                                <div className={styles.formGroup}>
                                    <label htmlFor="lastName" className={styles.label}>Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        className={styles.input}
                                        placeholder="Last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="phoneno" className={styles.label}>Phone Number </label>
                                <input
                                    type="tel"
                                    id="phoneno"
                                    className={styles.input}
                                    placeholder="Enter your phone number"
                                    value={phoneno}
                                    onChange={(e) => setPhoneno(e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="about" className={styles.label}>About you</label>
                                <input
                                    type="text"
                                    id="about"
                                    className={styles.input}
                                    placeholder="Tell us about your health concerns"
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="address" className={styles.label}>Address (Optional)</label>
                                <input
                                    type="text"
                                    id="address"
                                    className={styles.input}
                                    placeholder="Enter your address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.label}>Password</label>
                                <div className={styles.inputContainer}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className={styles.input}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <i
                                        className={`${styles.passwordToggle} fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                        onClick={() => setShowPassword(!showPassword)}
                                    ></i>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                                <div className={styles.inputContainer}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        className={styles.input}
                                        placeholder="Re-enter your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <i
                                        className={`${styles.passwordToggle} fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    ></i>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className={styles.loginBtn}
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Register'}
                            </button>

                            <div className={styles.divider}>OR</div>

                            <button type="button" className={styles.googleBtn}>
                                <div className={styles.googleIcon}></div>
                                Continue with Google
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}