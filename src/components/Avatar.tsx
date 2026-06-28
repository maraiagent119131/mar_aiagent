export default function Avatar() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <video
        src="/avatars/robot.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "260px",
          borderRadius: "16px",
        }}
      />
    </div>
  );
}