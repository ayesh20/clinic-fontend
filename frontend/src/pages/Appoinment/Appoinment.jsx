import React, { useEffect, useState } from 'react';
import styles from './Appointment.module.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api, { patientAPI, doctorAPI } from '../../services/api';

const API_ORIGIN = 'http://localhost:5000';

export default function Appointment() {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Use Link state for instant UI if provided
  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [loadingDoctor, setLoadingDoctor] = useState(!location.state?.doctor);
  const [err, setErr] = useState('');

  useEffect(() => {
    async function loadDoctor() {
      try {
        setErr('');
        setLoadingDoctor(true);
        // doctorAPI.getDoctorById uses the apiClient with interceptors
        const doc = await doctorAPI.getDoctorById(doctorId);
        setDoctor(doc);
      } catch (e) {
        console.error(e);
        setErr(e.message || 'Failed to load doctor');
      } finally {
        setLoadingDoctor(false);
      }
    }
    if (doctorId) loadDoctor();
  }, [doctorId]);

  const doctorImage =
    doctor?.profilePicture
      ? (doctor.profilePicture.startsWith('http') ? doctor.profilePicture : `${API_ORIGIN}${doctor.profilePicture}`)
      : '/images/doctor1.png';

  // Appointment form state
  const [selectedDate, setSelectedDate] = useState('23');
  const [selectedTime, setSelectedTime] = useState('02:00 PM');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    symptoms: '',
    phoneNo: ''
  });

  // Auto-fill from logged-in patient profile
  const [loadingUser, setLoadingUser] = useState(true);
  const [userErr, setUserErr] = useState('');

  useEffect(() => {
    async function loadUser() {
      try {
        setLoadingUser(true);
        setUserErr('');

        // Ensure you stored the patient token at login: localStorage.setItem('authToken', res.token)
        // Your interceptor will attach Authorization automatically.
        const me = await patientAPI.getProfile(); // calls GET /patients/profile

        setFormData(prev => ({
          ...prev,
          name: me.firstName + ' ' + me.lastName,
          email: me.email,
          phoneNo: me.phone
        }));
      } catch (e) {
        console.error('Failed to load user profile', e);
        // With your apiClient, e is a plain Error with message
        setUserErr(e.message || 'Could not load your profile. You can fill the fields manually.');
      } finally {
        setLoadingUser(false);
      }
    }
    loadUser();
  }, []);

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
    setFormData(s => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const appointmentId = 'APT-' + Math.random().toString(36).slice(2, 9).toUpperCase();

    const appointmentDetails = {
      doctorName: doctor?.fullName || 'Doctor',
      department: doctor?.specialization || '',
      date: `Wed ${selectedDate}`,
      time: selectedTime,
      appointmentId,
      patientName: formData.name,
      contactNo: formData.phoneNo,
      email: formData.email,
      symptoms: formData.symptoms,
      doctorId,
    };

    navigate('/appointment-confirmation', { state: appointmentDetails });
  };

  return (
    <div className={styles.appointmentWrapper}>
      <div className={styles.container}>
        <div className={styles.doctorSection}>
          {loadingDoctor ? (
            <div>Loading doctor...</div>
          ) : err ? (
            <div style={{ color: 'red' }}>{err}</div>
          ) : (
            <>
              <img
                src={doctorImage}
                alt={doctor?.fullName || 'Doctor'}
                className={styles.doctorImage}
              />
              <div className={styles.doctorInfo}>
                <h2 className={styles.doctorName}>{doctor?.fullName}</h2>
                <p className={styles.specialty}>{(doctor?.specialization || '').toUpperCase()}</p>
                <p className={styles.description}>
                  {doctor?.bio || 'Experienced specialist available for consultation.'}
                </p>
              </div>
            </>
          )}
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
            {userErr && (
              <div style={{ color: '#b45309', background: '#fff7ed', padding: '8px 12px', borderRadius: 6, marginBottom: 8 }}>
                {userErr}
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input
                type="text"
                name="name"
                className={styles.input}
                value={formData.name}
                onChange={handleInputChange}
                placeholder={loadingUser ? 'Loading...' : 'Your name'}
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
                placeholder={loadingUser ? 'Loading...' : 'you@example.com'}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Symptoms</label>
              <input
                type="text"
                name="symptoms"
                className={styles.input}
                value={formData.symptoms}
                onChange={handleInputChange}
                placeholder="Briefly describe your symptoms"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone No</label>
              <input
                type="tel"
                name="phoneNo"
                className={styles.input}
                value={formData.phoneNo}
                onChange={handleInputChange}
                placeholder={loadingUser ? 'Loading...' : 'e.g., +1 555 123 4567'}
                required
              />
            </div>

            <button type="submit" className={styles.bookBtn}>
              Book Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}