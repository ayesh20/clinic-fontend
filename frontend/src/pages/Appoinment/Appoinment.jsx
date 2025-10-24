import React, { useEffect, useState } from 'react';
import styles from './Appointment.module.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { patientAPI, doctorAPI, availabilityAPI, appointmentAPI } from '../../services/api';

const API_ORIGIN = 'http://localhost:5000';

export default function Appointment() {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [loadingDoctor, setLoadingDoctor] = useState(!location.state?.doctor);
  const [err, setErr] = useState('');

  useEffect(() => {
    async function loadDoctor() {
      try {
        setErr('');
        setLoadingDoctor(true);
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

  // Availability state
  const [availabilities, setAvailabilities] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityErr, setAvailabilityErr] = useState('');
  
  // Appointment form state
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    symptoms: '',
    phoneNo: ''
  });

  // Booking state
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Auto-fill from logged-in patient profile
  const [loadingUser, setLoadingUser] = useState(true);
  const [userErr, setUserErr] = useState('');

  useEffect(() => {
    async function loadUser() {
      try {
        setLoadingUser(true);
        setUserErr('');
        const me = await patientAPI.getProfile();

        setFormData(prev => ({
          ...prev,
          name: me.firstName + ' ' + me.lastName,
          email: me.email,
          phoneNo: me.phone
        }));
      } catch (e) {
        console.error('Failed to load user profile', e);
        setUserErr(e.message || 'Could not load your profile. You can fill the fields manually.');
      } finally {
        setLoadingUser(false);
      }
    }
    loadUser();
  }, []);

  // Load doctor availability
  useEffect(() => {
    async function loadAvailability() {
      if (!doctorId) return;
      
      try {
        setLoadingAvailability(true);
        setAvailabilityErr('');
        
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        
        const startDateStr = today.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        const response = await availabilityAPI.getDoctorAvailability(
          doctorId,
          startDateStr,
          endDateStr
        );
        
        const availableData = response.data.filter(avail => 
          avail.timeSlots && avail.timeSlots.length > 0
        );
        
        setAvailabilities(availableData);
        
        if (availableData.length > 0) {
          setSelectedAvailability(availableData[0]);
          setSelectedDate(availableData[0].date);
        }
      } catch (e) {
        console.error('Failed to load availability', e);
        setAvailabilityErr(e.message || 'Could not load available slots');
      } finally {
        setLoadingAvailability(false);
      }
    }
    
    loadAvailability();
  }, [doctorId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  const getDayDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate().toString()
    };
  };

  const handleDateSelect = (availability) => {
    setSelectedAvailability(availability);
    setSelectedDate(availability.date);
    setSelectedTime(null);
  };

  const handleInputChange = (e) => {
    setFormData(s => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time for the appointment');
      return;
    }

    setIsBooking(true);
    setBookingError('');

    try {
      const appointmentId = 'APT-' + Math.random().toString(36).slice(2, 9).toUpperCase();

      const appointmentData = {
        appointmentId,
        doctorId,
        doctorName: doctor?.fullName || 'Doctor',
        specialization: doctor?.specialization || '',
        availabilityId: selectedAvailability._id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        symptoms: formData.symptoms,
        patientName: formData.name,
        patientEmail: formData.email,
        patientPhone: formData.phoneNo
      };

      // Save appointment to database
      const response = await appointmentAPI.createAppointment(appointmentData);

      console.log('Appointment created:', response);

      // Navigate to confirmation page with appointment details
      const appointmentDetails = {
        ...response.appointment,
        doctorName: doctor?.fullName || 'Doctor',
        department: doctor?.specialization || '',
        date: formatDate(selectedDate),
        time: selectedTime,
        appointmentId,
        patientName: formData.name,
        contactNo: formData.phoneNo,
        email: formData.email,
        symptoms: formData.symptoms,
      };

      navigate('/appointment-confirmation', { state: appointmentDetails });

    } catch (error) {
      console.error('Error booking appointment:', error);
      setBookingError(error.message || 'Failed to book appointment. Please try again.');
      alert('Failed to book appointment: ' + (error.message || 'Unknown error'));
    } finally {
      setIsBooking(false);
    }
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
          
          {loadingAvailability ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              Loading available dates...
            </div>
          ) : availabilityErr ? (
            <div style={{ color: '#dc2626', padding: '12px', background: '#fee', borderRadius: '6px' }}>
              {availabilityErr}
            </div>
          ) : availabilities.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No available dates found. Please check back later.
            </div>
          ) : (
            <div className={styles.dateSelector}>
              {availabilities.map((availability, index) => {
                const { day, date } = getDayDate(availability.date);
                const isSelected = selectedDate === availability.date;
                
                return (
                  <button
                    key={availability._id || index}
                    className={`${styles.dateBtn} ${isSelected ? styles.dateActive : ''}`}
                    onClick={() => handleDateSelect(availability)}
                  >
                    <span className={styles.dayLabel}>{day}</span>
                    <span className={styles.dateLabel}>{date}</span>
                  </button>
                );
              })}
            </div>
          )}

          <h3 className={styles.sectionTitle}>Available Time</h3>
          
          {!selectedAvailability ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              Please select a date first
            </div>
          ) : selectedAvailability.timeSlots.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No available time slots for this date
            </div>
          ) : (
            <div className={styles.timeSelector}>
              {selectedAvailability.timeSlots.map((timeSlot, index) => {
                const isSelected = selectedTime === timeSlot.slot;
                
                return (
                  <button
                    key={index}
                    className={`${styles.timeBtn} ${isSelected ? styles.timeActive : ''}`}
                    onClick={() => setSelectedTime(timeSlot.slot)}
                  >
                    {timeSlot.slot}
                  </button>
                );
              })}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.appointmentForm}>
            {userErr && (
              <div style={{ color: '#b45309', background: '#fff7ed', padding: '8px 12px', borderRadius: 6, marginBottom: 8 }}>
                Please login to continue
              </div>
            )}

            {bookingError && (
              <div style={{ color: '#dc2626', background: '#fee2e2', padding: '8px 12px', borderRadius: 6, marginBottom: 8 }}>
                {bookingError}
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
                disabled={isBooking}
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
                disabled={isBooking}
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
                disabled={isBooking}
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
                disabled={isBooking}
              />
            </div>

            <button 
              type="submit" 
              className={styles.bookBtn}
              disabled={!selectedDate || !selectedTime || isBooking}
            >
              {isBooking ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}