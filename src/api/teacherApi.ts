import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export type Language = "en" | "hi";

export interface AudioChatResponse {
  recognized_text: string;
  detected_language: string;
  teacher_response: string;
  audio_url: string;
}

export async function sendAudio(
  audioBlob: Blob,
  language: Language
): Promise<AudioChatResponse> {
  const formData = new FormData();

  formData.append("file", audioBlob, "speech.webm");
  formData.append("language", language);

  const response = await api.post<AudioChatResponse>(
    "/teacher/audio-chat",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}