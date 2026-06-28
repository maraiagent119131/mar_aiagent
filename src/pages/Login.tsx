import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { setToken } from "../auth/token";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);

      setToken(data.access_token);

      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

      <p onClick={() => navigate("/signup")}>
        Create account
      </p>
    </div>
  );
}