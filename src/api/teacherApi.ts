import api from "./client";

export const sendAudio = async (
  blob: Blob,
  language: string
) => {
  const formData = new FormData();

  formData.append("file", blob);
  formData.append("language", language);

  const response = await api.post(
    "/teacher/audio-chat",
    formData
  );

  return response.data;
};