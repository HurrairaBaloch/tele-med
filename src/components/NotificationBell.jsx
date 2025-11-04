import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaTimes, FaCheck, FaCheckDouble } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

/**
 * NotificationBell Component
 * Displays notification icon with unread count badge
 * Shows dropdown with recent notifications
 * Integrates with Socket.IO for real-time updates
 */
const NotificationBell = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const socketRef = useRef(null);

  /**
   * Initialize component - fetch notifications and setup Socket.IO
   */
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
      setupSocketConnection();
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Setup Socket.IO connection for real-time notifications
   */
  const setupSocketConnection = () => {
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true
    });

    // Listen for new notifications
    socketRef.current.on('new-notification', (notification) => {
      console.log('📬 New notification received:', notification);
      
      // Add to notifications list
      setNotifications(prev => [notification, ...prev].slice(0, 10));
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast.success(notification.title, {
        duration: 4000,
        icon: '🔔'
      });
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected for notifications');
      // Join user's notification room
      if (user) {
        socketRef.current.emit('join-notification-room', user._id);
      }
    });
  };

  /**
   * Fetch recent notifications from API
   */
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getAll({ limit: 10 });
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch unread notification count
   */
  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data.data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  /**
   * Mark a single notification as read
   */
  const handleMarkAsRead = async (notificationId, event) => {
    event.stopPropagation();
    
    try {
      await notificationAPI.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  /**
   * Mark all notifications as read
   */
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  /**
   * Delete a notification
   */
  const handleDelete = async (notificationId, event) => {
    event.stopPropagation();
    
    try {
      await notificationAPI.delete(notificationId);
      
      // Update local state
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      
      // Update unread count if notification was unread
      const notification = notifications.find(n => n._id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
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
      'doctor-approved': '👨‍⚕️',
      'doctor-rejected': '⛔',
      'feedback-received': '⭐',
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
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  /**
   * Get notification link based on role and type
   */
  const getNotificationLink = () => {
    if (!user) return '#';
    
    const roleLinks = {
      patient: '/patient/notifications',
      doctor: '/doctor/notifications',
      admin: '/admin/monitoring'
    };
    
    return roleLinks[user.role] || '#';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-neutral-600 hover:text-primary-600 transition-colors"
        aria-label="Notifications"
      >
        <FaBell className="text-2xl" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-neutral-200 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                  <FaCheckDouble className="mr-1" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="spinner"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <FaBell className="text-4xl mx-auto mb-2 text-neutral-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 hover:bg-neutral-50 transition-colors ${
                        !notification.isRead ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-neutral-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {getTimeAgo(notification.createdAt)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => handleMarkAsRead(notification._id, e)}
                              className="text-primary-600 hover:text-primary-700"
                              title="Mark as read"
                            >
                              <FaCheck className="text-sm" />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDelete(notification._id, e)}
                            className="text-neutral-400 hover:text-red-600"
                            title="Delete"
                          >
                            <FaTimes className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-neutral-200 text-center">
                <Link
                  to={getNotificationLink()}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

