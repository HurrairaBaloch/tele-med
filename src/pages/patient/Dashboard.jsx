import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaPrescriptionBottleAlt, 
  FaFileAlt, 
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { patientAPI, appointmentAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

/**
 * Patient Dashboard
 * Overview of patient's appointments, prescriptions, and health records
 */
const PatientDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalPrescriptions: 0,
    medicalRecords: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch appointments
      const appointmentsRes = await patientAPI.getAppointments({ status: 'confirmed' });
      const appointments = appointmentsRes.data.data || [];
      
      // Fetch prescriptions
      const prescriptionsRes = await patientAPI.getPrescriptions();
      const prescriptions = prescriptionsRes.data.data || [];

      // Fetch medical records
      const recordsRes = await patientAPI.getMedicalRecords();
      const records = recordsRes.data.data || [];

      setStats({
        upcomingAppointments: appointments.length,
        totalPrescriptions: prescriptions.length,
        medicalRecords: records.length
      });

      setUpcomingAppointments(appointments.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: 'badge badge-success',
      pending: 'badge badge-warning',
      completed: 'badge badge-info',
      cancelled: 'badge badge-error'
    };
    return badges[status] || 'badge';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-neutral-600">Here's an overview of your health dashboard</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 mb-1">Upcoming Appointments</p>
                <h3 className="text-4xl font-bold">{stats.upcomingAppointments}</h3>
              </div>
              <FaCalendarAlt className="text-5xl text-primary-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card bg-gradient-to-br from-secondary-500 to-secondary-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-100 mb-1">Prescriptions</p>
                <h3 className="text-4xl font-bold">{stats.totalPrescriptions}</h3>
              </div>
              <FaPrescriptionBottleAlt className="text-5xl text-secondary-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card bg-gradient-to-br from-accent-400 to-accent-500 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-100 mb-1">Medical Records</p>
                <h3 className="text-4xl font-bold">{stats.medicalRecords}</h3>
              </div>
              <FaFileAlt className="text-5xl text-accent-200" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/patient/book-appointment"
              className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <FaCalendarAlt className="text-2xl text-primary-600" />
              <span className="font-medium text-primary-700">Book Appointment</span>
            </Link>
            <Link
              to="/patient/prescriptions"
              className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <FaPrescriptionBottleAlt className="text-2xl text-secondary-600" />
              <span className="font-medium text-secondary-700">View Prescriptions</span>
            </Link>
            <Link
              to="/patient/records"
              className="flex items-center space-x-3 p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors"
            >
              <FaFileAlt className="text-2xl text-accent-600" />
              <span className="font-medium text-accent-700">Medical Records</span>
            </Link>
            <Link
              to="/patient/profile"
              className="flex items-center space-x-3 p-4 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              <FaClock className="text-2xl text-neutral-600" />
              <span className="font-medium text-neutral-700">Update Profile</span>
            </Link>
          </div>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Upcoming Appointments</h2>
            <Link to="/patient/book-appointment" className="text-primary-600 hover:text-primary-700 font-medium">
              View All
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="text-6xl text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 mb-4">No upcoming appointments</p>
              <Link to="/patient/book-appointment" className="btn-primary">
                Book Your First Appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <FaCalendarAlt className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                      </h3>
                      <p className="text-sm text-neutral-600">{appointment.doctor?.specialization}</p>
                      <p className="text-sm text-neutral-500">
                        {formatDate(appointment.appointmentDate)} at {appointment.appointmentTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={getStatusBadge(appointment.status)}>
                      {appointment.status}
                    </span>
                    {appointment.status === 'confirmed' && (
                      <Link
                        to={`/patient/consultation/${appointment._id}`}
                        className="btn-primary text-sm"
                      >
                        Join
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Health Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card bg-gradient-to-br from-primary-50 to-secondary-50"
        >
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">💡 Health Tip of the Day</h2>
          <p className="text-neutral-700">
            Stay hydrated! Drinking adequate water helps maintain body temperature, keeps joints lubricated, 
            and helps deliver nutrients to cells. Aim for 8 glasses of water per day.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;

