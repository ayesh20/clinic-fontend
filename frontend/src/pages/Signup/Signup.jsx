import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentAPI, instructorAPI } from "../../services/api"; 
import styles from './Signup.module.css';

export default function Register() {
    const { role } = useParams(); // Get role from URL parameter
    const [selectedRole, setSelectedRole] = useState(role || '');
    const [email, setEmail] = useState('');
    const [About, setAbout] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneno, setPhoneno] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Role selection handler
    const handleRoleSelect = (roleType) => {
        setSelectedRole(roleType);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validation
        if (!selectedRole) {
            setError('Please select a role');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        // Split full name into first and last name if not provided separately
        const names = fullName.trim().split(' ');
        const fName = firstName || names[0] || '';
        const lName = lastName || names.slice(1).join(' ') || '';

        if (!fName || !lName) {
            setError('Please provide both first and last name');
            return;
        }

        setLoading(true);

        try {
            const userData = {
                firstName: fName,
                lastName: lName,
                email: email,
                password: password,
                phone: phoneno || ''
            };

            let response;
            if (selectedRole === 'student') {
                response = await studentAPI.createStudent(userData);
            } else if (selectedRole === 'instructor') {
                response = await instructorAPI.createInstructor(userData);
            }

            console.log('Registration successful:', response);
            
            // Navigate to login page with success message
            navigate('/', { 
                state: { 
                    message: 'Registration successful! Please login with your credentials.',
                    email: email
                }
            });
        } catch (error) {
            console.error('Registration failed:', error);
            setError(error.message || 'Registration failed. Please try again.');
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
                                    onClick={() => navigate('/')}
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

                        {/* Role Selection Section - Similar to your image */}
                        {!selectedRole && (
                            <div className={styles.roleSelection}>
                                <div className={styles.roleCards}>
                                    <div 
                                        className={`${styles.roleCard} ${styles.studentCard}`}
                                        onClick={() => handleRoleSelect('student')}
                                    >
                                        <div className={styles.roleIcon}>
                                            <i className="fas fa-user"></i>
                                        </div>
                                        <h3 className={styles.roleTitle}>Patient</h3>
                                        
                                    </div>
                                    
                                    <div 
                                        className={`${styles.roleCard} ${styles.instructorCard}`}
                                        onClick={() => handleRoleSelect('instructor')}
                                    >
                                        <div className={styles.roleIcon}>
                                            <i className="fas fa-chalkboard-teacher"></i>
                                        </div>
                                        <h3 className={styles.roleTitle}>Doctor</h3>
                                        
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Registration Form - Show only after role selection */}
                        {selectedRole && (
                            <>
                                <div className={styles.selectedRole}>
                                    <p className={styles.roleIndicator}>
                                        Registering as: <span className={styles.roleBadge}>{selectedRole}</span>
                                        <button 
                                            type="button"
                                            className={styles.changeRole}
                                            onClick={() => setSelectedRole('')}
                                        >
                                            Change
                                        </button>
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className={styles.form}>
                                    {error && <div className={styles.error}>{error}</div>}
                                    
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

                                    <div className={styles.formRow}>
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
                                        <label htmlFor="about" className={styles.label}>About you </label>
                                        <input
                                            type="about"
                                            id="about"
                                            className={styles.input}
                                            placeholder="Enter your disease"
                                            value={About}
                                            onChange={(e) => setAbout(e.target.value)}
                                        />
                                    </div>


                                    <div className={styles.formGroup}>
                                        <label htmlFor="addressneno" className={styles.label}>Address </label>
                                        <input
                                            type="address"
                                            id="address"
                                            className={styles.input}
                                            placeholder="Enter your address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="phoneno" className={styles.label}>Phone Number (Optional)</label>
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}