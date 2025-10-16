import React, { useState } from 'react';
import styles from './AddDoctor.module.css';
import { doctorAPI } from "../../services/api.js";
import toast from 'react-hot-toast';

const DEFAULT_IMAGE = 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Doctor';

export default function AddDoctor() {
    const [previewImage, setPreviewImage] = useState(DEFAULT_IMAGE);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        bio: '',
        fullName: '',
        gender: '',
        dateOfBirth: '',
        specialization: 'Cardiologist',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        phone: ''
    });

    const specializations = [
        'Cardiologist',
        'Dermatologist',
        'Orthopedist',
        'Pediatrician',
        'Neurologist',
        'Psychiatrist',
        'Urologist',
        'General Physician',
        'Gynecologist',
        'Ophthalmologist'
    ];

    const genders = ['Male', 'Female', 'Other'];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPEG, JPG, PNG, GIF, or WebP)');
                setError('Please select a valid image file (JPEG, JPG, PNG, GIF, or WebP)');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                setError('Image size should be less than 5MB');
                return;
            }

            // Set preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            setSelectedFile(file);
            setError('');
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(DEFAULT_IMAGE);
        setSelectedFile(null);
        const fileInput = document.getElementById('profilePictureInput');
        if (fileInput) fileInput.value = '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (error) setError('');
        if (success) setSuccess('');
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            const msg = 'Full name is required';
            setError(msg);
            toast.error(msg);
            return false;
        }
        if (!formData.email.trim()) {
            const msg = 'Email is required';
            setError(msg);
            toast.error(msg);
            return false;
        }
        if (!formData.password) {
            const msg = 'Password is required';
            setError(msg);
            toast.error(msg);
            return false;
        }
        if (formData.password.length < 6) {
            const msg = 'Password must be at least 6 characters';
            setError(msg);
            toast.error(msg);
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            const msg = 'Passwords do not match';
            setError(msg);
            toast.error(msg);
            return false;
        }
        if (!formData.bio.trim()) {
            const msg = 'Bio is required';
            setError(msg);
            toast.error(msg);
            return false;
        }
        if (!formData.gender) {
            const msg = 'Gender is required';
            setError(msg);
            toast.error(msg);
            return false;
        }
        if (!formData.specialization) {
            const msg = 'Specialization is required';
            setError(msg);
            toast.error(msg);
            return false;
        }
        
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(formData.email)) {
            const msg = 'Please provide a valid email address';
            setError(msg);
            toast.error(msg);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Registering doctor...');

        try {
            // Create FormData object for multipart/form-data
            const formDataToSend = new FormData();
            
            // Append all form fields
            formDataToSend.append('bio', formData.bio);
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('specialization', formData.specialization);
            formDataToSend.append('gender', formData.gender);
            
            if (formData.phone) formDataToSend.append('phone', formData.phone);
            if (formData.address) formDataToSend.append('address', formData.address);

            // Add birthday if dateOfBirth is provided
            if (formData.dateOfBirth) {
                const date = new Date(formData.dateOfBirth);
                formDataToSend.append('birthday[year]', date.getFullYear());
                formDataToSend.append('birthday[month]', date.toLocaleString('default', { month: 'long' }));
                formDataToSend.append('birthday[day]', date.getDate());
            }

            // Append profile picture if selected
            if (selectedFile) {
                formDataToSend.append('profilePicture', selectedFile);
            }

            // Make API call - FIXED: Pass formDataToSend correctly
            const response = await doctorAPI.register(formDataToSend);

            toast.success("Doctor registered successfully!", { id: loadingToast });
            console.log('Doctor registered successfully:', response);
            setSuccess('Doctor registered successfully!');

            // Reset form
            setFormData({
                bio: '',
                fullName: '',
                gender: '',
                dateOfBirth: '',
                specialization: 'Cardiologist',
                email: '',
                password: '',
                confirmPassword: '',
                address: '',
                phone: ''
            });
            setPreviewImage(DEFAULT_IMAGE);
            setSelectedFile(null);

            // Reset file input
            const fileInput = document.getElementById('profilePictureInput');
            if (fileInput) fileInput.value = '';

            // Optional: Redirect after success
            setTimeout(() => {
                setSuccess('');
            }, 3000);

        } catch (err) {
            console.error('Error registering doctor:', err);
            const errorMessage = err.message || 'Failed to register doctor. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage, { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.addDoctorWrapper}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Add Doctor</h1>

                {/* Error Message */}
                {error && (
                    <div style={{ 
                        backgroundColor: '#fee', 
                        color: '#c33', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        marginBottom: '20px',
                        border: '1px solid #fcc'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div style={{ 
                        backgroundColor: '#efe', 
                        color: '#3c3', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        marginBottom: '20px',
                        border: '1px solid #cfc'
                    }}>
                        ✅ {success}
                    </div>
                )}

                <div className={styles.personalInfo}>
                    <h3 className={styles.sectionTitle}>Personal Information</h3>

                    <form className={styles.addDoctorForm} onSubmit={handleSubmit}>
                        
                        {/* Profile Picture Section */}
                        <div className={styles.profileSection}>
                            <div className={styles.profileImageContainer}>
                                <img 
                                    src={previewImage} 
                                    alt="Doctor Profile" 
                                    className={styles.profileImage}
                                    style={{ 
                                        width: '150px', 
                                        height: '150px', 
                                        objectFit: 'cover', 
                                        borderRadius: '50%' 
                                    }}
                                />
                            </div>
                            <div className={styles.nameAndEdit}>
                                <p className={styles.doctorName}>{formData.fullName || 'New Doctor'}</p>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <label 
                                        htmlFor="profilePictureInput"
                                        className={styles.editButton}
                                        style={{ cursor: 'pointer',
                                            backgroundColor:'green',
                                            color:'white',
                                            width: '180px',
                                            height:'30px',
                                            borderRadius:'10px',
                                            justifyContent:'center',
                                            alignItems:'center',
                                            display:'flex',
                                            fontSize:'16px'
                                         }}
                                    >
                                        📷 Upload Photo
                                    </label>
                                    <input
                                        type="file"
                                        id="profilePictureInput"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                    {selectedFile && (
                                        <button 
                                            type="button"
                                            className={styles.editButton}
                                            onClick={handleRemoveImage}
                                            style={{ 
                                                backgroundColor: '#f44336',
                                                color: 'white'
                                            }}
                                        >
                                            🗑️ Remove
                                        </button>
                                    )}
                                </div>
                                {selectedFile && (
                                    <small style={{ color: '#666', marginTop: '5px' }}>
                                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                                    </small>
                                )}
                            </div>
                        </div>
<div>
    <br></br>
</div>
                        {/* Bio Field */}
                        <div className={styles.formGroupFull}>
                            <label className={styles.labelWithIcon}>
                                <span className={styles.labelIcon}>📝</span>
                                <span className={styles.labelText}>Bio *</span>
                            </label>
                            <textarea
                                name="bio"
                                className={styles.textArea}
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Enter doctor's bio..."
                                required
                                rows="4"
                            />
                        </div>

                        {/* Full Name Field */}
                        <div className={styles.formGroupFull}>
                            <label className={styles.labelWithIcon}>
                                <span className={styles.labelIcon}>👤</span>
                                <span className={styles.labelText}>Full Name *</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                className={styles.input}
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Dr. John Doe"
                                required
                            />
                        </div>

                        {/* Gender and Date of Birth Row */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.labelWithIcon}>
                                    <span className={styles.labelIcon}>⚧</span>
                                    <span className={styles.labelText}>Gender *</span>
                                </label>
                                <select
                                    name="gender"
                                    className={styles.select}
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    {genders.map((gender) => (
                                        <option key={gender} value={gender}>
                                            {gender}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.labelWithIcon}>
                                    <span className={styles.labelIcon}>📅</span>
                                    <span className={styles.labelText}>Date of Birth</span>
                                </label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    className={styles.input}
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Specialization Field */}
                        <div className={styles.formGroupFull}>
                            <label className={styles.labelWithIcon}>
                                <span className={styles.labelIcon}>⚕️</span>
                                <span className={styles.labelText}>Specialization *</span>
                            </label>
                            <select
                                name="specialization"
                                className={styles.select}
                                value={formData.specialization}
                                onChange={handleInputChange}
                                required
                            >
                                {specializations.map((spec) => (
                                    <option key={spec} value={spec}>
                                        {spec}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Email Field */}
                        <div className={styles.formGroupFull}>
                            <label className={styles.labelWithIcon}>
                                <span className={styles.labelIcon}>✉️</span>
                                <span className={styles.labelText}>Email *</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                className={styles.input}
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="doctor@example.com"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className={styles.formGroupFull}>
                            <label className={styles.labelWithIcon}>
                                <span className={styles.labelIcon}>🔒</span>
                                <span className={styles.labelText}>Password *</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                className={styles.input}
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Minimum 6 characters"
                                required
                                minLength="6"
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div className={styles.formGroupFull}>
                            <label className={styles.labelWithIcon}>
                                <span className={styles.labelIcon}>🔑</span>
                                <span className={styles.labelText}>Confirm Password *</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className={styles.input}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Re-enter password"
                                required
                            />
                        </div>

                        {/* Address Field */}
                        <div className={styles.formGroupFull}>
                            <label className={styles.labelWithIcon}>
                                <span className={styles.labelIcon}>📍</span>
                                <span className={styles.labelText}>Address</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                className={styles.input}
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="123 Main St, City, Country"
                            />
                        </div>

                        {/* Contact Number Field */}
                        <div className={styles.formGroupFull}>
                            <label className={styles.labelWithIcon}>
                                <span className={styles.labelIcon}>📞</span>
                                <span className={styles.labelText}>Contact Number</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                className={styles.input}
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+1 234 567 8900"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles.addBtn}
                            disabled={loading}
                            style={{
                                opacity: loading ? 0.6 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? '⏳ Registering...' : '✅ Add Doctor'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}