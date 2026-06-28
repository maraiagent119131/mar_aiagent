type AvatarProps = {
  state?: "idle" | "listening" | "talking";
};

export default function Avatar({ state = "idle" }: AvatarProps) {
  return (
    <div className={`avatar ${state}`}>
      <video
        src="http://127.0.0.1:8000/avatars/robot.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "260px",
          borderRadius: "16px",
          transition: "all 0.3s ease",
        }}
      />
    </div>
  );
}