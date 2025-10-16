import React from 'react';
import styles from './AppointmentDetails.module.css';

// import Navbar & Footer
import Navbar from '../../components/Navbar/Navbar'; 
import Footer from '../../components/Footer/Footer'; 

const AppointmentDetails = () => {
    // Dummy Data
    const appointmentData = {
        doctor: 'Dr. Andy Smith',
        date: 'DD/MM/YYYY',
        time: '10.30 am',
        // Note: I'm using 'Comfirmed' as provided in your data. The correct spelling is 'Confirmed'.
        status: 'Comfirmed', 
        note: 'Note',
    };

    const previousAppointments = [
        
        { id: 1, date: '2025.08.12', doctor: 'Dr. Perera', status: 'Completed', notes: 'Heart Checkup' },
        { id: 2, date: '2025.08.12', doctor: 'Dr. Perera', status: 'Completed', notes: 'Heart Checkup' },
    ];

    const profile = {
        name: 'Jhone Doe',
        gender: 'Male',
        age: 30,
        email: 'jhone@gmail.com',
        phone: '+94 77 256 7089'
    };

    // status 
    const getStatusClassName = (status) => {
       
        if (status && status.toLowerCase() === 'comfirmed') {
            return styles.statusConfirmed;
        }
        return ''; 
    };

    return (
        <div className={styles.pageWrapper}> 
            
            <Navbar />

            {/* The Main Light-Grey Frame */}
            <div className={styles.mainContentWrapper}>
                <div className={styles.container}> 
                    
                    <div className={styles.whiteFrame}> 
                        
                        {/* Profile Section (Inside White Frame) */}
                        <div className={styles.profileSection}>
                            <div className={styles.profileIcon}>
                                <i className="fas fa-user-circle"></i> 
                            </div>
                            <div className={styles.profileDetails}>
                                <h1>{profile.name}</h1>
                                <p>
                                    {profile.gender}
                                    <span className={styles.dot}></span>
                                    {profile.age} years
                                </p>
                                <p>
                                    📧 {profile.email}
                                </p>
                                <p>
                                    📞 {profile.phone}
                                </p>
                            </div>
                        </div>

                        {/* Main Appointment Info Box (Grey Color Card) */}
                        <div className={styles.appointmentBox}>
                            <div className={styles.appointmentGrid}>
                                
                                {/* Detail Cards  */}
                                <div className={styles.infoCard}>
                                    <div className={styles.infoLabel}>Doctor</div>
                                    <div className={styles.infoValue}>{appointmentData.doctor}</div>
                                </div>
                                <div className={styles.infoCard}>
                                    <div className={styles.infoLabel}>Date</div>
                                    <div className={styles.infoValue}>{appointmentData.date}</div>
                                </div>
                                <div className={styles.infoCard}>
                                    <div className={styles.infoLabel}>Time</div>
                                    <div className={styles.infoValue}>{appointmentData.time}</div>
                                </div>
                                
                                {/* Status Card  */}
                                <div className={styles.infoCard}>
                                    <div className={styles.infoLabel}>Status</div>
                                    
                                    <div className={`${styles.infoValue} ${getStatusClassName(appointmentData.status)}`}>
                                        {appointmentData.status}
                                    </div>
                                </div>

                                {/* Note Area */}
                                <div className={styles.noteBox}>
                                    <div className={styles.noteBoxLabel}>Note</div>
                                </div>
                            </div>
                        </div>

                        {/* Previous Appointments Section (Inside White Frame) */}
                        <div className={styles.previousAppointments}>
                            <h2>Previous Appointment</h2>
                            <table className={styles.previousTable}>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Doctor</th>
                                        <th>Status</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Table data  */}
                                    {previousAppointments.map((app) => (
                                        <tr key={app.id} className={styles.previousRow}>
                                            <td>{app.date}</td>
                                            <td>{app.doctor}</td>
                                            <td>{app.status}</td>
                                            <td>{app.notes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                    {/* End of White Frame */}

                    {/* Action Buttons */}
                    <div className={styles.buttonSection}>
                        <button className={`${styles.button} ${styles.cancelButton}`}>
                            Cancel Appointment
                        </button>
                        <button className={`${styles.button} ${styles.backButton}`}>
                            Back to profile
                        </button>
                    </div>

                </div>
            </div>

            <Footer />

            
        </div>
    );
};

export default AppointmentDetails;