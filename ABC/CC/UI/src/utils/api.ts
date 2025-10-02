/* istanbul ignore file */
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken, clearToken } from "./authtokenhandler";
import config from "../config/config";
const baseUrl = `${config.apiUrl}auth/`;

const api = (baseURL: string): AxiosInstance => {
  const api: AxiosInstance = axios.create({
    baseURL: baseURL, // Use the provided base URL
  });

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = getToken();
      if (token) {
        if (config.headers) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError): Promise<AxiosError> => {
      if (error.response && error.response.status === 401) {
        // Handle unauthorized access
        // Token expired, try refreshing
        const newAccessToken = await refreshToken();
        if (newAccessToken && error.config) {
          // Retry the original request
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(error.config);
        } else {
          clearToken();
          window.location.href = "/CareCoordinationUI/Invalidsession";
        }
      }
      return Promise.reject(error);
    }
  );
  return api;
};
export default api;


const refreshToken = async (): Promise<string | null> => {
  try {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const userName = localStorage.getItem("userName");
    if (!storedRefreshToken) {
      localStorage.clear(); // Clear tokens
      throw new Error("Refresh token not available");
    }
    var data = JSON.stringify({
      "userName": userName,
      "refreshToken": storedRefreshToken
    });
    const response = await api(baseUrl).post("refresh-token", data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-KEY": "MyAPIKey7347627",
        },
      }
    );
    if (response.status === 200) {
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      return accessToken;
    } else {
      console.error("InValid Refresh token");
      return null;
    }
  } catch (err) {
    console.error("Failed to refresh token", err);
    return null;
  }
};
