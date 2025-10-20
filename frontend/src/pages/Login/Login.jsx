import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { patientAPI, doctorAPI, adminAPI } from '../../services/api';
import { useAuth } from "../../context/AuthContext.jsx"; 
import styles from './Login.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            if (location.state?.email) setEmail(location.state.email);
            window.history.replaceState(null, '');
        }
    }, [location]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const credentials = { email, password };
            let response = null;
            let userType = null;
            let userData = null;

            // Check if admin login
            if (email === 'admin@clinic.com') {
                try {
                    response = await adminAPI.login(credentials);
                    userType = 'admin';
                    userData = response.admin;
                } catch (adminError) {
                    console.error('Admin login failed:', adminError);
                    throw adminError;
                }
            } else {
                // Try patient login first
                try {
                    response = await patientAPI.login(credentials);
                    userType = 'patient';
                    userData = response.patient;
                } catch (patientError) {
                    // If patient login fails, try doctor login
                    try {
                        response = await doctorAPI.login(credentials);
                        userType = 'doctor';
                        userData = response.doctor;
                    } catch (doctorError) {
                        throw new Error('Invalid email or password');
                    }
                }
            }

            if (!response || !response.token) {
                throw new Error('Login failed - no token received');
            }

            // Save auth data to localStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userType', userType);
            localStorage.setItem('userData', JSON.stringify(userData));

            // Update AuthContext
            login(userData, userType);

            // Handle remember me
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('lastEmail', email);
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('lastEmail');
            }

            // Show success message
            toast.success(`Welcome! Logged in as ${userType}`);

            // Navigate based on user type
            if (userType === 'patient') {
                navigate('/');
            } else if (userType === 'doctor') {
                navigate('/doctorProfile');
            } else if (userType === 'admin') {
                navigate('/admin');
            }

        } catch (err) {
            console.error('Login error:', err);
            toast.error(err.message || 'Login failed');
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const rememberedEmail = localStorage.getItem('lastEmail');
        if (rememberedEmail && localStorage.getItem('rememberMe')) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div className={styles.imageSection}>
                    <img src="/login1.png" alt="Login" className={styles.loginImage}/>
                </div>
                <div className={styles.formSection}>
                    <div className={styles.formContainer}>
                        <h1 className={styles.welcomeTitle}>Welcome to Health Care</h1>
                        <p className={styles.subtitle}>Log in to continue care your life</p>

                        <div className={styles.tabButtons}>
                            <button 
                                className={`${styles.tabBtn} ${activeTab === 'login' ? styles.active : styles.inactive}`}
                                onClick={() => setActiveTab('login')} 
                                type="button"
                            >
                                Login
                            </button>
                            <button 
                                className={`${styles.tabBtn} ${activeTab === 'register' ? styles.active : styles.inactive}`}
                                onClick={() => navigate('/register')} 
                                type="button"
                            >
                                Register
                            </button>
                        </div>


                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>Email Address</label>
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

                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.label}>Password</label>
                                <div className={styles.inputContainer}>
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        id="password" 
                                        className={styles.input}
                                        placeholder="Enter password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required
                                    />
                                    <i 
                                        className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} ${styles.passwordToggle}`}
                                        onClick={() => setShowPassword(!showPassword)}
                                    ></i>
                                </div>
                            </div>

                            <div className={styles.formOptions}>
                                <label className={styles.rememberMe}>
                                    <input 
                                        type="checkbox" 
                                        checked={rememberMe} 
                                        onChange={(e) => setRememberMe(e.target.checked)} 
                                    /> 
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className={styles.forgotPassword}>
                                    Forgot Password?
                                </Link>
                            </div>

                            <button type="submit" className={styles.loginBtn} disabled={loading}>
                                {loading ? 'Signing In...' : 'Login'}
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