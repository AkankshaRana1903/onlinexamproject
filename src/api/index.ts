import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (name: string, email: string, password: string, role: string = 'student') => {
    return api.post('/auth/register', { name, email, password, role });
  },
  
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  getCurrentUser: () => 
    api.get('/auth/me')
};

// Exams API
export const examsAPI = {
  getExams: (params?: { category?: string, search?: string, page?: number, limit?: number }) => 
    api.get('/exams', { params }),
  
  getExam: (id: string) => 
    api.get(`/exams/${id}`),
  
  createExam: (examData: any) => 
    api.post('/exams', examData),
  
  updateExam: (id: string, examData: any) => 
    api.put(`/exams/${id}`, examData),
  
  deleteExam: (id: string) => 
    api.delete(`/exams/${id}`),
  
  getMyExams: (params?: { page?: number, limit?: number }) => 
    api.get('/exams/my/exams', { params })
};

// Attempts API
export const attemptsAPI = {
  startExamAttempt: (examId: string) => 
    api.post(`/attempts/start/${examId}`),
  
  submitExamAttempt: (attemptId: string, data: any) => 
    api.post(`/attempts/submit/${attemptId}`, data),
  
  getUserAttempts: () => 
    api.get('/attempts/my'),
  
  getAttempt: (id: string) => 
    api.get(`/attempts/${id}`),
  
  getExamAttempts: (examId: string, params?: { page?: number, limit?: number }) => 
    api.get(`/attempts/exam/${examId}`, { params }),
  
  gradeSubjectiveAnswers: (attemptId: string, grades: any[]) => 
    api.post(`/attempts/grade/${attemptId}`, { grades })
};

// Certificates API
export const certificatesAPI = {
  getUserCertificates: () => 
    api.get('/certificates/my'),
  
  getCertificate: (id: string) => 
    api.get(`/certificates/${id}`),
  
  verifyCertificate: (certificateNumber: string) => 
    api.get(`/certificates/verify/${certificateNumber}`)
};

export default api;