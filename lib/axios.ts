import axios from "axios";
import { getAccessToken } from "./accesstoken";

const instance = axios.create({
  baseURL: "/api/",
  validateStatus: (status) => status >= 200 && status < 500,
});

instance.interceptors.request.use((config) => {
  const token = getAccessToken();
  console.log(token);
  config!.headers!.Authorization = `Bearer ${token}`;

  return config;
});

export default instance;
