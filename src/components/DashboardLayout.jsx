import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaPrescriptionBottleAlt,
  FaFileAlt,
  FaBell,
  FaStar,
  FaUsers,
  FaChartBar,
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserMd
} from 'react-icons/fa';

/**
 * Dashboard Layout Component
 * Shared layout for all dashboard pages with sidebar navigation
 */
const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation items based on role
  const getNavItems = () => {
    if (user?.role === 'patient') {
      return [
        { path: '/patient/dashboard', icon: <FaHome />, label: 'Dashboard' },
        { path: '/patient/profile', icon: <FaUser />, label: 'Profile' },
        { path: '/patient/book-appointment', icon: <FaCalendarAlt />, label: 'Book Appointment' },
        { path: '/patient/prescriptions', icon: <FaPrescriptionBottleAlt />, label: 'Prescriptions' },
        { path: '/patient/records', icon: <FaFileAlt />, label: 'Medical Records' },
        { path: '/patient/notifications', icon: <FaBell />, label: 'Notifications' },
      ];
    } else if (user?.role === 'doctor') {
      return [
        { path: '/doctor/dashboard', icon: <FaHome />, label: 'Dashboard' },
        { path: '/doctor/profile', icon: <FaUser />, label: 'Profile' },
        { path: '/doctor/appointments', icon: <FaCalendarAlt />, label: 'Appointments' },
        { path: '/doctor/patients', icon: <FaUsers />, label: 'Patients' },
        { path: '/doctor/notifications', icon: <FaBell />, label: 'Notifications' },
      ];
    } else if (user?.role === 'admin') {
      return [
        { path: '/admin/dashboard', icon: <FaHome />, label: 'Dashboard' },
        { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
        { path: '/admin/monitoring', icon: <FaChartBar />, label: 'Monitoring' },
        { path: '/admin/reports', icon: <FaFileAlt />, label: 'Reports' },
        { path: '/admin/security', icon: <FaShieldAlt />, label: 'Security' },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-neutral-700 hover:text-primary-500 mr-4"
              >
                {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <FaUserMd className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold text-primary-600 hidden sm:block">Smart Telemedicine</span>
              </Link>
            </div>

            {/* User Info & Notifications */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <NotificationBell />

              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-neutral-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } mt-16 lg:mt-0`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-red-50 hover:text-error transition-all duration-200 mt-4"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;

