import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.203.223:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;