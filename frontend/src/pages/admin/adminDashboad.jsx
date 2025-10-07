import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { courseAPI, studentAPI, instructorAPI, enrollmentAPI } from '../../services/api'
import './admin.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalEnrollments: 0,
    activeCourses: 0,
    recentEnrollments: 0,
    completionRate: 85,
    averageRating: 4.5,
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
      const [courses, students, instructors, enrollments] = await Promise.all([
        courseAPI.getAllCourses().catch((err) => {
          console.error('Error fetching courses:', err)
          return []
        }),
        studentAPI.getAllStudents().catch((err) => {
          console.error('Error fetching students:', err)
          return []
        }),
        instructorAPI.getAllInstructors().catch((err) => {
          console.error('Error fetching instructors:', err)
          return []
        }),
        enrollmentAPI.getAllEnrollments().catch((err) => {
          console.error('Error fetching enrollments:', err)
          return []
        })
      ])

      // Log the responses to debug the structure
      console.log('Dashboard API Responses:', { courses, students, instructors, enrollments })

      // Handle different response formats for courses
      let coursesData = courses
      if (courses && courses.courses) {
        coursesData = courses.courses
      } else if (courses && courses.data) {
        coursesData = courses.data
      }

      // Handle different response formats for students
      let studentsData = students
      if (students && students.students) {
        studentsData = students.students
      } else if (students && students.users) {
        studentsData = students.users
      } else if (students && students.data) {
        studentsData = students.data
      }

      // Handle different response formats for instructors
      let instructorsData = instructors
      if (instructors && instructors.instructors) {
        instructorsData = instructors.instructors
      } else if (instructors && instructors.data) {
        instructorsData = instructors.data
      }

      // Handle different response formats for enrollments
      let enrollmentsData = enrollments
      if (enrollments && enrollments.enrollments) {
        enrollmentsData = enrollments.enrollments
      } else if (enrollments && enrollments.data) {
        enrollmentsData = enrollments.data
      }

      // Ensure all data are arrays
      if (!Array.isArray(coursesData)) coursesData = []
      if (!Array.isArray(studentsData)) studentsData = []
      if (!Array.isArray(instructorsData)) instructorsData = []
      if (!Array.isArray(enrollmentsData)) enrollmentsData = []

      console.log('Processed data arrays:', {
        coursesCount: coursesData.length,
        studentsCount: studentsData.length,
        instructorsCount: instructorsData.length,
        enrollmentsCount: enrollmentsData.length
      })

      // Calculate stats - REMOVED the role filtering since students come from studentAPI
      // All students from studentAPI are actual students, no need to filter by role
      const activeCourses = coursesData.filter(course => 
        course.status === 'active' || course.status !== 'inactive'
      )
      
      // Get recent enrollments (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const recentEnrollments = enrollmentsData.filter(enrollment => {
        const enrollmentDate = enrollment.enrollmentDate || enrollment.createdAt
        return enrollmentDate && new Date(enrollmentDate) > thirtyDaysAgo
      })

      // Generate recent activity
      const activity = []
      
      // Add recent enrollments to activity
      recentEnrollments.slice(0, 3).forEach(enrollment => {
        activity.push({
          id: enrollment._id,
          type: 'enrollment',
          message: `New enrollment in ${enrollment.courseName || 'course'}`,
          time: enrollment.enrollmentDate || enrollment.createdAt,
          icon: '📚'
        })
      })
      
      // Add recent courses to activity
      coursesData.slice(-2).forEach(course => {
        activity.push({
          id: course._id,
          type: 'course',
          message: `Course "${course.name || course.title}" ${course.status === 'active' ? 'activated' : 'added'}`,
          time: course.createdAt || course.updatedAt,
          icon: '🎓'
        })
      })

      // Sort activity by time and take top 5
      const sortedActivity = activity
        .filter(item => item.time) // Only include items with valid timestamps
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5)

      setStats({
        totalCourses: coursesData.length,
        totalStudents: studentsData.length, // Direct count, no role filtering
        totalInstructors: instructorsData.length,
        totalEnrollments: enrollmentsData.length,
        activeCourses: activeCourses.length,
        recentEnrollments: recentEnrollments.length,
        completionRate: 85,
        averageRating: 4.5,
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
            className={`action-btn  ${refreshing ? 'loading' : ''}`}
            disabled={refreshing}
            title="Refresh Dashboard"
          >
            {refreshing ? '⏳' : '🔄'} Refresh
          </button>
        </div>
      </div>
      
      {/* Main Stats Cards */}
      <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
        
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => handleNavigateToSection('/admin/students')}>
          <h3>Total Patients</h3>
          <div className="stat-number">{stats.totalStudents}</div>
          <div className="stat-label">Registered Patients</div>
        </div>
        
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => handleNavigateToSection('/admin/instructors')}>
          <h3>Total Doctors</h3>
          <div className="stat-number">{stats.totalInstructors}</div>
          <div className="stat-label">Doctors staff</div>
        </div>
        
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => handleNavigateToSection('/admin/enrollments')}>
          <h3>Total Appoinments</h3>
          <div className="stat-number">{stats.totalEnrollments}</div>
          <div className="stat-label">{stats.recentEnrollments} in last 30 days</div>
        </div>
      </div>

      {/* Secondary Stats Cards */}
      <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
        
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
          <Link to="/admin/courses/add" className="add-product-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            👨‍🏫 Add New Patient
          </Link>
          <Link to="/admin/instructors/add" className="add-product-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            👨‍🏫 Add New Doctor
          </Link>
          
          <Link to="/admin/enrollments" className="add-product-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            📊 View Appionments
          </Link>
          
          
        </div>
      </div>

      

    </div>
  )
}