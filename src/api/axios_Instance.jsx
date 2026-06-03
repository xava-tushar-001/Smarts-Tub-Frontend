
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL 

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
//   withCredentials: true, 
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;