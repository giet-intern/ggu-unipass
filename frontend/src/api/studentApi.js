import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const searchStudent = (pin) =>
  axios.get(`${API}/student/searchStudent/${pin}`);

export const generateHallticket = (pin) =>
  axios.get(`${API}/student/generateHallticket/${pin}`, {
    responseType: "blob",
  });

export const uploadReceipt = (pin, formData) =>
  axios.post(`${API}/receipts/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
