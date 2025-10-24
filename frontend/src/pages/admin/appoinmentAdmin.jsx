import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { appointmentAPI } from '../../services/api'
import './admin.css'

export default function AppointmentAdmin() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await appointmentAPI.getAllAppointments()
      
      console.log('Appointments API Response:', response)
      
      let appointmentsData = response
      if (response && response.appointments) {
        appointmentsData = response.appointments
      } else if (response && response.data) {
        appointmentsData = response.data
      }
      
      if (!Array.isArray(appointmentsData)) {
        console.error('API did not return an array:', appointmentsData)
        setAppointments([])
        setError('Invalid data format received from server')
        return
      }
      
      setAppointments(appointmentsData)
      
    } catch (err) {
      setError('Failed to fetch appointments: ' + err.message)
      console.error('Error fetching appointments:', err)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentAPI.deleteAppointment(appointmentId)
        fetchAppointments()
        alert('Appointment deleted successfully!')
      } catch (err) {
        alert('Failed to delete appointment: ' + err.message)
        console.error('Error deleting appointment:', err)
      }
    }
  }

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await appointmentAPI.updateAppointmentStatus(appointmentId, { status: newStatus })
      fetchAppointments()
      alert('Appointment status updated successfully!')
    } catch (err) {
      alert('Failed to update status: ' + err.message)
      console.error('Error updating status:', err)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'confirmed':
        return 'status-confirmed'
      case 'pending':
        return 'status-pending'
      case 'completed':
        return 'status-completed'
      case 'cancelled':
        return 'status-cancelled'
      case 'no-show':
        return 'status-no-show'
      default:
        return ''
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  }

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Appointment Management</h1>
        <div className="loading">Loading appointments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Appointment Management</h1>
        <div className="error">Error: {error}</div>
        <button onClick={fetchAppointments} className="retry-btn">Retry</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Appointment Management</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              minWidth: '250px'
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ddd'
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Total Appointments</h3>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">All appointments</div>
        </div>
        
        <div className="stat-card">
          <h3>Pending</h3>
          <div className="stat-number" style={{ color: '#f59e0b' }}>{stats.pending}</div>
          <div className="stat-label">Awaiting confirmation</div>
        </div>
        
        <div className="stat-card">
          <h3>Confirmed</h3>
          <div className="stat-number" style={{ color: '#3b82f6' }}>{stats.confirmed}</div>
          <div className="stat-label">Scheduled appointments</div>
        </div>
        
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="stat-number" style={{ color: '#10b981' }}>{stats.completed}</div>
          <div className="stat-label">Finished appointments</div>
        </div>

        <div className="stat-card">
          <h3>Cancelled</h3>
          <div className="stat-number" style={{ color: '#ef4444' }}>{stats.cancelled}</div>
          <div className="stat-label">Cancelled bookings</div>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="no-students">
          <h3>No Appointments found</h3>
          <p>{searchTerm || statusFilter !== 'all' ? 'No appointments match your search criteria.' : 'No appointments have been booked yet.'}</p>
        </div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Phone</th>
              <th>Appoinment Date</th>
              <th>Appoinment time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((appointment) => (
              <tr key={appointment._id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {appointment.appointmentId || appointment._id.slice(-6)}
                </td>
                <td className="username">
                  <div style={{ fontWeight: 'bold' }}>
                    {`${student.firstName || ''} ${student.lastName || ''}`.trim() || 'N/A'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    Role: {student.role || 'student'}
                  </div>
                </td>
                <td className="email">{student.email}</td>
                <td className="phone">{student.phone || 'N/A'}</td>
                <td>
                  {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 
                   student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ 
                    background: student.enrollmentsCount > 0 ? '#4ECDC4' : '#ddd', 
                    color: student.enrollmentsCount > 0 ? 'white' : '#666',
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {student.enrollmentsCount}
                  </span>
                </td>
                <td className="status">
                  <span className={`status-badge ${student.status === 'inactive' ? 'inactive' : 'active'}`}>
                    {student.status === 'inactive' ? 'Inactive' : 'Active'}
                  </span>
                </td>
                <td className="actions">
                 
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteStudent(student._id)}
                    title="Delete Student"
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