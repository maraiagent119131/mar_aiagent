type Language = "en" | "hi";

type LanguageSelectorProps = {
  selectedLanguage: Language | null;
  onLanguageSelect: (language: Language) => void;
};

export default function LanguageSelector({
  selectedLanguage,
  onLanguageSelect,
}: LanguageSelectorProps) {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "30px",
      }}
    >
      <h2>Select Language</h2>

      <p
        style={{
          color: "#666",
          marginTop: "10px",
          marginBottom: "25px",
        }}
      >
        Choose your preferred learning language.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => onLanguageSelect("en")}
          style={{
            padding: "16px 30px",
            fontSize: "20px",
            borderRadius: "10px",
            cursor: "pointer",
            backgroundColor:
              selectedLanguage === "en"
                ? "#2563eb"
                : "#ffffff",
            color:
              selectedLanguage === "en"
                ? "#ffffff"
                : "#000000",
            border: "2px solid #2563eb",
            minWidth: "180px",
          }}
        >
          🇬🇧 English
        </button>

        <button
          onClick={() => onLanguageSelect("hi")}
          style={{
            padding: "16px 30px",
            fontSize: "20px",
            borderRadius: "10px",
            cursor: "pointer",
            backgroundColor:
              selectedLanguage === "hi"
                ? "#2563eb"
                : "#ffffff",
            color:
              selectedLanguage === "hi"
                ? "#ffffff"
                : "#000000",
            border: "2px solid #2563eb",
            minWidth: "180px",
          }}
        >
          🇮🇳 हिन्दी
        </button>
      </div>
    </div>
  );
}