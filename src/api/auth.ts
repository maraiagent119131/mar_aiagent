import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    email: email.trim().toLowerCase(),
    password,
  });

  return response.data;
};

export const signupUser = async (fullName: string, email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/auth/signup`, {
    full_name: fullName.trim(),
    email: email.trim().toLowerCase(),
    password,
  });

  return response.data;
};