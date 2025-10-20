import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { patientAPI } from '../../services/api'
import './admin.css'

export default function PatientAdmin() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await patientAPI.getAllPatients()
      
      console.log('Patients API Response:', response)
      
      // Handle different response formats
      let patientsData = response
      if (response && response.patients) {
        patientsData = response.patients
      } else if (response && response.data) {
        patientsData = response.data
      }
      
      // Ensure data is an array
      if (!Array.isArray(patientsData)) {
        console.error('API did not return an array:', patientsData)
        setPatients([])
        setError('Invalid data format received from server')
        return
      }
      
      setPatients(patientsData)
      setError(null)
    } catch (err) {
      setError('Failed to fetch patients: ' + err.message)
      console.error('Error fetching patients:', err)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      try {
        await patientAPI.deletePatient(patientId)
        fetchPatients()
        alert('Patient deleted successfully!')
      } catch (err) {
        alert('Failed to delete patient: ' + err.message)
        console.error('Error deleting patient:', err)
      }
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Patient Management</h1>
        <div className="loading">Loading patients...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Patient Management</h1>
        <div className="error">Error: {error}</div>
        <button onClick={fetchPatients} className="retry-btn">Retry</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Patient Management</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: '250px', margin: 0 }}
          />
          
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Total Patients</h3>
          <div className="stat-number">{patients.length}</div>
          <div className="stat-label">Registered patients</div>
        </div>
        
        <div className="stat-card">
          <h3>Active Patients</h3>
          <div className="stat-number">{patients.filter(p => p.isActive !== false).length}</div>
          <div className="stat-label">Currently active</div>
        </div>
        
        <div className="stat-card">
          <h3>Inactive Patients</h3>
          <div className="stat-number">{patients.filter(p => p.isActive === false).length}</div>
          <div className="stat-label">Deactivated</div>
        </div>
        
        <div className="stat-card">
          <h3>New This Month</h3>
          <div className="stat-number">
            {patients.filter(p => {
              const createdDate = new Date(p.createdAt)
              const now = new Date()
              return createdDate.getMonth() === now.getMonth() && 
                     createdDate.getFullYear() === now.getFullYear()
            }).length}
          </div>
          <div className="stat-label">Registered this month</div>
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="no-patients">
          <h3>No patients found</h3>
          <p>{searchTerm ? 'No patients match your search criteria.' : 'No patients have registered yet.'}</p>
          
        </div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Registered Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient._id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {patient._id.slice(-6).toUpperCase()}
                </td>
                <td className="username">
                  <div style={{ fontWeight: 'bold' }}>
                    {`${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'N/A'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    {patient.email}
                  </div>
                </td>
                <td className="email">{patient.email}</td>
                <td className="phone">{patient.phone || 'N/A'}</td>
                <td>
                  {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="status">
                  <span className={`status-badge ${patient.isActive === false ? 'inactive' : 'active'}`}>
                    {patient.isActive === false ? 'Inactive' : 'Active'}
                  </span>
                </td>
                <td className="actions">
                  
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeletePatient(patient._id)}
                    title="Delete Patient"
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