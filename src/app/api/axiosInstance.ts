import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  // Add timeout and headers
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = (jwtDecode as any)(token) as { exp: number };
        // const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        // Check if token will expire in the next 5 minutes
        if (decodedToken?.exp && decodedToken.exp < currentTime + 300) {
          // Here you could add refresh token logic if needed
          localStorage.removeItem("token");
          window.location.href = "/auth/signin";
          return Promise.reject("Token expired");
        }

        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      localStorage.removeItem("token");
      window.location.href = "/auth/signin";
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
