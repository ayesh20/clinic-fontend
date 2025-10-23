import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { doctorAPI } from '../../services/api'
import './admin.css'

export default function DoctorsAdmin() {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await doctorAPI.getAllDoctors()
      
      console.log('Doctors API Response:', response)
      
      // Handle different response formats
      let doctorsData = response
      if (response && response.doctors) {
        doctorsData = response.doctors
      } else if (response && response.data) {
        doctorsData = response.data
      }
      
      // Ensure data is an array
      if (!Array.isArray(doctorsData)) {
        console.error('API did not return an array:', doctorsData)
        setDoctors([])
        setError('Invalid data format received from server')
        return
      }
      
      setDoctors(doctorsData)
      setError(null)
    } catch (err) {
      setError('Failed to fetch doctors: ' + err.message)
      console.error('Error fetching doctors:', err)
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      try {
        await doctorAPI.deleteDoctor(doctorId)
        fetchDoctors()
        alert('Doctor deleted successfully!')
      } catch (err) {
        alert('Failed to delete doctor: ' + err.message)
        console.error('Error deleting doctor:', err)
      }
    }
  }

  const filteredDoctors = doctors.filter(doctor =>
    doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.phone?.includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Doctors Management</h1>
        <div className="loading">Loading doctors...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Doctors Management</h1>
        <div className="error">Error: {error}</div>
        <button onClick={fetchDoctors} className="retry-btn">Retry</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Doctors Management</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: '250px', margin: 0 }}
          />
          <Link to="/admin/adddoctor" className="add-product-btn">
            ➕ Add New Doctor
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Total Doctors</h3>
          <div className="stat-number">{doctors.length}</div>
          <div className="stat-label">Registered doctors</div>
        </div>
        
        <div className="stat-card">
          <h3>Active Doctors</h3>
          <div className="stat-number">{doctors.filter(d => d.isActive !== false).length}</div>
          <div className="stat-label">Currently active</div>
        </div>
        
        <div className="stat-card">
          <h3>Specializations</h3>
          <div className="stat-number">
            {new Set(doctors.map(d => d.specialization)).size}
          </div>
          <div className="stat-label">Different specialties</div>
        </div>
        
        <div className="stat-card">
          <h3>New This Month</h3>
          <div className="stat-number">
            {doctors.filter(d => {
              const createdDate = new Date(d.createdAt)
              const now = new Date()
              return createdDate.getMonth() === now.getMonth() && 
                     createdDate.getFullYear() === now.getFullYear()
            }).length}
          </div>
          <div className="stat-label">Joined this month</div>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="no-doctors">
          <h3>No doctors found</h3>
          <p>{searchTerm ? 'No doctors match your search criteria.' : 'Get started by adding your first doctor!'}</p>
          <Link to="/admin/adddoctor" className="add-product-btn" style={{ marginTop: '20px', display: 'inline-block' }}>
            ➕ Add First Doctor
          </Link>
        </div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialization</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr key={doctor._id}>
                <td>
                  <img 
                    src={doctor.profilePicture || "/images/user.png"}
                    alt={doctor.fullName || 'Doctor'} 
                    className="product-image"
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </td>
                <td className="doctor-name">
                  <div style={{ fontWeight: 'bold' }}>{doctor.fullName || 'N/A'}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    ID: {doctor._id.slice(-6).toUpperCase()}
                  </div>
                </td>
                <td className="email">{doctor.email || 'N/A'}</td>
                <td className="phone">{doctor.phone || 'N/A'}</td>
                <td style={{ textTransform: 'capitalize' }}>
                  <span style={{ 
                    background: '#4ECDC4', 
                    color: 'white',
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {doctor.specialization || 'General'}
                  </span>
                </td>
                <td>
                  {doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="status">
                  <span className={`status-badge ${doctor.isActive === false ? 'inactive' : 'active'}`}>
                    {doctor.isActive === false ? 'Inactive' : 'Active'}
                  </span>
                </td>
                <td className="actions">
                 
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteDoctor(doctor._id)}
                    title="Delete Doctor"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}