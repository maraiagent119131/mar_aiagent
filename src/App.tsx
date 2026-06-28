import { useState } from "react";
import { loginUser, signupUser } from "./api/auth";
import { sendAudio } from "./api/teacherApi";
import { setToken } from "./auth/token";
import LanguageSelector from "./components/LanguageSelector/LanguageSelector";
import Microphone from "./components/Microphone/Microphone";
import Avatar from "./components/Avatar";

type Language = "en" | "hi";
type AvatarState = "idle" | "listening" | "talking";

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

  const [avatarState, setAvatarState] =
    useState<AvatarState>("idle");

  // ======================================================
  // AUTH
  // ======================================================
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

  // ======================================================
  // AUDIO HANDLER (AVATAR INTELLIGENCE FLOW)
  // ======================================================
  const handleRecordingComplete = async (_: string, blob: Blob) => {
    if (!selectedLanguage) {
      alert("Please select a language first.");
      return;
    }

    try {
      setAvatarState("listening");
      setStatus("⏳ Sending audio...");

      const response = await sendAudio(blob, selectedLanguage);

      setRecognizedText(response.recognized_text);
      setTeacherResponse(response.teacher_response);

      setAvatarState("talking");
      setStatus("🔊 Playing response");

      const audio = new Audio(
        `http://127.0.0.1:8000${response.audio_url}`
      );

      audio.play();

      audio.onended = () => {
        setStatus("🟢 Ready");
        setAvatarState("idle");
      };
    } catch (error) {
      console.error(error);
      setStatus("❌ Error");
      setAvatarState("idle");
    }
  };

  // ======================================================
  // 🔐 LOGIN / SIGNUP (CLEAN + KID FRIENDLY UI HOOK)
  // ======================================================
  if (!isLoggedIn) {
    return (
      <div className="kid-bg">
        <div className="kid-float kid1"></div>
        <div className="kid-float kid2"></div>
        <div className="kid-float kid3"></div>

        <div className="kid-card">
          <div className="kid-robot">🤖</div>

          <h1 className="kid-title">Learn with MAR</h1>
          <p className="kid-subtitle">
            Your Friendly AI Teacher
          </p>

          {isSignup && (
            <input
              className="kid-input"
              placeholder="👦 Your Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <input
            className="kid-input"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="kid-input"
            placeholder="🔒 Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="kid-button" onClick={handleAuth}>
            {isSignup ? "🚀 Create Account" : "🎓 Start Learning"}
          </button>

          <p
            className="kid-link"
            onClick={() => {
              setIsSignup(!isSignup);
              setFullName("");
              setPassword("");
            }}
          >
            {isSignup
              ? "Already have account? Login"
              : "New here? Create account"}
          </p>

          <p className="kid-footer">
            🧠 Learn English with fun AI conversations
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN APP
  // ======================================================
  return (
    <div className="app-container">
      <div className="app-card">
        <h1 className="app-title">Learn with MAR</h1>

        <p className="app-subtitle">
          Personalized AI Learning
        </p>

        {/* 🤖 AVATAR */}
        <div className="avatar-wrapper">
          <Avatar state={avatarState} />
        </div>

        {!selectedLanguage ? (
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageSelect={setSelectedLanguage}
          />
        ) : (
          <>
            <h2 className="app-heading">
              {selectedLanguage === "en"
                ? "Let's learn English together!"
                : "आइए हिन्दी सीखें!"}
            </h2>

            <Microphone
              onRecordingComplete={handleRecordingComplete}
            />
          </>
        )}

        <hr />

        <div className="chat-box">
          <p><b>👧 You:</b> {recognizedText || "-"}</p>
          <p><b>🤖 MAR:</b> {teacherResponse || "-"}</p>
        </div>

        <hr />

        <p className="status">
          <b>Status:</b> {status}
        </p>
      </div>
    </div>
  );
}

export default App;