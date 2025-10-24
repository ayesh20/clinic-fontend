import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './appointmentconform.module.css';

export default function AppointmentConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get appointment data from navigation state
    const appointmentData = location.state || {
        doctorName: 'Dr.John Carter',
        department: 'Dentist',
        date: 'Appointment Date',
        time: 'Appointment time',
        appointmentId: 'Appointment ID',
        patientName: 'riced',
        contactNo: '0543698217',
        email: 'riched@gmail.com'
    };

    const handleDownloadReceipt = () => {
        // Create receipt content
        const receiptContent = `
            ========================================
            APPOINTMENT CONFIRMATION RECEIPT
            ========================================
            
            Appointment Details:
            ------------------------------------
            Doctor Name: ${appointmentData.doctorName}
            Department: ${appointmentData.department}
            Date: ${appointmentData.date}
            Time: ${appointmentData.time}
            Appointment ID: ${appointmentData.appointmentId}
            
            Patient Details:
            ------------------------------------
            Patient Name: ${appointmentData.patientName}
            Contact No: ${appointmentData.contactNo}
            E-mail: ${appointmentData.email}
            
            ========================================
            Thank you for choosing our service!
            ========================================
        `;

        // Create a blob and download
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Appointment_Receipt_${appointmentData.appointmentId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // For actual PDF generation, you would need a library like jsPDF
        // Here's how it would work with jsPDF:
        /*
        import jsPDF from 'jspdf';
        
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Appointment Confirmation', 70, 20);
        doc.setFontSize(12);
        doc.text(`Doctor: ${appointmentData.doctorName}`, 20, 40);
        // ... add more content
        doc.save(`Appointment_${appointmentData.appointmentId}.pdf`);
        */
    };

    return (
        <div className={styles.confirmationWrapper}>
            <div className={styles.container}>
                {/* Success Icon */}
                <div className={styles.successIcon}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="60" fill="#00D97E"/>
                        <path 
                            d="M35 60 L50 75 L85 40" 
                            stroke="white" 
                            strokeWidth="8" 
                            fill="none" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className={styles.title}>"Your Appointment is Confirmed"</h1>

                {/* Appointment Details Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Appointment Details</h2>
                    <div className={styles.detailsCard}>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Dr. Name</span>
                            <span className={styles.value}>{appointmentData.doctorName}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Department</span>
                            <span className={styles.value}>{appointmentData.department}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Date</span>
                            <span className={styles.value}>{appointmentData.date}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <div className={styles.iconLabel}>
                                <i className="far fa-clock"></i>
                                <span className={styles.label}>Time</span>
                            </div>
                            <span className={styles.value}>{appointmentData.time}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <div className={styles.iconLabel}>
                                <span className={styles.dashIcon}>—</span>
                                <span className={styles.label}>Appointment ID</span>
                            </div>
                            <span className={styles.value}>{appointmentData.appointmentId}</span>
                        </div>
                    </div>
                </div>

                {/* Patient Details Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Patient Details</h2>
                    <div className={styles.detailsCard}>
                        <div className={styles.detailRow}>
                            <div className={styles.iconLabel}>
                                <i className="far fa-user"></i>
                                <span className={styles.label}>Patient Name</span>
                            </div>
                            <span className={styles.value}>{appointmentData.patientName}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <div className={styles.iconLabel}>
                                <i className="fas fa-phone-alt"></i>
                                <span className={styles.label}>Contact No:</span>
                            </div>
                            <span className={styles.value}>{appointmentData.contactNo}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <div className={styles.iconLabel}>
                                <i className="far fa-envelope"></i>
                                <span className={styles.label}>E-mail</span>
                            </div>
                            <span className={styles.value}>{appointmentData.email}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.buttonGroup}>
                    <button 
                        className={styles.downloadBtn}
                        onClick={handleDownloadReceipt}
                    >
                        Downlode Recipt
                    </button>
                    <button 
                        className={styles.homeBtn}
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}