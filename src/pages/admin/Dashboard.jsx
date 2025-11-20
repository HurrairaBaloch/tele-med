import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { FaUsers, FaUserMd, FaCalendarAlt, FaVideo } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { adminAPI } from '../../services/api';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const stats = dashboardData?.overview || {};

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients || 0,
      icon: <FaUsers className="text-5xl text-primary-200" />,
      className: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white',
      route: '/admin/users?tab=patients',
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors || 0,
      icon: <FaUserMd className="text-5xl text-secondary-200" />,
      className: 'bg-gradient-to-br from-secondary-500 to-secondary-600 text-white',
      route: '/admin/users?tab=doctors',
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments || 0,
      icon: <FaCalendarAlt className="text-5xl text-accent-200" />,
      className: 'bg-gradient-to-br from-accent-400 to-accent-500 text-white',
      route: '/admin/monitoring',
    },
    {
      title: 'Consultations',
      value: stats.totalConsultations || 0,
      icon: <FaVideo className="text-5xl text-green-200" />,
      className: 'bg-gradient-to-br from-success to-green-600 text-white',
      route: '/admin/reports',
    },
  ];

  // Chart data
  const appointmentStatusData = {
    labels: dashboardData?.appointmentsByStatus?.map(item => item._id) || [],
    datasets: [{
      label: 'Appointments',
      data: dashboardData?.appointmentsByStatus?.map(item => item.count) || [],
      backgroundColor: ['#0077B6', '#00B4D8', '#90E0EF', '#EF4444'],
    }]
  };

  const monthlyTrendData = {
    labels: dashboardData?.monthlyTrend?.map(item => `${item._id.month}/${item._id.year}`) || [],
    datasets: [{
      label: 'Appointments',
      data: dashboardData?.monthlyTrend?.map(item => item.count) || [],
      borderColor: '#0077B6',
      backgroundColor: 'rgba(0, 119, 182, 0.1)',
      tension: 0.4
    }]
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Dashboard</h1>
          <p className="text-neutral-600">System overview and analytics</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <motion.button
              key={card.title}
              type="button"
              onClick={() => navigate(card.route)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className={`w-full text-left card ${card.className} focus:outline-none focus:ring-2 focus:ring-white/70`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 mb-1">{card.title}</p>
                  <h3 className="text-4xl font-bold">{card.value}</h3>
                </div>
                {card.icon}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Appointments by Status</h2>
            <Doughnut data={appointmentStatusData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Monthly Trend</h2>
            <Line data={monthlyTrendData} />
          </motion.div>
        </div>

        {/* Pending Approvals */}
        {stats.pendingDoctors > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card bg-warning/10 border-2 border-warning"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Pending Doctor Approvals</h3>
                <p className="text-neutral-600">{stats.pendingDoctors} doctors waiting for approval</p>
              </div>
              <button
                onClick={() => navigate('/admin/users?tab=pending')}
                className="btn-primary"
              >
                Review Now
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

