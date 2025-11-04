import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaVideo,
  FaCheck,
  FaTimes,
  FaFilter
} from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { doctorAPI, appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * Doctor Appointments Page
 * Displays and manages all doctor appointments with filtering and actions
 */
const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled
  const [selectedDate, setSelectedDate] = useState('');

  /**
   * Fetch appointments on component mount and when filter changes
   */
  useEffect(() => {
    fetchAppointments();
  }, [filter, selectedDate]);

  /**
   * Fetch appointments from API
   */
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};

      if (filter !== 'all') {
        params.status = filter;
      }

      if (selectedDate) {
        params.date = selectedDate;
      }

      const response = await doctorAPI.getAppointments(params);
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle appointment status update
   */
  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await appointmentAPI.updateStatus(appointmentId, { status });
      toast.success(`Appointment ${status} successfully`);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  /**
   * Handle start consultation
   */
  const handleStartConsultation = (appointmentId) => {
    navigate(`/doctor/consultation/${appointmentId}`);
  };

  /**
   * Get status badge color
   */
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-neutral-100 text-neutral-800';
  };

  /**
   * Format time slot
   */
  const formatTimeSlot = (timeSlot) => {
    return timeSlot || 'Not specified';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-neutral-900">My Appointments</h1>
          <p className="text-neutral-600 mt-1">Manage your patient appointments</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <FaFilter className="text-neutral-500" />
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      filter === status
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-neutral-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </motion.div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center py-12"
          >
            <FaCalendarAlt className="text-6xl text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600">No appointments found</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Appointment Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                          <FaUser className="mr-2 text-primary-500" />
                          {appointment.patient?.firstName} {appointment.patient?.lastName}
                        </h3>
                        <p className="text-sm text-neutral-600 mt-1">
                          {appointment.patient?.email}
                        </p>
                      </div>
                      <span className={`badge ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-neutral-600">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-neutral-400" />
                        {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-neutral-400" />
                        {formatTimeSlot(appointment.timeSlot)}
                      </div>
                    </div>

                    {appointment.reason && (
                      <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
                        <p className="text-sm text-neutral-700">
                          <strong>Reason:</strong> {appointment.reason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:w-48">
                    {appointment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                          className="btn-primary flex items-center justify-center text-sm"
                        >
                          <FaCheck className="mr-2" />
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                          className="btn-outline text-red-600 hover:bg-red-50 flex items-center justify-center text-sm"
                        >
                          <FaTimes className="mr-2" />
                          Cancel
                        </button>
                      </>
                    )}

                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => handleStartConsultation(appointment._id)}
                        className="btn-primary flex items-center justify-center text-sm"
                      >
                        <FaVideo className="mr-2" />
                        Start Consultation
                      </button>
                    )}

                    {appointment.status === 'completed' && (
                      <button
                        onClick={() => navigate(`/doctor/patients/${appointment.patient._id}`)}
                        className="btn-outline flex items-center justify-center text-sm"
                      >
                        <FaUser className="mr-2" />
                        View Patient
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && appointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="card bg-primary-50"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary-600">
                  {appointments.filter(a => a.status === 'pending').length}
                </p>
                <p className="text-sm text-neutral-600">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </p>
                <p className="text-sm text-neutral-600">Confirmed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {appointments.filter(a => a.status === 'completed').length}
                </p>
                <p className="text-sm text-neutral-600">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {appointments.filter(a => a.status === 'cancelled').length}
                </p>
                <p className="text-sm text-neutral-600">Cancelled</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorAppointments;

