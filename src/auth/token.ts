const TOKEN_KEY = "mar_token";


export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};


export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};


export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};


export const isLoggedIn = () => {
  return !!getToken();
};