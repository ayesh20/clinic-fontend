import axios from 'axios'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token (FIXED - skips auth for public endpoints)
apiClient.interceptors.request.use(
  (config) => {
    // Define public endpoints that don't need authentication
    const publicEndpoints = [
      '/patients/login',
      '/patients/register',
      '/doctors/login',
      '/doctors/register',
      '/contact'
    ];
    
    // Check if this is a registration/login request
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url.includes(endpoint)
    );
    
    const isRegistration = (config.url.includes('/patients') && 
                          config.method === 'post' && 
                          !config.url.includes('/patients/')) ||
                          (config.url.includes('/doctors') && 
                          config.method === 'post' && 
                          !config.url.includes('/doctors/'));
    
    // Add authorization token only if not a public endpoint
    if (!isPublicEndpoint && !isRegistration) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

// Response interceptor (unchanged)
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


// Export the axios instance for custom requests
export { apiClient }

// Export all APIs as default object
const api = {
  
}

export default api