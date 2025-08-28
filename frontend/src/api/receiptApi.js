import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const addReceipt = (pin, receipt_url) =>
  axios.post(`${API}/faculty/addReceipt`, { pin, receipt_url });
