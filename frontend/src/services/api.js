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
      '/doctors',
      '/doctors/',
      '/contact'
    ];
    
    // Check if this is a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url.includes(endpoint)
    );
    
    // Add authorization token only if not a public endpoint
    if (!isPublicEndpoint) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // If data is FormData, remove Content-Type to let axios set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
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
  // Register a new patient
  register: async (patientData) => {
    try {
      const response = await apiClient.post('/patients/register', patientData);
      // Store token if provided
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login patient
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/patients/login', credentials);
      // Store token
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get patient profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/patients/profile');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update patient profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/patients/profile', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete patient account
  deleteAccount: async () => {
    try {
      const response = await apiClient.delete('/patients/profile');
      // Clear token after deletion
      localStorage.removeItem('authToken');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
  }
};

// Doctor API
export const doctorAPI = {
  // Register a new doctor
  register: async (doctorData) => {
    try {
      // The request interceptor will automatically handle FormData
      const response = await apiClient.post('/doctors/register', doctorData);
      // Store token if provided
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login doctor
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/doctors/login', credentials);
      // Store token
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get doctor profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/doctors/profile');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update doctor profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/doctors/profile', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete doctor account
  deleteAccount: async () => {
    try {
      const response = await apiClient.delete('/doctors/profile');
      // Clear token after deletion
      localStorage.removeItem('authToken');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get all doctors (with optional filters)
  getAllDoctors: async (params = {}) => {
    try {
      const response = await apiClient.get('/doctors', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get doctor by ID
  getDoctorById: async (doctorId) => {
    try {
      const response = await apiClient.get(`/doctors/${doctorId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search doctors
  searchDoctors: async (query) => {
    try {
      const response = await apiClient.get(`/doctors/search/${query}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get doctors by specialization
  getDoctorsBySpecialization: async (specialization) => {
    try {
      const response = await apiClient.get(`/doctors/specialization/${specialization}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
  }
};

// Export the axios instance for custom requests
export { apiClient }

// Export all APIs as default object
const api = {
  patient: patientAPI,
  doctor: doctorAPI
}

export default api