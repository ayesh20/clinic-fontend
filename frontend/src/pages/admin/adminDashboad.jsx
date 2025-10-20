import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { patientAPI, doctorAPI } from '../../services/api'
import './admin.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    activePatients: 0,
    activeDoctors: 0,
    systemStatus: 'Online'
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch all data in parallel
      const [patientsResponse, doctorsResponse] = await Promise.all([
        patientAPI.getAllPatients().catch((err) => {
          console.error('Error fetching patients:', err)
          return { patients: [] }
        }),
        doctorAPI.getAllDoctors().catch((err) => {
          console.error('Error fetching doctors:', err)
          return { doctors: [] }
        })
      ])

      console.log('Dashboard API Responses:', { patientsResponse, doctorsResponse })

      // Extract data arrays
      const patientsData = patientsResponse.patients || patientsResponse || []
      const doctorsData = doctorsResponse.doctors || doctorsResponse || []

      // Ensure all data are arrays
      const patients = Array.isArray(patientsData) ? patientsData : []
      const doctors = Array.isArray(doctorsData) ? doctorsData : []

      console.log('Processed data:', {
        patientsCount: patients.length,
        doctorsCount: doctors.length
      })

      // Calculate stats
      const activePatients = patients.filter(p => p.isActive !== false)
      const activeDoctors = doctors.filter(d => d.isActive !== false)

      // Generate recent activity
      const activity = []
      
      // Add recent patients to activity
      patients.slice(-3).forEach(patient => {
        activity.push({
          id: patient._id,
          type: 'patient',
          message: `New patient registered: ${patient.firstName} ${patient.lastName}`,
          time: patient.createdAt,
          icon: '🏥'
        })
      })
      
      // Add recent doctors to activity
      doctors.slice(-2).forEach(doctor => {
        activity.push({
          id: doctor._id,
          type: 'doctor',
          message: `New doctor joined: ${doctor.fullName}`,
          time: doctor.createdAt,
          icon: '👨‍⚕️'
        })
      })

      // Sort activity by time and take top 5
      const sortedActivity = activity
        .filter(item => item.time)
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5)

      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        activePatients: activePatients.length,
        activeDoctors: activeDoctors.length,
        systemStatus: 'Online'
      })

      setRecentActivity(sortedActivity)
      
    } catch (err) {
      setError('Failed to fetch dashboard statistics: ' + err.message)
      console.error('Dashboard stats error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardStats()
  }

  const handleNavigateToSection = (path) => {
    navigate(path)
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Dashboard Overview</h1>
        </div>
        <div className="loading">Loading dashboard statistics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Dashboard Overview</h1>
        </div>
        <div className="error">Error: {error}</div>
        <button onClick={fetchDashboardStats} className="retry-btn">Retry</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Dashboard Overview</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={handleRefresh}
            className={`action-btn ${refreshing ? 'loading' : ''}`}
            disabled={refreshing}
            title="Refresh Dashboard"
          >
            {refreshing ? '⏳' : '🔄'} Refresh
          </button>
        </div>
      </div>
      
      {/* Main Stats Cards */}
      <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => handleNavigateToSection('/admin/patients')}>
          <h3>Total Patients</h3>
          <div className="stat-number">{stats.totalPatients}</div>
          <div className="stat-label">{stats.activePatients} Active</div>
        </div>
        
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => handleNavigateToSection('/admin/doctors')}>
          <h3>Total Doctors</h3>
          <div className="stat-number">{stats.totalDoctors}</div>
          <div className="stat-label">{stats.activeDoctors} Active</div>
        </div>
        
        <div className="stat-card">
          <h3>System Status</h3>
          <div className="stat-number">
            <span className={`status-badge ${stats.systemStatus === 'Online' ? 'active' : 'inactive'}`}>
              {stats.systemStatus}
            </span>
          </div>
          <div className="stat-label">Current status</div>
        </div>
        
        <div className="stat-card">
          <h3>Last Updated</h3>
          <div className="stat-number" style={{ fontSize: '16px', color: '#666' }}>
            {new Date().toLocaleDateString()}
          </div>
          <div className="stat-label">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '40px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <Link to="/admin/patients/add" className="add-product-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            🏥 Add New Patient
          </Link>
          <Link to="/admin/doctors/add" className="add-product-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            👨‍⚕️ Add New Doctor
          </Link>
          <Link to="/admin/patients" className="add-product-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            👥 View All Patients
          </Link>
          <Link to="/admin/doctors" className="add-product-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            📊 View All Doctors
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Recent Activity</h2>
          <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {recentActivity.map((activity) => (
              <div key={activity.id} style={{ 
                padding: '15px', 
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <span style={{ fontSize: '24px' }}>{activity.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', color: '#333' }}>{activity.message}</div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    {new Date(activity.time).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}