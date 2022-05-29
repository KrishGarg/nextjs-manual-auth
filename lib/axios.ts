import axios from "axios";
import { getAccessTokenInfo } from "@/lib/auth/frontend/tokens";

const instance = axios.create({
  baseURL: "/api/",
  validateStatus: (status) => status >= 200 && status < 500,
});

instance.interceptors.request.use((config) => {
  const token = getAccessTokenInfo();
  if (!token) return config;
  config!.headers!.Authorization = `Bearer ${token.token}`;

  return config;
});

export default instance;
