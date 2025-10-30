import axios from 'axios';

/**
 * Axios instance with base configuration
 * Automatically includes auth token in requests
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ============================================
// PATIENT API
// ============================================
export const patientAPI = {
  getProfile: () => api.get('/patients/profile'),
  updateProfile: (data) => api.put('/patients/profile', data),
  getAppointments: (params) => api.get('/patients/appointments', { params }),
  getPrescriptions: (params) => api.get('/patients/prescriptions', { params }),
  getMedicalRecords: (params) => api.get('/patients/medical-records', { params }),
  uploadMedicalRecord: (data) => api.post('/patients/medical-records', data),
  deleteMedicalRecord: (id) => api.delete(`/patients/medical-records/${id}`),
};

// ============================================
// DOCTOR API
// ============================================
export const doctorAPI = {
  search: (params) => api.get('/doctors/search', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  getProfile: () => api.get('/doctors/profile'),
  updateProfile: (data) => api.put('/doctors/profile', data),
  getAppointments: (params) => api.get('/doctors/appointments', { params }),
  getPatients: () => api.get('/doctors/patients'),
  getPatientHistory: (patientId) => api.get(`/doctors/patients/${patientId}/history`),
  updateAvailability: (data) => api.put('/doctors/availability', data),
  getStats: () => api.get('/doctors/stats'),
};

// ============================================
// APPOINTMENT API
// ============================================
export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getById: (id) => api.get(`/appointments/${id}`),
  updateStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
  cancel: (id, data) => api.put(`/appointments/${id}/cancel`, data),
  reschedule: (id, data) => api.put(`/appointments/${id}/reschedule`, data),
  getAvailableSlots: (doctorId, params) => api.get(`/appointments/slots/${doctorId}`, { params }),
};

// ============================================
// CONSULTATION API
// ============================================
export const consultationAPI = {
  create: (data) => api.post('/consultations', data),
  getById: (id) => api.get(`/consultations/${id}`),
  update: (id, data) => api.put(`/consultations/${id}`, data),
  end: (id) => api.put(`/consultations/${id}/end`),
  getHistory: (patientId) => api.get(`/consultations/history/${patientId}`),
};

// ============================================
// PRESCRIPTION API
// ============================================
export const prescriptionAPI = {
  create: (data) => api.post('/prescriptions', data),
  getById: (id) => api.get(`/prescriptions/${id}`),
  getPatientPrescriptions: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  update: (id, data) => api.put(`/prescriptions/${id}`, data),
  delete: (id) => api.delete(`/prescriptions/${id}`),
};

// ============================================
// NOTIFICATION API
// ============================================
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// ============================================
// FEEDBACK API
// ============================================
export const feedbackAPI = {
  create: (data) => api.post('/feedback', data),
  getDoctorFeedback: (doctorId, params) => api.get(`/feedback/doctor/${doctorId}`, { params }),
  update: (id, data) => api.put(`/feedback/${id}`, data),
  delete: (id) => api.delete(`/feedback/${id}`),
  respond: (id, data) => api.post(`/feedback/${id}/respond`, data),
};

// ============================================
// ADMIN API
// ============================================
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, data) => api.put(`/admin/users/${id}/status`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPendingDoctors: () => api.get('/admin/doctors/pending'),
  approveDoctor: (id) => api.put(`/admin/doctors/${id}/approve`),
  rejectDoctor: (id, data) => api.put(`/admin/doctors/${id}/reject`, data),
  getAllAppointments: (params) => api.get('/admin/appointments', { params }),
  getAllConsultations: (params) => api.get('/admin/consultations', { params }),
  generateReport: (data) => api.post('/admin/reports', data),
};

export default api;

