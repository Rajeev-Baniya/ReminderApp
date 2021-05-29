import axios from "axios";

const baseURL = "http://127.0.0.1:5000/";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");

    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

export default axiosInstance;