import axios from 'axios'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Define public endpoints that don't need authentication
    const publicEndpoints = [
      '/patients/login',
      '/patients/register',
      '/doctors/login',
      '/doctors/register',
      '/admin/login',
      '/contact'
    ];
    
    // Check if the URL exactly matches a public endpoint or is the public doctors list
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url === endpoint
    ) || (config.url === '/doctors' && config.method.toLowerCase() === 'get');
    
    // Add token for all non-public endpoints
    if (!isPublicEndpoint) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Handle FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data || `HTTP error! status: ${error.response.status}`
      console.error(`API request failed:`, errorMessage)
      throw new Error(errorMessage)
    } else if (error.request) {
      console.error('Network error:', error.request)
      throw new Error('Network error - please check your connection')
    } else {
      console.error('Request error:', error.message)
      throw new Error(error.message)
    }
  }
)

// Patient API
export const patientAPI = {
  register: async (patientData) => {
    const response = await apiClient.post('/patients/register', patientData);
    if (response.token) localStorage.setItem('authToken', response.token);
    return response;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/patients/login', credentials);
    if (response.token) localStorage.setItem('authToken', response.token);
    return response;
  },

  getAllPatients: async () => {
    return await apiClient.get('/patients');
  },

  getPatientById: async (patientId) => {
    return await apiClient.get(`/patients/${patientId}`);
  },

  getProfile: async () => {
    return await apiClient.get('/patients/profile');
  },

  updateProfile: async (profileData) => {
    return await apiClient.put('/patients/profile', profileData);
  },

  updatePatient: async (patientId, patientData) => {
    return await apiClient.put(`/patients/admin/${patientId}`, patientData);
  },

  deleteAccount: async () => {
    const response = await apiClient.delete('/patients/profile');
    localStorage.removeItem('authToken');
    return response;
  },

  deletePatient: async (patientId) => {
    return await apiClient.delete(`/patients/admin/${patientId}`);
  },

  searchPatients: async (query) => {
    return await apiClient.get(`/patients/search/${query}`);
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
  }
};

// Doctor API
export const doctorAPI = {
  register: async (doctorData) => {
    const response = await apiClient.post('/doctors/register', doctorData);
    if (response.token) localStorage.setItem('authToken', response.token);
    return response;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/doctors/login', credentials);
    if (response.token) localStorage.setItem('authToken', response.token);
    return response;
  },

  getAllDoctors: async (params = {}) => {
    return await apiClient.get('/doctors', { params });
  },

  getDoctorById: async (doctorId) => {
    return await apiClient.get(`/doctors/${doctorId}`);
  },

  getProfile: async () => {
    return await apiClient.get('/doctors/profile');
  },

  updateProfile: async (profileData) => {
    return await apiClient.put('/doctors/profile', profileData);
  },

  updateDoctor: async (doctorId, doctorData) => {
    return await apiClient.put(`/doctors/admin/${doctorId}`, doctorData);
  },

  deleteAccount: async () => {
    const response = await apiClient.delete('/doctors/profile');
    localStorage.removeItem('authToken');
    return response;
  },

  deleteDoctor: async (doctorId) => {
    return await apiClient.delete(`/doctors/admin/${doctorId}`);
  },

  searchDoctors: async (query) => {
    return await apiClient.get(`/doctors/search/${query}`);
  },

  getDoctorsBySpecialization: async (specialization) => {
    return await apiClient.get(`/doctors/specialization/${specialization}`);
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
  }
};

// Admin API
export const adminAPI = {
  login: async (credentials) => {
    const response = await apiClient.post('/admin/login', credentials);
    if (response.token) localStorage.setItem('authToken', response.token);
    return response;
  },

  getProfile: async () => {
    return await apiClient.get('/admin/profile');
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
  }
};

// Export the axios instance for custom requests
export { apiClient }

// Export all APIs as default object
const api = {
  patient: patientAPI,
  doctor: doctorAPI,
  admin: adminAPI,
}

export default api