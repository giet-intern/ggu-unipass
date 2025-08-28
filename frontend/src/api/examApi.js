import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const createExam = (payload) => axios.post(`${API}/exams/`, payload);

export const getExams = () => axios.get(`${API}/exams/`);

export const updateExam = (examId, payload) =>
  axios.put(`${API}/exams/${examId}`, payload);

export const deleteExam = (username, examId) =>
  axios.delete(`${API}/exams/${username}/mids/${examId}`);
