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
      alert("Please fill all required fields");
      return;
    }

    try {
      if (isSignup) {
        await signupUser(fullName, email, password);
        alert("Account created! Please login.");
        setIsSignup(false);
        setFullName("");
        setPassword("");
        return;
      }

      const data = await loginUser(email, password);
      setToken(data.access_token);
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
      alert(isSignup ? "Signup failed" : "Invalid credentials");
    }
  };

  // ======================================================
  // AUDIO FLOW (AVATAR INTELLIGENCE ENGINE)
  // ======================================================
  const handleRecordingComplete = async (_: string, blob: Blob) => {
    if (!selectedLanguage) {
      alert("Select language first");
      return;
    }

    try {
      setAvatarState("listening");
      setStatus("🎧 Listening...");

      const response = await sendAudio(blob, selectedLanguage);

      setRecognizedText(response.recognized_text);
      setTeacherResponse(response.teacher_response);

      setAvatarState("talking");
      setStatus("🗣 Speaking...");

      const audio = new Audio(
        `http://127.0.0.1:8000${response.audio_url}`
      );

      audio.play();

      audio.onended = () => {
        setAvatarState("idle");
        setStatus("🟢 Ready");
      };
    } catch (error) {
      console.error(error);
      setAvatarState("idle");
      setStatus("❌ Error");
    }
  };

  // ======================================================
  // 🔐 AUTH SCREEN (KID EDUCATIONAL DESIGN)
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
            Your AI Learning Teacher
          </p>

          {isSignup && (
            <input
              className="kid-input"
              placeholder="Your Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <input
            className="kid-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="kid-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="kid-button" onClick={handleAuth}>
            {isSignup ? "Create Account" : "Start Learning"}
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
            Learn English with AI conversations
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN APP (EDUCATION DASHBOARD)
  // ======================================================
  return (
    <div className="edu-bg">
      <div className="edu-container">

        {/* HEADER */}
        <div className="edu-header">
          <h1>Learn with MAR</h1>
          <p>Personalized AI Learning Assistant</p>
        </div>

        {/* AVATAR */}
        <div className="edu-avatar">
          <Avatar state={avatarState} />
        </div>

        {/* LANGUAGE */}
        {!selectedLanguage ? (
          <div className="edu-card">
            <h2>Choose Language</h2>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageSelect={setSelectedLanguage}
            />
          </div>
        ) : (
          <div className="edu-card">
            <h2>
              {selectedLanguage === "en"
                ? "English Session"
                : "Hindi Session"}
            </h2>

            <Microphone
              onRecordingComplete={handleRecordingComplete}
            />
          </div>
        )}

        {/* CONVERSATION */}
        <div className="edu-chat">
          <h3>Conversation</h3>

          <div className="edu-msg">
            <b>You:</b> {recognizedText || "-"}
          </div>

          <div className="edu-msg">
            <b>MAR:</b> {teacherResponse || "-"}
          </div>
        </div>

        {/* STATUS */}
        <div className="edu-status">
          Status: {status}
        </div>

      </div>
    </div>
  );
}

export default App;