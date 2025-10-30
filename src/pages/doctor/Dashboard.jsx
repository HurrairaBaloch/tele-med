import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaStar, FaDollarSign } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { doctorAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    averageRating: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await doctorAPI.getStats();
      setStats(response.data.data || stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome, Dr. {user?.firstName}! 👨‍⚕️
          </h1>
          <p className="text-neutral-600">Here's your practice overview</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 mb-1">Today's Appointments</p>
                <h3 className="text-4xl font-bold">{stats.todayAppointments}</h3>
              </div>
              <FaCalendarAlt className="text-5xl text-primary-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-br from-secondary-500 to-secondary-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-100 mb-1">Total Patients</p>
                <h3 className="text-4xl font-bold">{stats.totalPatients}</h3>
              </div>
              <FaUsers className="text-5xl text-secondary-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-br from-warning to-yellow-500 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 mb-1">Average Rating</p>
                <h3 className="text-4xl font-bold">{stats.averageRating.toFixed(1)}</h3>
              </div>
              <FaStar className="text-5xl text-yellow-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-br from-success to-green-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-1">Total Earnings</p>
                <h3 className="text-4xl font-bold">${stats.totalEarnings}</h3>
              </div>
              <FaDollarSign className="text-5xl text-green-200" />
            </div>
          </motion.div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Today's Schedule</h2>
          <p className="text-neutral-600">Your appointments will appear here</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;

