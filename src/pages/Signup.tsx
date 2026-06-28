import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signupUser(email, password);

      alert("Account created");

      navigate("/login");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup}>
        Create Account
      </button>

      <p onClick={() => navigate("/login")}>
        Already have account?
      </p>
    </div>
  );
}