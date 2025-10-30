import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Import components
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import PatientProfile from './pages/patient/Profile';
import BookAppointment from './pages/patient/BookAppointment';
import PatientConsultation from './pages/patient/Consultation';
import PatientPrescriptions from './pages/patient/Prescriptions';
import PatientRecords from './pages/patient/Records';
import PatientFeedback from './pages/patient/Feedback';
import PatientNotifications from './pages/patient/Notifications';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorProfile from './pages/doctor/Profile';
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorConsultation from './pages/doctor/Consultation';
import DoctorPrescription from './pages/doctor/Prescription';
import DoctorPatients from './pages/doctor/Patients';
import DoctorNotifications from './pages/doctor/Notifications';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminMonitoring from './pages/admin/Monitoring';
import AdminReports from './pages/admin/Reports';
import AdminSecurity from './pages/admin/Security';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1F2937',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />

            {/* Patient Routes */}
            <Route 
              path="/patient/dashboard" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/profile" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/book-appointment" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <BookAppointment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/consultation/:id" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientConsultation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/prescriptions" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientPrescriptions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/records" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientRecords />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/feedback/:doctorId" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientFeedback />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/notifications" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientNotifications />
                </ProtectedRoute>
              } 
            />

            {/* Doctor Routes */}
            <Route 
              path="/doctor/dashboard" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/profile" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/appointments" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorAppointments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/consultation/:id" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorConsultation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/prescription/:patientId" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorPrescription />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/patients" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorPatients />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/notifications" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorNotifications />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/monitoring" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminMonitoring />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/security" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSecurity />
                </ProtectedRoute>
              } 
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

