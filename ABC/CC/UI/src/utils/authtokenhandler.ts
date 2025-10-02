/* istanbul ignore file */
import axios from "axios";
import { RootState } from "../state/store/store";
import { User } from "../types/User";
import api from "./api";
import config from "../config/config";
const baseUrl = `${config.apiUrl}auth/`;

export const getTokenFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("accesstoken");
};
export const getrefreshTokenFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("refreshtoken");
};

export const setToken = (token: string) => {};

export const extractUserDetails = async (token: string) => {
  try {

      const response = await api(baseUrl).get('GetUserDetails', {
        headers: {
          'Authorization': `Bearer ${token}`,
          //"X-API-KEY": "MyAPIKey7347627",
          'Content-Type': 'application/json'
        },
      });
    const user: User = {
      id: response.data.userId,
      email: response.data.username,
      roles: response.data.role,
      hasLEA: response.data.hasLEA,
      permissions : response.data.permissions
    };
    return user;
  } catch (error) {
    console.error("Error validating token:", error);
    return null;
  }
};
export const getToken = (): string | null => {
  const serializedState = localStorage.getItem("CC");
  if (serializedState === null) {
    return null;
  }
  return JSON.parse(serializedState).auth.accessToken;
};

export const clearToken = () => {
  localStorage.removeItem("CC");
};

export const validateToken = async (token: string) => {
  try {
      const response = await api(baseUrl).post('validate-token', null, {
        headers: {
          'Authorization': `Bearer ${token}`,
          //"X-API-KEY": "MyAPIKey7347627"
        },
      });
    return response.data;
  } catch (error) {
    //console.error("Token validation failed:", error);
    return "";
  }
};
export const saveState = (state: RootState) => {
  //key: string,
  try {
    const serializedState = JSON.stringify({
      auth: state.auth,
      request: { RequestId: state.request.RequestId },
    });
    localStorage.setItem("CC", serializedState);
  } catch (error) {
    //console.error("Could not save state", error);
  }
};

export const loadState = () => {
  //key: string
  try {
    const serializedState = localStorage.getItem("CC");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    //console.error("Could not load state", error ?? "");
    return undefined;
  }
};
