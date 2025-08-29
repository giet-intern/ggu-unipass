import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const addReceipt = (formData) =>
  axios.post(`${API}/receipts/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
