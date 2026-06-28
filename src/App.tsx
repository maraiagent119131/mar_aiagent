import { useState } from "react";

import { sendAudio } from "./api/teacherApi";
import LanguageSelector from "./components/LanguageSelector/LanguageSelector";
import Microphone from "./components/Microphone/Microphone";

type Language = "en" | "hi";

function App() {
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language | null>(null);

  const [recordingUrl, setRecordingUrl] =
    useState<string | null>(null);

  const [recognizedText, setRecognizedText] =
    useState("");

  const [teacherResponse, setTeacherResponse] =
    useState("");

  const [status, setStatus] =
    useState("🟢 Ready");

  const handleRecordingComplete = async (
    blobUrl: string,
    blob: Blob
  ) => {
    if (!selectedLanguage) {
      alert("Please select a language first.");
      return;
    }

    setRecordingUrl(blobUrl);

    setStatus("⏳ Sending audio...");

    try {
      const response = await sendAudio(
        blob,
        selectedLanguage
      );

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
        <h1
          style={{
            textAlign: "center",
            color: "#2563eb",
          }}
        >
          Learn with MAR
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
          }}
        >
          Personalized AI Learning
        </p>

        <div
          style={{
            textAlign: "center",
            fontSize: "80px",
          }}
        >
          😊
        </div>

        {!selectedLanguage ? (
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageSelect={setSelectedLanguage}
          />
        ) : (
          <>
            <h2
              style={{
                textAlign: "center",
              }}
            >
              {selectedLanguage === "en"
                ? "Let's learn English together!"
                : "आइए हिन्दी सीखें!"}
            </h2>

            <p
              style={{
                textAlign: "center",
                color: "green",
                fontWeight: "bold",
              }}
            >
              Selected Language:{" "}
              {selectedLanguage === "en"
                ? "English 🇬🇧"
                : "हिन्दी 🇮🇳"}
            </p>

            <Microphone
              onRecordingComplete={
                handleRecordingComplete
              }
            />
          </>
        )}

        {recordingUrl && (
          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
            }}
          >
            <audio
              controls
              src={recordingUrl}
            />
          </div>
        )}

        <hr style={{ margin: "30px 0" }} />

        <h3>Conversation</h3>

        <p>
          <strong>👧 You:</strong>{" "}
          {recognizedText || "-"}
        </p>

        <p>
          <strong>🤖 MAR:</strong>{" "}
          {teacherResponse || "-"}
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