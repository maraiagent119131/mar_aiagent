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

  const [status, setStatus] = useState("Ready");

  const [avatarState, setAvatarState] =
    useState<AvatarState>("idle");

  // AUTH
  const handleAuth = async () => {
    if (!email || !password || (isSignup && !fullName)) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (isSignup) {
        await signupUser(fullName, email, password);
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
    }
  };

  // AUDIO FLOW
  const handleRecordingComplete = async (_: string, blob: Blob) => {
    if (!selectedLanguage) return;

    try {
      setAvatarState("listening");
      setStatus("Listening...");

      const response = await sendAudio(blob, selectedLanguage);

      setRecognizedText(response.recognized_text);
      setTeacherResponse(response.teacher_response);

      setAvatarState("talking");
      setStatus("Speaking...");

      const audio = new Audio(
        `http://127.0.0.1:8000${response.audio_url}`
      );

      audio.play();

      audio.onended = () => {
        setAvatarState("idle");
        setStatus("Ready");
      };
    } catch (e) {
      setAvatarState("idle");
      setStatus("Error");
    }
  };

  // ======================================================
  // 🔐 AUTH UI (CENTERED + MODERN CARD)
  // ======================================================
  if (!isLoggedIn) {
    return (
      <div className="auth-bg">
        <div className="auth-card">

          <div className="auth-robot">🤖</div>

          <h1 className="auth-title">Learn with MAR</h1>
          <p className="auth-subtitle">
            Your Personal AI English Teacher
          </p>

          {isSignup && (
            <input
              className="auth-input"
              placeholder="Your Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <input
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-button" onClick={handleAuth}>
            {isSignup ? "Create Account" : "Start Learning"}
          </button>

          <p
            className="auth-switch"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? "Already have account? Login"
              : "New here? Create account"}
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // 🎓 MAIN APP UI (EDTECH DASHBOARD)
  // ======================================================
  return (
    <div className="edu-bg">

      <div className="edu-container">

        {/* HEADER */}
        <div className="edu-header">
          <h1>Learn with MAR</h1>
          <p>AI Learning Companion for Kids</p>
        </div>

        {/* AVATAR */}
        <div className={`edu-avatar ${avatarState}`}>
          <Avatar state={avatarState} />
        </div>

        {/* LANGUAGE CARD */}
        {!selectedLanguage ? (
          <div className="edu-card">
            <h2>Choose Your Language</h2>
            <p>Start your learning journey</p>

            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageSelect={setSelectedLanguage}
            />
          </div>
        ) : (
          <div className="edu-card">
            <h2>
              {selectedLanguage === "en"
                ? "English Learning Mode"
                : "Hindi Learning Mode"}
            </h2>

            <Microphone
              onRecordingComplete={handleRecordingComplete}
            />
          </div>
        )}

        {/* CHAT */}
        <div className="edu-chat">
          <div className="edu-msg">
            <span>You:</span> {recognizedText || "Speak something..."}
          </div>

          <div className="edu-msg">
            <span>MAR:</span> {teacherResponse || "Waiting..."}
          </div>
        </div>

        {/* STATUS */}
        <div className="edu-status">
          {status}
        </div>

      </div>
    </div>
  );
}

export default App;