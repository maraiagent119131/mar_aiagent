export default function Avatar() {
  return (
    <video
      src="http://127.0.0.1:8000/avatars/robot.mp4"
      autoPlay
      loop
      muted
      playsInline
      style={{ width: "260px", borderRadius: "16px" }}
    />
  );
}