import React, { useState } from "react";
import styles from "./ViewAppoinments.module.css";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const ViewAppointments = () => {
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [appointments, setAppointments] = useState([
        {
            name: "John Doe",
            email: "Johndoe@gmail.com",
            issue: "Headache",
            phone: "+14744855555",
            date: "2025/09/01",
            time: "09.30 A.M",
        },
        {
            name: "John Doe",
            email: "Johndoe@gmail.com",
            issue: "Headache",
            phone: "+14744855555",
            date: "2025/09/01",
            time: "09.30 A.M",
        },
        {
            name: "John Doe",
            email: "Johndoe@gmail.com",
            issue: "Headache",
            phone: "+14744855555",
            date: "2025/09/01",
            time: "09.30 A.M",
        },
        {
            name: "John Doe",
            email: "Johndoe@gmail.com",
            issue: "Headache",
            phone: "+14744855555",
            date: "2025/09/01",
            time: "09.30 A.M",
        },
        {
            name: "John Doe",
            email: "Johndoe@gmail.com",
            issue: "Headache",
            phone: "+14744855555",
            date: "2025/09/01",
            time: "09.30 A.M",
        },
        {
            name: "John Doe",
            email: "Johndoe@gmail.com",
            issue: "Headache",
            phone: "+14744855555",
            date: "2025/09/01",
            time: "09.30 A.M",
        },
    ]);

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

    const toggleTime = (slot) => {
        setSelectedTimes((prev) =>
            prev.includes(slot) ? prev.filter((t) => t !== slot) : [...prev, slot]
        );
    };

    const handleAdd = () => {
        alert(`Added ${selectedTimes.length} new slots for ${dateRange[0].startDate.toDateString()} - ${dateRange[0].endDate.toDateString()}`);
    };

    const handleFilter = () => {
        const start = dateRange[0].startDate.toDateString();
        const end = dateRange[0].endDate.toDateString();
        alert(`Filtering appointments from ${start} to ${end}`);
    };

    return (
        <div><Navbar />
            <div className={styles.container}>
                <h2>Consultation Schedule</h2>

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
                        <button className={styles.addBtn} onClick={handleAdd}>
                            Save Appointment
                        </button>
                    </div>
                </div>

                {/* 📆 Upcoming Appointments */}

                <div className={styles.appointmentSection}>
                    <div className={styles.appointmentsBox}>
                        <div className={styles.appointmentsHeader}>
                            <h3>Upcoming Appointments</h3>
                            <p>Dr Anya Sharma - Cardiologist</p>
                        </div>

                        <div className={styles.filterBox}>
                            <FontAwesomeIcon icon={faCalendarDays} className={styles.icon} />
                            <button className={styles.filterBtn} onClick={handleFilter}>
                                Filter By Date
                            </button>
                        </div>
                    </div>
                </div>

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

