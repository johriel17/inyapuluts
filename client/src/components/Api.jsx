
import axios from 'axios';
// import { useLogout } from '../hooks/useLogout';
import useLogout from '../hooks/useLogout'

const ApiClient = () => {
  const { logout } = useLogout();

  // Create Axios instance
  const api = axios.create({
    baseURL: 'https://inyapuluts.onrender.com/api',
  });

  // Add request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.data.error === 'Token Expired') {
        logout();
         
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default ApiClient;
