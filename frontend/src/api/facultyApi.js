import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const facultyLogin = (username, password) =>
  axios.post(`${API}/faculty/login`, { username, password });

export const uploadDuesSheet = (file, username) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("username", username);
  return axios.post(`${API}/faculty/uploadSheet`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const generateHallticketFaculty = (pin) =>
  axios.get(`${API}/faculty/generateHallticket/${pin}`, {
    responseType: "blob",
  });
