import React from 'react'
import { NavLink, Routes, Route, useLocation } from 'react-router-dom'
import './admin.css'
import Dashboard from './adminDashboad.jsx'
import CoursesAdmin from './patientAdmin.jsx'

import StudentsAdmin from './appoinmentAdmin.jsx'
import InstructorsAdmin from './doctorAdmin.jsx'


export default function AdminLayout() {
  const location = useLocation();
  
  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '24px' }}>Clinic Booking System
 Admin</h2>
        </div>
        <ul className="sidebar-nav">
          <li>
            <NavLink 
              to="/admin" 
              end
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/patients"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              👨‍🏫 Patients
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/doctors"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              👨‍🏫 Doctors
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/appoinments"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              📚 Appinments
            </NavLink>
          </li>
         
          
          <li style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <NavLink 
              to="/"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              🏠 Back to Home
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <main className="admin-content">
      
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/appoinments" element={<StudentsAdmin/>}/>
          <Route path="/doctors" element={<InstructorsAdmin/>}/>
          <Route path='/patients' element={<CoursesAdmin/>}/>
          {/* Add other routes as needed */}
        </Routes>
      </main>
    </div>
  )
}