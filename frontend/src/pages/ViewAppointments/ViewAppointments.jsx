import React, { useState, useEffect } from "react";
import styles from "./ViewAppoinments.module.css";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../services/api";

const ViewAppointments = () => {
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [doctorInfo, setDoctorInfo] = useState(null);

    const timeSlots = [
        "09.00 AM - 10 AM",
        "10.00 AM - 11 AM",
        "11.00 AM - 12 PM",
        "12.00 PM - 01 PM",
        "01.00 PM - 02 PM",
        "02.00 PM - 03 PM",
        "03.00 PM - 04 PM",
        "04.00 PM - 05 PM",
    ];

    // Fetch doctor profile on component mount
    useEffect(() => {
        const fetchDoctorProfile = async () => {
            try {
                const response = await api.doctor.getProfile();
                setDoctorInfo(response.data || response);
            } catch (err) {
                console.error("Error fetching doctor profile:", err);
                setError("Failed to load doctor profile");
            }
        };

        fetchDoctorProfile();
    }, []);

    // Fetch appointments when date range changes
    useEffect(() => {
        fetchAppointments();
    }, [dateRange]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const startDate = dateRange[0].startDate.toISOString();
            const endDate = dateRange[0].endDate.toISOString();
            
            const response = await api.availability.getMyAvailability(startDate, endDate);
            
            // Transform availability data to appointments format
            const appointmentsData = [];
            if (response.data && Array.isArray(response.data)) {
                response.data.forEach(avail => {
                    avail.timeSlots
                        .filter(slot => slot.isBooked && slot.patientId)
                        .forEach(slot => {
                            appointmentsData.push({
                                name: slot.patientId.name || "N/A",
                                email: slot.patientId.email || "N/A",
                                phone: slot.patientId.phone || "N/A",
                                issue: "Consultation",
                                date: new Date(avail.date).toLocaleDateString(),
                                time: slot.slot,
                            });
                        });
                });
            }
            
            setAppointments(appointmentsData);
            setError(null);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    const toggleTime = (slot) => {
        setSelectedTimes((prev) =>
            prev.includes(slot) ? prev.filter((t) => t !== slot) : [...prev, slot]
        );
    };

    const handleAdd = async () => {
        if (selectedTimes.length === 0) {
            setError("Please select at least one time slot");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccessMessage(null);

            const availabilityData = {
                startDate: dateRange[0].startDate.toISOString(),
                endDate: dateRange[0].endDate.toISOString(),
                timeSlots: selectedTimes,
            };

            const response = await api.availability.createAvailability(availabilityData);

            setSuccessMessage(
                `Successfully saved ${selectedTimes.length} time slot(s) from ${dateRange[0].startDate.toLocaleDateString()} to ${dateRange[0].endDate.toLocaleDateString()}`
            );
            
            // Clear selected times
            setSelectedTimes([]);
            
            // Refresh appointments
            await fetchAppointments();

            // Clear success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000);

        } catch (err) {
            console.error("Error saving availability:", err);
            setError(err.message || "Failed to save availability");
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        fetchAppointments();
    };

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <h2>Consultation Schedule</h2>

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: "10px",
                        backgroundColor: "#fee",
                        color: "#c00",
                        borderRadius: "5px",
                        marginBottom: "15px"
                    }}>
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div style={{
                        padding: "10px",
                        backgroundColor: "#efe",
                        color: "#0a0",
                        borderRadius: "5px",
                        marginBottom: "15px"
                    }}>
                        {successMessage}
                    </div>
                )}

                <div className={styles.scheduleBox}>
                    {/* 📅 Calendar */}
                    <div className={styles.calendarBox}>
                        <DateRange
                            editableDateInputs={true}
                            onChange={(item) => setDateRange([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={dateRange}
                            rangeColors={["#3b82f6"]}
                        />
                    </div>

                    {/* 🕒 Time Slots */}
                    <div className={styles.timesBox}>
                        {timeSlots.map((slot) => (
                            <div key={slot} className={styles.timeRow}>
                                <label>{slot}</label>
                                <input
                                    type="checkbox"
                                    checked={selectedTimes.includes(slot)}
                                    onChange={() => toggleTime(slot)}
                                />
                            </div>
                        ))}
                        <button 
                            className={styles.addBtn} 
                            onClick={handleAdd}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Appointment"}
                        </button>
                    </div>
                </div>

                {/* 📆 Upcoming Appointments */}
                <div className={styles.appointmentSection}>
                    <div className={styles.appointmentsBox}>
                        <div className={styles.appointmentsHeader}>
                            <h3>Upcoming Appointments</h3>
                            <p>
                                {doctorInfo 
                                    ? `Dr ${doctorInfo.name} - ${doctorInfo.specialization}` 
                                    : "Loading..."}
                            </p>
                        </div>

                        <div className={styles.filterBox}>
                            <FontAwesomeIcon icon={faCalendarDays} className={styles.icon} />
                            <button 
                                className={styles.filterBtn} 
                                onClick={handleFilter}
                                disabled={loading}
                            >
                                Filter By Date
                            </button>
                        </div>
                    </div>
                </div>

                {loading && <p>Loading appointments...</p>}

                {!loading && appointments.length === 0 && (
                    <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
                        No appointments found for the selected date range.
                    </p>
                )}

                <div className={styles.cardGrid}>
                    {appointments.map((appt, i) => (
                        <AppointmentCard key={i} {...appt} />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ViewAppointments;