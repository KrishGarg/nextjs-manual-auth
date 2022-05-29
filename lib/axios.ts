import axios from "axios";
import { getAccessToken } from "./auth/frontend/accesstoken";

const instance = axios.create({
  baseURL: "/api/",
  validateStatus: (status) => status >= 200 && status < 500,
});

instance.interceptors.request.use((config) => {
  const token = getAccessToken();
  config!.headers!.Authorization = `Bearer ${token}`;

  return config;
});

export default instance;
