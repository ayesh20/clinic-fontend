import React, { useState } from 'react';
import styles from "./Appoinment.module.css";

export default function Appointment() {
    const [selectedDate, setSelectedDate] = useState('23');
    const [selectedTime, setSelectedTime] = useState('02:00 PM');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        symptoms: '',
        phoneNo: ''
    });

    const dates = [
        { day: 'Mon', date: '21' },
        { day: 'Tue', date: '22' },
        { day: 'Wed', date: '23' },
        { day: 'Thu', date: '24' },
        { day: 'Fri', date: '25' },
        { day: 'Sat', date: '26' },
        { day: 'Sat', date: '26' }
    ];

    const times = [
        { time: '09:00 AM', available: false },
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: false },
        { time: '01:00 PM', available: false },
        { time: '02:00 PM', available: true },
        { time: '03:00 PM', available: true },
        { time: '04:00 PM', available: true },
        { time: '07:00 PM', available: true },
        { time: '08:00 PM', available: false }
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Generate appointment ID
        const appointmentId = 'APT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Prepare appointment data
        const appointmentDetails = {
            doctorName: 'Dr.John Carter',
            department: 'Cardiologist',
            date: `Wed ${selectedDate}`,
            time: selectedTime,
            appointmentId: appointmentId,
            patientName: formData.name,
            contactNo: formData.phoneNo,
            email: formData.email,
            symptoms: formData.symptoms
        };

        // Navigate to confirmation page with data
        navigate('/appointment-confirmation', { 
            state: appointmentDetails 
        });
    };

    return (
        <div className={styles.appointmentWrapper}>
            <div className={styles.container}>
                <div className={styles.doctorSection}>
                    <img 
                        src="/doctor-placeholder.jpg" 
                        alt="Dr.John Carter" 
                        className={styles.doctorImage}
                    />
                    <div className={styles.doctorInfo}>
                        <h2 className={styles.doctorName}>Dr.John Carter</h2>
                        <p className={styles.specialty}>CHARDIOLOGIST</p>
                        <p className={styles.description}>
                            Lorem ipsum dolor sit amet consecte adipiscing elit arnet hendrerit 
                            pretium nulla sed enim iaculis mi.
                        </p>
                    </div>
                </div>

                <div className={styles.bookingSection}>
                    <h3 className={styles.sectionTitle}>Available Dates</h3>
                    <div className={styles.dateSelector}>
                        {dates.map((item, index) => (
                            <button
                                key={index}
                                className={`${styles.dateBtn} ${selectedDate === item.date ? styles.dateActive : ''}`}
                                onClick={() => setSelectedDate(item.date)}
                            >
                                <span className={styles.dayLabel}>{item.day}</span>
                                <span className={styles.dateLabel}>{item.date}</span>
                            </button>
                        ))}
                    </div>

                    <h3 className={styles.sectionTitle}>Available Time</h3>
                    <div className={styles.timeSelector}>
                        {times.map((item, index) => (
                            <button
                                key={index}
                                className={`${styles.timeBtn} ${!item.available ? styles.timeDisabled : ''} ${selectedTime === item.time ? styles.timeActive : ''}`}
                                onClick={() => item.available && setSelectedTime(item.time)}
                                disabled={!item.available}
                            >
                                {item.time}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className={styles.appointmentForm}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Name</label>
                            <input
                                type="text"
                                name="name"
                                className={styles.input}
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email</label>
                            <input
                                type="email"
                                name="email"
                                className={styles.input}
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>symptoms</label>
                            <input
                                type="text"
                                name="symptoms"
                                className={styles.input}
                                value={formData.symptoms}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>phone No</label>
                            <input
                                type="tel"
                                name="phoneNo"
                                className={styles.input}
                                value={formData.phoneNo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <button type="submit" className={styles.bookBtn}>
                            Book Apointment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}