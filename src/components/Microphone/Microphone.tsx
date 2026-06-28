import { ReactMediaRecorder } from "react-media-recorder";

type MicrophoneProps = {
  onRecordingComplete: (blobUrl: string, blob: Blob) => void;
};

export default function Microphone({
  onRecordingComplete,
}: MicrophoneProps) {
  return (
    <ReactMediaRecorder
      audio
      onStop={(blobUrl, blob) => {
        onRecordingComplete(blobUrl, blob);
      }}
      render={({
        status,
        startRecording,
        stopRecording,
      }) => (
        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          <h3>Status: {status}</h3>

          {status !== "recording" ? (
            <button
              onClick={startRecording}
              style={{
                fontSize: "22px",
                padding: "18px 40px",
                borderRadius: "50px",
                border: "none",
                background: "#2563eb",
                color: "white",
                cursor: "pointer",
              }}
            >
              🎤 Start Speaking
            </button>
          ) : (
            <button
              onClick={stopRecording}
              style={{
                fontSize: "22px",
                padding: "18px 40px",
                borderRadius: "50px",
                border: "none",
                background: "#dc2626",
                color: "white",
                cursor: "pointer",
              }}
            >
              ⏹ Stop Recording
            </button>
          )}
        </div>
      )}
    />
  );
}