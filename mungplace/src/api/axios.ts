import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:3030',
  withCredentials: true,
});

export default axiosInstance;
