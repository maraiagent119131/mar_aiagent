import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    email,
    password,
  });

  return response.data;
};


export const signupUser = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/auth/signup`, {
    email,
    password,
  });

  return response.data;
};