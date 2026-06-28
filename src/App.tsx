import { useState } from "react";
import { loginUser, signupUser } from "./api/auth";
import { sendAudio } from "./api/teacherApi";
import { setToken } from "./auth/token";
import LanguageSelector from "./components/LanguageSelector/LanguageSelector";
import Microphone from "./components/Microphone/Microphone";

type Language = "en" | "hi";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSignup, setIsSignup] = useState(false);

  const [selectedLanguage, setSelectedLanguage] =
    useState<Language | null>(null);

  const [recognizedText, setRecognizedText] = useState("");

  const [teacherResponse, setTeacherResponse] = useState("");

  const [status, setStatus] = useState("🟢 Ready");

  const handleAuth = async () => {
    if (!email || !password || (isSignup && !fullName)) {
      alert("Please enter all required fields");
      return;
    }

    try {
      if (isSignup) {
        await signupUser(fullName, email, password);
        alert("Account created. Please sign in.");
        setIsSignup(false);
        setFullName("");
        setPassword("");
        return;
      }

      const data = await loginUser(email, password);
      setToken(data.access_token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      alert(isSignup ? "Signup failed" : "Invalid email or password");
    }
  };

  const handleRecordingComplete = async (
    _: string,
    blob: Blob
  ) => {
    if (!selectedLanguage) {
      alert("Please select a language first.");
      return;
    }

    setStatus("⏳ Sending audio...");

    try {
      const response = await sendAudio(blob, selectedLanguage);

      setRecognizedText(response.recognized_text);
      setTeacherResponse(response.teacher_response);

      setStatus("🔊 Playing response");

      const audio = new Audio(
        `http://127.0.0.1:8000${response.audio_url}`
      );

      audio.play();

      audio.onended = () => {
        setStatus("🟢 Ready");
      };
    } catch (error) {
      console.error(error);
      setStatus("❌ Error");
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial",
          backgroundColor: "#f5f7fb",
        }}
      >
        <div
          style={{
            width: "350px",
            padding: "30px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            {isSignup ? "Sign Up" : "Login"}
          </h2>

          {isSignup && (
            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <button
            onClick={handleAuth}
            style={{ width: "100%", padding: "10px" }}
          >
            {isSignup ? "Create Account" : "Login"}
          </button>

          <p
            style={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => {
              setIsSignup(!isSignup);
              setFullName("");
              setPassword("");
            }}
          >
            {isSignup
              ? "Already have account? Login"
              : "Create new account"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "700px",
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#2563eb" }}>
          Learn with MAR
        </h1>

        <p style={{ textAlign: "center", color: "#666" }}>
          Personalized AI Learning
        </p>

        {!selectedLanguage ? (
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageSelect={setSelectedLanguage}
          />
        ) : (
          <>
            <h2 style={{ textAlign: "center" }}>
              {selectedLanguage === "en"
                ? "Let's learn English together!"
                : "आइए हिन्दी सीखें!"}
            </h2>

            <Microphone
              onRecordingComplete={handleRecordingComplete}
            />
          </>
        )}

        <hr style={{ margin: "30px 0" }} />

        <h3>Conversation</h3>

        <p>
          <strong>👧 You:</strong> {recognizedText || "-"}
        </p>

        <p>
          <strong>🤖 MAR:</strong> {teacherResponse || "-"}
        </p>

        <hr style={{ margin: "30px 0" }} />

        <p>
          <strong>Status:</strong> {status}
        </p>
      </div>
    </div>
  );
}

export default App;