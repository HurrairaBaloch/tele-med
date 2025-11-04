import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaBell,
  FaCheck,
  FaCheckDouble,
  FaTimes,
  FaFilter
} from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { notificationAPI } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * Patient Notifications Page
 * Displays all notifications for the patient with filtering and actions
 */
const PatientNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /**
   * Fetch notifications on component mount and when filter/page changes
   */
  useEffect(() => {
    fetchNotifications();
  }, [filter, page]);

  /**
   * Fetch notifications from API
   */
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20
      };

      if (filter === 'unread') {
        params.isRead = false;
      } else if (filter === 'read') {
        params.isRead = true;
      }

      const response = await notificationAPI.getAll(params);
      setNotifications(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mark a notification as read
   */
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  /**
   * Mark all notifications as read
   */
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  /**
   * Delete a notification
   */
  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.delete(notificationId);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  /**
   * Get notification icon based on type
   */
  const getNotificationIcon = (type) => {
    const iconMap = {
      'appointment-booked': '📅',
      'appointment-confirmed': '✅',
      'appointment-cancelled': '❌',
      'appointment-rescheduled': '🔄',
      'appointment-reminder': '⏰',
      'consultation-started': '🎥',
      'consultation-ended': '✔️',
      'prescription-available': '💊',
      'general': '📢'
    };
    return iconMap[type] || '🔔';
  };

  /**
   * Get time ago string
   */
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  };

  /**
   * Get priority badge color
   */
  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Notifications</h1>
            <p className="text-neutral-600 mt-1">Stay updated with your appointments and prescriptions</p>
          </div>

          {notifications.some(n => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn-primary flex items-center"
            >
              <FaCheckDouble className="mr-2" />
              Mark All as Read
            </button>
          )}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center space-x-4">
            <FaFilter className="text-neutral-500" />
            <div className="flex space-x-2">
              <button
                onClick={() => { setFilter('all'); setPage(1); }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => { setFilter('unread'); setPage(1); }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => { setFilter('read'); setPage(1); }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'read'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Read
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center py-12"
          >
            <FaBell className="text-6xl text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600">No notifications found</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`card hover:shadow-lg transition-shadow ${
                  !notification.isRead ? 'border-l-4 border-primary-500 bg-primary-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="text-4xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {notification.title}
                        </h3>
                        <p className="text-neutral-600 mt-1">{notification.message}</p>
                      </div>

                      {/* Priority Badge */}
                      <span className={`badge ${getPriorityColor(notification.priority)} ml-2`}>
                        {notification.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-neutral-500">
                        {getTimeAgo(notification.createdAt)}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center space-x-3">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
                          >
                            <FaCheck className="mr-1" />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="text-red-600 hover:text-red-700 flex items-center text-sm font-medium"
                        >
                          <FaTimes className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center space-x-2"
          >
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-neutral-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-outline disabled:opacity-50"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientNotifications;

