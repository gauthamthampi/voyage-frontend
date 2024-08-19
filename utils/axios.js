import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('usertoken'); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data.message;

      if (
        errorMessage === 'Token has expired. Please log in again.' ||
        errorMessage === 'User is blocked. Please contact support.'
      ) {
        localStorage.removeItem('usertoken');
        window.location.href = `/login?error=${encodeURIComponent(errorMessage)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
