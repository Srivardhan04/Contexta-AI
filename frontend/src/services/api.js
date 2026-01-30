import axios from "axios";

const API_BASE = "http://localhost:8000";

/* ================= UPLOAD PDF ================= */
export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_BASE}/upload-paper`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );

  return response.data;
};

/* ================= ASK QUESTION ================= */
export const askQuestion = async (question) => {
  const response = await axios.get(
    `${API_BASE}/ask-question`,
    {
      params: { q: question }
    }
  );

  return response.data;
};

/* ================= DEFINE TERM ================= */
export const defineTerm = async (term) => {
  const response = await axios.get(
    `${API_BASE}/define-term`,
    {
      params: { term }
    }
  );

  return response.data;
};
