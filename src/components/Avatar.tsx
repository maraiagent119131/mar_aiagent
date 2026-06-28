import { useState } from "react";

export default function Avatar() {
  const [state, setState] = useState("idle");

  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <video
        src="http://127.0.0.1:8000/avatars/robot.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "250px",
          borderRadius: "16px",
        }}
      />
    </div>
  );
}