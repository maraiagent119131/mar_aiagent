import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../auth/token";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
  }, []);

  const logout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div>
      <h1>MAR AI Teacher</h1>

      <button onClick={logout}>
        Logout
      </button>

      <p>Welcome to AI Learning System 🎓</p>
    </div>
  );
}